import React from "react";
import PropTypes from "prop-types";
import { Box, Drawer, useTheme } from "@mui/material";
import DrawerHeader from "../molecules/DrawerHeader";
import NavTree from "../molecules/NavTree";
import { DRAWER_WIDTH } from "../utils/menu-utils";
import SearchField from "../atoms/SearchField";
import TypographyX from "../atoms/TypographyX"; // ⬅️ use your TypographyX

export default function Sidebar(props) {
  const {
    isDesktop, open, onClose, logo, title, items,
    currentPath, expandedSet, onToggle, onNavigate,
    searchValue, onSearchChange, onSearchEnter,
  } = props;

  const theme = useTheme();

  // Colors for dark rail
  const darkBgTop    = "#0F1420";    // near-black blue
  const darkBgBottom = "#0B0F18";
  const lightText    = "#EAF0F7";    // label text
  const dimText      = "#B7C2D0";    // secondary text
  const lineColor    = "rgba(255,255,255,0.08)";

  const paperBase = {
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    height: "100dvh",
    width: { xs: 280, md: "var(--sidebar-w)" },
    boxSizing: "border-box",
    display: "flex",
    overflow: "hidden",
    overflowX: "hidden",
    color: lightText,                     // ⬅️ light text for the rail
    borderRight: `1px solid ${lineColor}`,
    // dark layered background + faint blue glows
    backgroundImage: `
      radial-gradient(900px 420px at -20% -20%, rgba(48,127,255,0.10) 0%, transparent 60%),
      radial-gradient(600px 320px at 120% 10%, rgba(96,211,255,0.10) 0%, transparent 55%),
      linear-gradient(180deg, ${darkBgTop} 0%, ${darkBgBottom} 100%)
    `,
    boxShadow: `inset -1px 0 0 ${lineColor}, 8px 0 24px -18px rgba(0,0,0,0.4)`,
  };

  const content = (
    <Box role="navigation" sx={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Mobile header */}
      {!isDesktop && (
        <DrawerHeader
          logo={logo}
          title={title}
          showClose={!isDesktop}
          showTitle={!isDesktop}
          onClose={onClose}
        />
      )}

      {/* Desktop search – make its wrapper dark-friendly */}
      {isDesktop && (
        <Box sx={{ p: 1.5, pt: 2, flexShrink: 0 }}>
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            onEnter={onSearchEnter}
            // if your SearchField exposes sx/inputProps, this keeps it readable on dark:
            sx={{
              "& .MuiOutlinedInput-root": {
                color: lightText,
                "& fieldset": { borderColor: lineColor },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.20)" },
                "&.Mui-focused fieldset": { borderColor: "rgba(120,180,255,0.50)" },
              },
              "& .MuiInputBase-input::placeholder": { color: dimText, opacity: 1 },
            }}
          />
        </Box>
      )}

      {/* Section label */}
      <Box sx={{ px: 2, pb: 1, pt: isDesktop ? 0.5 : 1, flexShrink: 0 }}>
        <TypographyX
          variant="overline"
          sx={{
            color: dimText,
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
          scrollbarColor: "rgba(255,255,255,0.25) transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.25)",
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

      <Box sx={{ height: 16, flexShrink: 0, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.03))" }} />
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
