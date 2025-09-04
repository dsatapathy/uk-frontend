import React from "react";
import PropTypes from "prop-types";
import { Box, Drawer } from "@mui/material";
import DrawerHeader from "../molecules/DrawerHeader";
import NavTree from "../molecules/NavTree";
import { DRAWER_WIDTH } from "../utils/menu-utils";
import SearchField from "../atoms/SearchField";

export default function Sidebar({
  isDesktop,
  open,
  onClose,
  logo,
  title,
  items,
  currentPath,
  expandedSet,
  onToggle,
  onNavigate,
  searchValue,
  onSearchChange,
  onSearchEnter,
}) {
  const content = (
    <Box
      role="navigation"
      sx={{
        width: { xs: 280, md: DRAWER_WIDTH },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile header only */}
      {!isDesktop && (
        <DrawerHeader
          logo={logo}
          title={title}
          showClose={!isDesktop}
          showTitle={!isDesktop}
          onClose={onClose}
        />
      )}

      {/* Desktop search inside sidebar */}
      {isDesktop && (
        <Box sx={{ p: 1.5, flexShrink: 0 }}>
          <SearchField value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} />
        </Box>
      )}

      {/* Scroll container — owns its own scroll; hidden scrollbar */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",       // prevent scroll chaining to page
          scrollbarWidth: "none",              // Firefox
          "-ms-overflow-style": "none",        // old Edge/IE
          "&::-webkit-scrollbar": {            // WebKit/Chromium
            width: 0,
            height: 0,
            display: "none",
          },
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
    </Box>
  );

  return isDesktop ? (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "100dvh",
          width: DRAWER_WIDTH,
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          overflow: "hidden",       // ⬅️ stop paper from showing its own scrollbar
          overflowX: "hidden",      // avoid accidental horizontal bar
        },
      }}
    >
      {content}
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: 280,
          height: "100dvh",
          display: "flex",
          overflow: "hidden",       // ⬅️ same for temporary drawer
          overflowX: "hidden",
        },
      }}
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
