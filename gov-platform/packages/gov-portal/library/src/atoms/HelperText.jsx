// components/form/HelperText.jsx
import * as React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import s from "@gov/styles/library/form/HelperText.module.scss";

/**
 * HelperText — Config-driven, responsive secondary guidance (no context needed).
 *
 * Props:
 * - children : string | node (the help text)
 * - icon     : boolean | ReactNode
 *              false → hide icon
 *              true  → show default icon
 *              node  → render custom node
 *              undefined → follow config.showIcon
 * - config   : partial overrides for this instance (merged over defaults)
 */

const DEFAULT_CFG = {
  gap: "xs",             // "xs" | "sm" | "md"
  marginTop: "xs",       // "none" | "xs" | "sm" | "md"
  color: "muted",        // "muted" | "info" | "warning"
  size: "sm",            // "xs" | "sm" | "md"
  showIcon: true,
  hideOnXs: false,
  clampLines: 0,         // 0 = no clamp, 1..4 supported in SCSS
  renderIcon: null,      // custom icon component if desired
};

export default function HelperText({ children, icon, config }) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);

  // decide icon rendering
  const IconComp = cfg.renderIcon || InfoOutlinedIcon;
  let showIcon;
  let iconNode = null;

  if (icon === undefined) {
    showIcon = !!cfg.showIcon;
    if (showIcon) iconNode = <IconComp fontSize="inherit" />;
  } else if (icon === false) {
    showIcon = false;
  } else if (icon === true) {
    showIcon = true;
    iconNode = <IconComp fontSize="inherit" />;
  } else {
    showIcon = true;
    iconNode = icon; // custom node
  }

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
    <div className={rootClass}>
      {showIcon ? (
        <span className={s.icon} aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
      <span className={textClass}>{children}</span>
    </div>
  );
}
