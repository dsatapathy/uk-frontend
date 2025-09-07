import { alpha } from "@mui/material/styles";

// Intent color map (fall back to primary if not found)
const intentColors = (theme) => ({
  primary: {
    base: theme.palette.primary.main,
    contrast: theme.palette.primary.contrastText,
  },
  neutral: {
    base: theme.palette.grey[800],
    contrast: theme.palette.common.white,
  },
  success: {
    base: theme.palette.success.main,
    contrast: theme.palette.success.contrastText,
  },
  warning: {
    base: theme.palette.warning.main,
    contrast: theme.palette.warning.contrastText,
  },
  danger: {
    base: theme.palette.error.main,
    contrast: theme.palette.error.contrastText,
  },
});

/**
 * surfaceSx
 * Generate background / text / border styles based on intent + variant.
 *
 * @param {object} theme - MUI theme
 * @param {object} opts - { intent: string, variant: string }
 * @returns {object} sx style object
 */
export function surfaceSx(theme, { intent = "neutral", variant = "ghost" }) {
  const colors = intentColors(theme)[intent] || intentColors(theme).primary;
  const base = colors.base;
  const contrast = colors.contrast;

  switch (variant) {
    case "solid":
      return {
        backgroundColor: base,
        color: contrast,
      };
    case "soft":
      return {
        backgroundColor: alpha(base, 0.08),
        color: base,
        border: `1px solid ${alpha(base, 0.2)}`,
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        color: base,
        border: `1px solid ${alpha(base, 0.4)}`,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: base,
      };
    default:
      return {};
  }
}
