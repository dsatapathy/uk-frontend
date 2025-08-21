import * as React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

const cx = (...a) => a.filter(Boolean).join(" ");

const AppButton = React.forwardRef(function AppButton(
  {
    label,
    children,
    variant = "contained",
    tone = "primary",
    size = "medium",
    fullWidth = false,
    loading = false,
    disabled,
    startIcon,
    endIcon,
    className,
    classes,
    buttonGap = 1,
    sx,
    ...rest
  },
  ref
) {
  const colorMap = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    warning: "warning",
    error: "error",
    info: "info",
    neutral: "inherit",
  };
  const color = colorMap[tone] || "primary";
  const muiVariant = variant === "soft" ? "text" : variant;
  const content = children ?? label;
  const marginStyles = (theme) => {
    const g = typeof buttonGap === "number" ? theme.spacing(buttonGap) : buttonGap;
    // If fullWidth, only vertical margin. Otherwise margin all around and
    // ensure spacing between adjacent AppButtons.
    return fullWidth
      ? { my: g }
      : { m: g, "& + &": { ml: g, mt: g } };
  };

  const softVariantStyles = (theme) => {
    if (variant !== "soft") return {};
    const key = color === "inherit" ? "primary" : color;
    const main = theme.palette[key].main;
    const on = theme.palette.getContrastText(main);
    return {
      color: color === "inherit" ? theme.palette.text.primary : on,
      backgroundColor: alpha(main, 0.12),
      "&:hover": { backgroundColor: alpha(main, 0.2) },
    };
  };
  return (
    <MuiButton
      ref={ref}
      color={color}
      variant={muiVariant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      className={cx(classes?.root, className)}
      classes={
        classes
          ? { root: classes.root, startIcon: classes.startIcon, endIcon: classes.endIcon }
          : undefined
      }
      aria-busy={loading || undefined}
      sx={[
        (theme) => marginStyles(theme),
        { borderRadius: "var(--g-radius)" },
        (theme) => softVariantStyles(theme),
        loading && { pointerEvents: "none" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {loading && (
        <CircularProgress
          size={18}
          thickness={5}
          className={classes?.loader}
          sx={{ mr: content ? 1.25 : 0 }}
        />
      )}
      {content}
    </MuiButton>
  );
});

export default AppButton;
