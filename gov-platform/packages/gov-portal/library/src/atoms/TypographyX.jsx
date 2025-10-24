import * as React from "react";
import MuiTypography from "@mui/material/Typography";

const FW = { regular: 400, medium: 500, semibold: 600, bold: 700 };
const MARGINS = {
  none: 0,
  xs: "var(--g-s1, 2px)",
  sm: "var(--g-s2, 4px)",
  md: "var(--g-s3, 8px)",
  lg: "var(--g-s4, 12px)",
};

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
    case "inherit":
      return "inherit";          // allow explicit inherit
    case "custom":
      return undefined;          // let sx.color override fully
    default:
      return "var(--g-fg)";
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
  weight = "regular",
  mb = "none",
  align,
  underline = false,
  sx,
  children,
  ...rest
}) {
  const respSx = makeResponsiveTypography(responsive);

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
        {
          color: toneToColor(tone),   // defaults to CSS var
          fontWeight: typeof weight === "number" ? weight : FW[weight],
          marginBottom: MARGINS[mb] ?? 0,
          fontFamily: "'Poppins', sans-serif",
        },
        underline ? { textDecoration: "underline" } : null,
        respSx,
        clampSx,
        ellipsisSx,
        sx, // ⬅️ user sx LAST so it overrides tone/color/weight cleanly
      ]}
      {...rest}
    >
      {children}
    </MuiTypography>
  );
}

export { TypographyX as Text };
