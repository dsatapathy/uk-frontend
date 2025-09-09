import * as React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { fontWeight } from "@mui/system";

const cx = (...a) => a.filter(Boolean).join(" ");

const AppButton = React.forwardRef(function AppButton(
  {
    label,
    children,
    variant = "contained",     // just map to MUI variant
    color = "primary",         // take from theme.palette (ThemeBridge sets it)
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
  console.log("AppButton COlor", color);
  const content = children ?? label;

  // margin / spacing logic only
  const marginStyles = (theme) => {
    const g = typeof buttonGap === "number" ? theme.spacing(buttonGap) : buttonGap;
    return fullWidth
      ? { my: g }
      : { m: g, "& + &": { ml: g, mt: g } };
  };

  return (
    <MuiButton
      ref={ref}
      color={color}             // ← all tones come from theme.palette
      variant={variant}
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
        { borderRadius: "var(--g-radius)", fontWeight: "bold", minWidth: {
            xs: "120px",   // below sm (mobile)
            sm: "150px",   // above sm (tablet & desktop)
          }, },        
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
