import * as React from "react";
import MuiTypography from "@mui/material/Typography";

/**
 * TypographyX — ergonomic wrapper around MUI Typography
 *
 * Props (in addition to all MUI Typography props):
 * - tone: "default"|"muted"|"primary"|"secondary"|"success"|"warning"|"danger"|"info"
 * - clamp: number | true     // true => 1 line; adds multi-line clamp
 * - ellipsis: boolean        // single-line truncate with ...
 * - weight: number|"regular"|"medium"|"semibold"|"bold"
 * - mb: "none"|"xs"|"sm"|"md"|"lg"   // bottom margin scale
 * - responsive: { xs?, sm?, md?, lg?, xl? } // per-breakpoint variant names
 *
 * Everything else is passed through to MUI <Typography />.
 */
const FW = { regular: 400, medium: 500, semibold: 600, bold: 700 };
const MARGINS = { none: 0, xs: "var(--g-s1)", sm: "var(--g-s2)", md: "var(--g-s3)", lg: "var(--g-s4)" };

function toneToColor(tone) {
  switch (tone) {
    case "muted":
      return (theme) => ({ color: theme.palette.text.secondary });
    case "primary":
    case "secondary":
    case "success":
    case "warning":
    case "info":
      return (theme) => ({ color: theme.palette[tone].main });
    case "danger": // alias to error
      return (theme) => ({ color: theme.palette.error.main });
    default:
      return undefined; // use default color
  }
}

function makeResponsiveTypography(responsive) {
  if (!responsive) return undefined;
  const order = ["xs", "sm", "md", "lg", "xl"];
  return (theme) => {
    const sx = {};
    for (const bp of order) {
      const v = responsive[bp];
      if (!v) continue;
      const styles = theme.typography?.[v] || {};
      if (bp === "xs") Object.assign(sx, styles);
      else sx[theme.breakpoints.up(bp)] = styles;
    }
    return sx;
  };
}

export default function TypographyX({
  variant = "body1",
  responsive,
  tone = "default",
  clamp,
  ellipsis,
  weight,
  mb = "none",
  align,          // passthrough to MUI
  underline = false,
  sx,
  children,
  ...rest
}) {
  const colorSx = toneToColor(tone);
  const respSx = makeResponsiveTypography(responsive);
  const fontWeight = typeof weight === "number" ? weight : (weight ? FW[weight] : undefined);

  // If clamp is set, prefer multi-line clamp over single-line ellipsis.
  const clampCount = clamp === true ? 1 : clamp;
  const clampSx =
    typeof clampCount === "number"
      ? {
          display: "-webkit-box",
          WebkitLineClamp: clampCount,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : undefined;

  const ellipsisSx =
    !clampSx && ellipsis
      ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
      : undefined;

  return (
    <MuiTypography
      variant={variant}
      align={align}
      sx={[
        { marginBottom: MARGINS[mb] ?? 0 },
        fontWeight ? { fontWeight } : null,
        underline ? { textDecoration: "underline" } : null,
        colorSx,
        respSx,
        clampSx,
        ellipsisSx,
        sx,
      ]}
      {...rest}
    >
      {children}
    </MuiTypography>
  );
}

// Optional named alias if you like importing as `Text`
export { TypographyX as Text };
