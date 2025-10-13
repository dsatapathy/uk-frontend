import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, useTheme } from "@mui/material/styles";
import s from "@gov/styles/library/organism/FieldGroup.module.scss";
import TypographyX from "../atoms/TypographyX";
import { useAppConfig } from "@gov/ui-engine";

/**
 * FieldGroup — premium UX without changing the header background color.
 *
 * New (optional) props:
 * - hoverLift?: boolean (default true)       → gentle lift & shadow on hover
 * - animateCollapse?: boolean (default true) → smooth open/close
 * - headerIcon?: ReactNode                   → glassy icon chip at left of title
 * - headerBadge?: string | ReactNode         → status chip at right
 * - headerSx/bodySx/footerSx?: SxProps       → fine-grained overrides
 * - scrollMargin?: number (default 72)       → anchor-friendly offset
 */

const DEFAULT_CFG = {
  variant: "elevated",
  elevation: 1,
  radius: 12,
  border: "1px solid var(--g-border, #e5e7eb)",

  paddingX: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  paddingY: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  gap: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  marginY: "var(--g-s3)",

  header: { dense: false, sticky: false, stickyOffset: 0, showDivider: true, align: "left" },

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

  // ✨ premium UX opts (all optional)
  hoverLift = true,
  animateCollapse = true,
  headerIcon,
  headerBadge,
  headerSx,
  bodySx,
  footerSx,
  scrollMargin = 72,

  ...rest
}) {
  const theme = useTheme();
  const cfg = useMergedConfig(config);
  const appCfg = useAppConfig();

  // respect existing behavior
  const isCollapsible = typeof collapsible === "boolean" ? collapsible : cfg.collapsible;
  const initialOpen = typeof defaultOpen === "boolean" ? defaultOpen : cfg.defaultOpen;
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
  ].filter(Boolean).join(" ");

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
      sx={{
        borderRadius: cfg.radius,
        overflow: "hidden",
        scrollMarginTop: scrollMargin,
        transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
        ...(hoverLift && {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.palette.mode === "dark"
              ? "0 12px 36px rgba(0,0,0,.45)"
              : "0 14px 36px rgba(0,0,0,.12)",
          },
        }),
        ...(cfg.variant === "outlined" && { border: cfg.border }),
      }}
      {...rest}
    >
      {/* Header (keep EXACT background you already set) */}
      <Box
        className={[
          s.header,
          cfg.header.align === "center" ? s["align--center"] : "",
          cfg.header.dense ? s["dense"] : "",
        ].join(" ")}
        sx={{
          // ⛔️ Do not alter color → your gradient stays:
          background: `linear-gradient(to right, #239460 0%, #6fc926 100%)`,
          position: cfg.header.sticky ? "sticky" : "relative",
          top: cfg.header.sticky ? `var(--fg-sticky-top)` : "auto",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          px: { xs: 2, md: 3 },
          py: cfg.header.dense ? 1 : 1.5,

          // soft bottom divider shadow for premium depth
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.06)",
          outline: "none",
          "&:focus-visible": {
            boxShadow: `inset 0 0 0 2px ${alpha(theme.palette.common.white, .3)}`,
            borderRadius: "inherit",
          },
          ...headerSx,
        }}
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
        {/* left: (optional) icon + titles */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.0, minWidth: 0, flex: 1 }}>
          {headerIcon ? (
            <Box
              aria-hidden
              sx={{
                width: 34, height: 34, borderRadius: "50%",
                display: "grid", placeItems: "center",
                backgroundColor: alpha("#fff", .75),
                color: theme.palette.text.primary,
                boxShadow: "0 4px 10px rgba(0,0,0,.18)",
                flexShrink: 0,
                "& svg": { fontSize: 20 },
              }}
            >
              {headerIcon}
            </Box>
          ) : null}

          <Box sx={{ minWidth: 0 }}>
            {title ? (
              <TypographyX
                variant={cfg.header.dense ? "subtitle1" : "h6"}
                className={s.title}
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.25,
                  color: "#fff",                 // white reads best on your gradient
                  textShadow: "0 1px 0 rgba(0,0,0,.25)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </TypographyX>
            ) : null}

            {description ? (
              <TypographyX
                variant="body2"
                className={s.description}
                sx={{
                  fontWeight: 600,
                  color: "rgba(255,255,255,.9)",
                  lineHeight: 1.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {description}
              </TypographyX>
            ) : null}
          </Box>
        </Box>

        {/* right: badge + actions + caret */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {headerBadge ? (
            typeof headerBadge === "string" ? (
              <Chip
                size="small"
                label={headerBadge}
                sx={{
                  fontWeight: 700,
                  bgcolor: alpha("#fff", .25),
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.4)",
                }}
              />
            ) : headerBadge
          ) : null}

          {actions}

          {isCollapsible ? (
            <IconButton
              className={`${s.caret} ${open ? s.open : ""}`}
              size={cfg.header.dense ? "small" : "medium"}
              aria-label={open ? "Collapse group" : "Expand group"}
              edge="end"
              onClick={(e) => { e.stopPropagation(); toggle(); }}
              sx={{
                ml: 0.25,
                color: "#fff",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s ease",
              }}
            >
              <ExpandMoreIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </Box>
      </Box>

      {(cfg.header.showDivider || cfg.variant === "outlined") && <Divider className={s.divider} />}

      {/* Body (animated by default) */}
      {isCollapsible ? (
        <Collapse in={open} timeout={animateCollapse ? 180 : 0} unmountOnExit={false}>
          <Box
            id={id ? `${id}-body` : undefined}
            className={s.body}
            sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, ...bodySx }}
          >
            {children}
          </Box>
        </Collapse>
      ) : (
        <Box
          id={id ? `${id}-body` : undefined}
          className={s.body}
          sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, ...bodySx }}
        >
          {children}
        </Box>
      )}

      {/* Footer */}
      {footer ? (
        <>
          <Divider className={s.divider} />
          <Box
            className={s.footer}
            sx={{
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
              boxShadow: (t) =>
                t.palette.mode === "dark"
                  ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 -8px 24px rgba(0,0,0,0.35)"
                  : "inset 0 1px 0 rgba(0,0,0,0.06), 0 -8px 24px rgba(0,0,0,0.08)",
              backgroundColor: (t) => t.palette.background.paper, // keeps it clean over form bg
              borderBottomLeftRadius: "inherit",
              borderBottomRightRadius: "inherit",
              ...footerSx,
            }}
          >{footer}
          </Box>
        </>
      ) : null}
    </Card>
  );
}
