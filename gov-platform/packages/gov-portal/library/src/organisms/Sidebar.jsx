import React from "react";
import PropTypes from "prop-types";
import { Box, Drawer, useTheme } from "@mui/material";
import DrawerHeader from "../molecules/DrawerHeader";
import NavTree from "../molecules/NavTree";
import { DRAWER_WIDTH } from "../utils/menu-utils";
import SearchField from "../atoms/SearchField";
import TypographyX from "../atoms/TypographyX";
import { useAppConfig } from "@gov/ui-engine";

const fallbackBackground = `
    /* Sharp, angled facets for the diamond-cut effect */
    linear-gradient(
      165deg,
      transparent 45%,
      var(--crystal-highlight, rgba(236, 253, 245, 0.2)) 50%, /* Sharp highlight edge */
      var(--crystal-shadow, rgba(20, 83, 45, 0.15)) 52%,       /* Subtle shadow edge */
      transparent 60%
    ),
    linear-gradient(
      -40deg,
      transparent 30%,
      var(--crystal-highlight, rgba(236, 253, 245, 0.15)) 48%, /* Second highlight facet */
      transparent 60%
    ),
    linear-gradient(
      20deg,
      transparent 40%,
      var(--crystal-shadow, rgba(20, 83, 45, 0.1)) 55%,        /* A wider, softer shadow facet */
      transparent 70%
    ),

    /* The original 3-stop base gradient for color foundation */
    linear-gradient(
      180deg,
      var(--sidebar-bg-top, #aed581) 0%,    /* Light Banana Leaf Green */
      var(--sidebar-bg-mid, #9ccc65) 46%,     /* Medium Banana Leaf Green */
      var(--sidebar-bg-bottom, #8bc34a) 100%  /* Richer Banana Leaf Green */
    )
  `;
export default function Sidebar(props) {
  const {
    isDesktop, open, onClose, logo: propLogo, title, items,
    currentPath, expandedSet, onToggle, onNavigate,
    searchValue, onSearchChange, onSearchEnter,
  } = props;
  const appCfg = useAppConfig();
  const primaryBg = appCfg?.brand?.primaryBg;
  const themeLogo = appCfg?.topBar?.logo;
  const resolvedBg = React.useMemo(() => {
    if (!primaryBg) return null;
    const trimmed = String(primaryBg).trim();
    if (/^(url\(|linear-gradient|radial-gradient|conic-gradient)/i.test(trimmed)) {
      return trimmed;
    }
    return `url(${trimmed})`;
  }, [primaryBg]);
  const drawerLogo = React.useMemo(() => {
    const value = themeLogo;
    if (!value) return null;
    if (React.isValidElement(value)) return value;
    if (typeof value === "string") {
      return (
        <Box
          component="img"
          src={value}
          alt={title || "Sidebar logo"}
          sx={{ width: "100%", height: "auto", display: "block", borderRadius: 1.5 }}
        />
      );
    }
    return null;
  }, [themeLogo,title]);
  const t = useTheme();
  const p = t.palette;

  // Build CSS variable fallbacks from the active theme
  const fg = p.mode === "light" ? p.text.primary : p.text.primary;
  const fgDim = p.text.secondary;
  const divider = p.divider;

  const paperBase = {
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    height: "100dvh",
    width: { xs: 280, md: "var(--sidebar-w, " + (DRAWER_WIDTH || 250) + "px)" },
    boxSizing: "border-box",
    display: "flex",
    overflow: "hidden",
    overflowX: "hidden",
    borderRadius: 0,
    color: "var(--sidebar-fg, var(--g-fg-muted))",
    borderRight: "1px solid var(--sidebar-line, var(--g-border, #e0e0e0))",
    backgroundImage: resolvedBg || fallbackBackground,
    boxShadow: `inset -1px 0 0 var(--sidebar-line, var(--g-border, #e0e0e0)),
            4px 0 18px -12px rgba(0,0,0,0.3)`,
  };
  const content = (
    <Box role="navigation" sx={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Mobile header */}
      {!isDesktop && (
        <DrawerHeader
          logo={drawerLogo}
          title={title}
          showClose={!isDesktop}
          showTitle={!isDesktop}
          onClose={onClose}
        />
      )}

      {/* Desktop search – styled via tokens */}
      {isDesktop && (
        <Box sx={{ p: 1.5, pt: 2, flexShrink: 0 }}>
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            onEnter={onSearchEnter}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--sidebar-fg, var(--g-fg, " + fg + "))",
                backgroundColor: "transparent",
                "& fieldset": { borderColor: "var(--sidebar-line, var(--g-border, " + divider + "))" },
                "&:hover fieldset": { borderColor: "var(--sidebar-line-hover, var(--g-border, " + divider + "))" },
                "&.Mui-focused fieldset": { borderColor: "var(--sidebar-focus, var(--g-primary, " + p.primary.main + "))" },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "var(--sidebar-fg-dim, var(--g-fg-muted, " + fgDim + "))",
                opacity: 1,
              },
              "& .MuiSvgIcon-root": {
                color: "var(--sidebar-icon, var(--g-fg-muted, " + fgDim + "))",
              },
            }}
          />
        </Box>
      )}

      {/* Section label */}
      <Box sx={{ px: 2, pb: 1, pt: isDesktop ? 0.5 : 1, flexShrink: 0 }}>
        <TypographyX
          variant="overline"
          sx={{
            color: "var(--sidebar-fg-dim, var(--g-fg-muted, " + fgDim + "))",
            letterSpacing: 1.1,
            textTransform: "uppercase",
            background: "linear-gradient(90deg, currentColor 0%, transparent 80%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Navigation
        </TypographyX>
      </Box>

      {/* Scroll area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          px: 1,
          pb: 2,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--sidebar-scroll, rgba(255,255,255,0.25)) transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 1,
            backgroundColor: "var(--sidebar-scroll, rgba(255,255,255,0.25))",
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        <NavTree
          items={items}
          currentPath={currentPath}
          expandedSet={expandedSet}
          onToggle={onToggle}
          onNavigate={onNavigate}
        />
      </Box>

      <Box
        sx={{
          height: 16,
          flexShrink: 0,
          background: "linear-gradient(180deg, transparent, var(--sidebar-foot-glow, rgba(255,255,255,0.03)))",
        }}
      />
    </Box>
  );

  return isDesktop ? (
    <Drawer variant="permanent" open PaperProps={{ sx: paperBase }}>
      {content}
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: paperBase }}
    >
      {content}
    </Drawer>
  );
}

Sidebar.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  logo: PropTypes.node,
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  expandedSet: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearchEnter: PropTypes.func,
};
