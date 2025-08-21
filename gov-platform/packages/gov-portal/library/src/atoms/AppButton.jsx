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
        { borderRadius: "var(--g-radius)" }, // from your token bridge
        variant === "soft" &&
          ((theme) => {
            const key = color === "inherit" ? "primary" : color;
            const main = theme.palette[key].main;
            const on = theme.palette.getContrastText(main);
            return {
              color: color === "inherit" ? theme.palette.text.primary : on,
              backgroundColor: alpha(main, 0.12),
              "&:hover": { backgroundColor: alpha(main, 0.2) },
            };
          }),
        loading && { pointerEvents: "none" },
        sx,
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
