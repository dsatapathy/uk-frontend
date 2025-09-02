// components/form/ErrorMessage.jsx
import * as React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import s from "@gov/styles/library/form/ErrorMessage.module.scss";

/**
 * ErrorMessage — Config-driven, responsive validation error.
 *
 * Props:
 * - id       : string (DOM id so inputs can aria-describedby this message)
 * - message  : string | node (render nothing if falsy)
 * - config   : optional per-instance overrides (merged over defaults)
 */

const DEFAULT_CFG = {
  gap: "xs",             // "xs" | "sm" | "md"
  marginTop: "xs",       // "none" | "xs" | "sm" | "md"
  color: "danger",       // "danger" | "warning" | "muted"
  size: "sm",            // "xs" | "sm" | "md"
  showIcon: true,
  hideOnXs: false,
  clampLines: 0,         // 0 = no clamp, 1..4 supported in SCSS
  ariaRole: "status",    // "status" (polite) | "alert" (assertive)
  ariaLive: "polite",
  renderIcon: null,      // custom icon component if desired
};

export default function ErrorMessage({ id, message, config }) {
  if (!message) return null;

  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const IconComp = cfg.renderIcon || ErrorOutlineIcon;

  const rootClass = [
    s.root,
    s[`gap--${cfg.gap}`],
    s[`mt--${cfg.marginTop}`],
    s[`color--${cfg.color}`],
    cfg.hideOnXs ? s.hideOnXs : null,
    cfg.clampLines > 0 ? s[`clamp--${Math.min(cfg.clampLines, 4)}`] : null,
  ]
    .filter(Boolean)
    .join(" ");

  const textClass = [s.text, s[`size--${cfg.size}`]].join(" ");

  return (
    <div
      id={id}
      role={cfg.ariaRole}
      aria-live={cfg.ariaLive}
      aria-atomic="true"
      className={rootClass}
    >
      {cfg.showIcon ? (
        <span className={s.icon} aria-hidden="true">
          <IconComp fontSize="inherit" />
        </span>
      ) : null}
      <span className={textClass}>{message}</span>
    </div>
  );
}
