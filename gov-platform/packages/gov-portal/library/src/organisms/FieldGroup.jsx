import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import s from "@gov/styles/library/organism/FieldGroup.module.scss";

/**
 * FieldGroup — Card/panel grouping fields (config-driven).
 *
 * Props:
 * - id
 * - title                : string | node
 * - description          : string | node (optional subheader)
 * - actions              : node (right-aligned in header)
 * - collapsible          : boolean
 * - defaultOpen          : boolean
 * - onToggle(open)       : function
 * - footer               : node (optional content below body)
 * - children             : fields / layout content
 * - config               : per-instance config overrides (merged with defaults)
 * - className, style     : passthrough
 */
const DEFAULT_CFG = {
  variant: "elevated",            // "elevated" | "outlined" | "plain"
  elevation: 1,                   // MUI elevation (only for elevated)
  radius: 12,                     // px border radius
  border: "1px solid var(--g-border, #e5e7eb)",

  paddingX: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  paddingY: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  gap: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  marginY: "var(--g-s3)",

  header: {
    dense: false,
    sticky: false,
    stickyOffset: 0,             // px
    showDivider: true,
    align: "left",               // "left" | "center"
  },

  collapsible: false,
  defaultOpen: true,
};

function useMergedConfig(config) {
  return React.useMemo(() => {
    const base = { ...DEFAULT_CFG, ...(config || {}) };
    base.header = { ...DEFAULT_CFG.header, ...(config?.header || {}) };
    return base;
  }, [config]);
}

export default function FieldGroup({
  id,
  title,
  description,
  actions,
  collapsible,
  defaultOpen,
  onToggle,
  footer,
  children,
  config,
  className,
  style,
  ...rest
}) {
  const cfg = useMergedConfig(config);

  // explicit props win over config
  const isCollapsible = typeof collapsible === "boolean" ? collapsible : cfg.collapsible;
  const initialOpen   = typeof defaultOpen === "boolean" ? defaultOpen : cfg.defaultOpen;

  const [open, setOpen] = React.useState(isCollapsible ? !!initialOpen : true);
  const toggle = () => {
    if (!isCollapsible) return;
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  const rootCls = [
    s.root,
    s[`variant--${cfg.variant}`],
    cfg.header.sticky ? s.sticky : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      id={id}
      className={rootCls}
      elevation={cfg.variant === "elevated" ? cfg.elevation : 0}
      style={{
        "--fg-radius": `${cfg.radius}px`,
        "--fg-mb": cfg.marginY,
        "--fg-gap-xs": cfg.gap?.xs || cfg.gap,
        "--fg-gap-md": cfg.gap?.md || cfg.gap,
        "--fg-px-xs": cfg.paddingX?.xs || cfg.paddingX,
        "--fg-px-md": cfg.paddingX?.md || cfg.paddingX,
        "--fg-py-xs": cfg.paddingY?.xs || cfg.paddingY,
        "--fg-py-md": cfg.paddingY?.md || cfg.paddingY,
        "--fg-sticky-top": `${cfg.header.stickyOffset || 0}px`,
        ...(cfg.variant === "outlined" ? { "--fg-border": cfg.border } : {}),
        ...style,
      }}
      {...rest}
    >
      {/* Header */}
      <Box
        className={[
          s.header,
          cfg.header.align === "center" ? s["align--center"] : "",
          cfg.header.dense ? s["dense"] : "",
        ].join(" ")}
        role={isCollapsible ? "button" : undefined}
        tabIndex={isCollapsible ? 0 : -1}
        onClick={isCollapsible ? toggle : undefined}
        onKeyDown={
          isCollapsible
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }
            : undefined
        }
        aria-expanded={isCollapsible ? open : undefined}
        aria-controls={id ? `${id}-body` : undefined}
      >
        <div className={s.titles}>
          {title ? (
            <Typography
              variant={cfg.header.dense ? "subtitle1" : "h6"}
              className={s.title}
            >
              {title}
            </Typography>
          ) : null}

          {description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              className={s.description}
            >
              {description}
            </Typography>
          ) : null}
        </div>

        <div className={s.actions}>
          {actions}
          {isCollapsible ? (
            <IconButton
              className={`${s.caret} ${open ? s.open : ""}`}
              size={cfg.header.dense ? "small" : "medium"}
              aria-label={open ? "Collapse group" : "Expand group"}
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              <ExpandMoreIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </div>
      </Box>

      {(cfg.header.showDivider || cfg.variant === "outlined") && (
        <Divider className={s.divider} />
      )}

      {/* Body */}
      <Box
        id={id ? `${id}-body` : undefined}
        className={s.body}
        hidden={isCollapsible ? !open : false}
        aria-hidden={isCollapsible ? !open : false}
      >
        {children}
      </Box>

      {/* Footer (optional) */}
      {footer ? (
        <>
          <Divider className={s.divider} />
          <Box className={s.footer}>{footer}</Box>
        </>
      ) : null}
    </Card>
  );
}
