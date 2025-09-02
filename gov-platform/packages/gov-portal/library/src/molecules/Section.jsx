import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import s from "@gov/styles/library/molecule/Section.module.scss";

/**
 * Section — Header/description (config-driven). No RHF here.
 *
 * Props:
 * - id
 * - title            : string | node
 * - description      : string | node
 * - icon             : node | string (emoji/initial) | null
 * - actions          : node (right-aligned slot; e.g., link or button)
 * - collapsible      : boolean (optional; header click toggles)
 * - defaultOpen      : boolean (initial open state if collapsible)
 * - onToggle(open)   : callback when toggled
 * - children         : optional content to show below header (if collapsible)
 * - config           : per-instance overrides merged over defaults
 */
const DEFAULT_CFG = {
  variant: "plain",           // "plain" | "divider" | "accent"
  align: "left",              // "left" | "center"
  size: "md",                 // "sm" | "md" | "lg"
  gap: "sm",                  // "xs" | "sm" | "md" | "lg"
  marginY: "md",              // "none" | "xs" | "sm" | "md"
  titleTag: "h2",             // heading tag
  titleVariantMap: {          // MUI typography variant per size
    sm: "subtitle1",
    md: "h6",
    lg: "h5",
  },
  descVariantMap: {
    sm: "body2",
    md: "body2",
    lg: "body1",
  },
  showDivider: false,         // also implied when variant="divider"
  dividerInset: false,

  icon: {
    show: true,               // only used if `icon` prop provided
    shape: "circle",          // "circle" | "square"
    tone: "primary",          // "primary" | "neutral"
    sizePx: 36,               // container size (SCSS rounds)
  },

  sticky: false,              // make header sticky (container needs position context)
  stickyOffset: 0,            // px from top when sticky

  // Collapsible (if children present). If you just need a header, leave as false.
  collapsible: false,
  defaultOpen: true,
};

function renderIcon(icon, cfgIcon) {
  if (!icon) return null;
  const classNames = [
    s.icon,
    s[`icon--${cfgIcon.shape}`],
    s[`tone--${cfgIcon.tone}`],
  ].join(" ");
  return (
    <div className={classNames} style={{ "--sec-icon-size": `${cfgIcon.sizePx}px` }}>
      {typeof icon === "string" ? <span className={s.iconText}>{icon}</span> : icon}
    </div>
  );
}

export default function Section({
  id,
  title,
  description,
  icon,
  actions,
  collapsible,
  defaultOpen,
  onToggle,
  children,
  config,
}) {
  const cfg = React.useMemo(() => {
    const base = { ...DEFAULT_CFG, ...(config || {}) };
    base.icon = { ...DEFAULT_CFG.icon, ...(config?.icon || {}) };
    // propagate explicit props
    if (typeof collapsible === "boolean") base.collapsible = collapsible;
    if (typeof defaultOpen === "boolean") base.defaultOpen = defaultOpen;
    return base;
  }, [config, collapsible, defaultOpen]);

  const [open, setOpen] = React.useState(cfg.collapsible ? !!cfg.defaultOpen : true);
  const toggle = () => {
    if (!cfg.collapsible) return;
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  const titleVariant = cfg.titleVariantMap[cfg.size] || "h6";
  const descVariant  = cfg.descVariantMap[cfg.size] || "body2";
  const rootClass = [
    s.root,
    s[`variant--${cfg.variant}`],
    s[`align--${cfg.align}`],
    s[`size--${cfg.size}`],
    s[`gap--${cfg.gap}`],
    s[`my--${cfg.marginY}`],
    cfg.sticky ? s.sticky : "",
  ].filter(Boolean).join(" ");

  return (
    <section
      id={id}
      className={rootClass}
      style={cfg.sticky ? { top: cfg.stickyOffset } : undefined}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div
        className={s.header}
        role="button"
        tabIndex={cfg.collapsible ? 0 : -1}
        onClick={cfg.collapsible ? toggle : undefined}
        onKeyDown={cfg.collapsible ? (e) => (e.key === "Enter" || e.key === " ") && toggle() : undefined}
        aria-expanded={cfg.collapsible ? open : undefined}
      >
        {icon && cfg.icon.show ? renderIcon(icon, cfg.icon) : null}

        <div className={s.titles}>
          {title ? (
            <Typography
              id={id ? `${id}-title` : undefined}
              component={cfg.titleTag}
              variant={titleVariant}
              className={s.title}
            >
              {title}
            </Typography>
          ) : null}

          {description ? (
            <Typography variant={descVariant} color="text.secondary" className={s.description}>
              {description}
            </Typography>
          ) : null}
        </div>

        <div className={s.actions}>
          {actions}
          {cfg.collapsible ? (
            <IconButton
              className={`${s.caret} ${open ? s.open : ""}`}
              size="small"
              aria-label={open ? "Collapse section" : "Expand section"}
              edge="end"
            >
              <ExpandMoreIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </div>
      </div>

      {(cfg.showDivider || cfg.variant === "divider") && (
        <Divider className={s.divider} variant={cfg.dividerInset ? "inset" : "fullWidth"} />
      )}

      {/* Optional content area for collapsible use-cases.
          If you're only using this for headers, omit `children`. */}
      {cfg.collapsible ? (
        <Box className={s.body} hidden={!open} aria-hidden={!open}>
          {children}
        </Box>
      ) : null}
    </section>
  );
}
