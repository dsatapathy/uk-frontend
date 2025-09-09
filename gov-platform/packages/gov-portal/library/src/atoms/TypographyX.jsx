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
const MARGINS = {
  none: 0,
  xs: "var(--g-s1, 2px)",
  sm: "var(--g-s2, 4px)",
  md: "var(--g-s3, 8px)",
  lg: "var(--g-s4, 12px)",
};

// map tone -> CSS variable color
function toneToColor(tone) {
  switch (tone) {
    case "muted":
      return "var(--g-fg-muted)";
    case "primary":
      return "var(--g-primary)";
    case "secondary":
      return "var(--g-secondary)";
    case "success":
      return "var(--success-600)";
    case "warning":
      return "var(--warning-600)";
    case "danger":
      return "var(--error-600)";
    case "info":
      return "var(--info-600)";
    default:
      return "var(--g-fg)"; // default text color
  }
}

// per-breakpoint typography variant mapping
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
  weight = "regular",   // default weight
  mb = "none",
  align,                 // passthrough to MUI
  underline = false,
  sx,
  children,
  ...rest
}) {
  const respSx = makeResponsiveTypography(responsive);

  // clamp → multi-line truncation
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

  // single-line ellipsis if no clamp
  const ellipsisSx =
    !clampSx && ellipsis
      ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
      : undefined;

  return (
    <MuiTypography
      variant={variant}
      align={align}
      sx={[
        {
          color: toneToColor(tone),
          fontWeight: typeof weight === "number" ? weight : FW[weight],
          marginBottom: MARGINS[mb] ?? 0,
        },
        underline ? { textDecoration: "underline" } : null,
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

// Optional alias
export { TypographyX as Text };
