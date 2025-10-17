import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, Box } from "@mui/material";
import NavChevron from "../atoms/NavChevron";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";

export default function NavItem({ item, level = 0, selected, open, onClick, collapsed = false }) {
  const INDENT = collapsed ? 0 : 12 + level * 14;
  const ICON_W = 24;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const label = item.label || "";

  return (
    <ListItemButton
      onClick={onClick}
      selected={!!selected}
      aria-label={collapsed ? label : undefined}
      sx={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 1.25,
        my: 0.5,
        py: 0.9,
        pr: collapsed ? 0 : 1.25,
        pl: 0,
        borderRadius: "var(--g-radius, 12px)",
        position: "relative",
        color: "var(--g-primary-contrast)",
        backgroundColor: selected ? "var(--g-primary) !important" : "transparent",
        border: selected
          ? "1px solid var(--sidebar-active-bd)"
          : "1px solid transparent",

        transition:
          "background-color .18s ease, transform .12s ease, border-color .18s ease, padding .18s ease, gap .18s ease",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: collapsed ? "0s" : "40ms",
        "&:hover": {
          backgroundColor: "var(--g-primary-contrast) !important",
          transform: "translateY(-1px)",
          transition:
            "background-color .18s ease, transform .08s ease-out, border-color .18s ease",

          "& .nav-label": { color: "var(--g-primary) !important", opacity: collapsed ? 0 : 1 },
          "& .nav-icon .MuiSvgIcon-root, & .nav-chevron .MuiSvgIcon-root": {
            color: "var(--g-primary) !important",
          },
        },

        "&::before": selected
          ? {
            content: '""',
            position: "absolute",
            left: 6,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: 3,
            background:
              "var(--attention-gradient)",
          }
          : {},
      }}
    >
      {/* left indentation */}
      <Box
        sx={{
          width: INDENT,
          flex: collapsed ? "0 0 0" : "0 0 auto",
          transition: "width 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* icon */}
      <Box
        className="nav-icon"
        sx={{
          width: ICON_W,
          height: 22,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--g-primary-contrast)",
          transition: "transform 0.18s ease",
        }}
      >
        {item.icon ? getIcon(item.icon, { fontSize: "medium", sx: { color: "inherit" } }) : null}
      </Box>

      {/* label */}
      <TypographyX
        variant="body2"
        className="nav-label"
        aria-hidden={collapsed}
        sx={{
          flex: collapsed ? "0 0 auto" : "1 1 auto",
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: selected ? 700 : 600,
          letterSpacing: 0.1,
          color: "var(--g-primary-contrast)",
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : "100%",
          transition: "opacity .2s ease, max-width .26s cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDelay: collapsed ? "0s" : "60ms",
          pointerEvents: collapsed ? "none" : "auto",
        }}
        onClick={(e) => {
          if (!hasChildren && onClick) onClick(e);
        }}
      >
        {label}
      </TypographyX>

      {/* chevron or spacer */}
      {!collapsed && hasChildren ? (
        <Box className="nav-chevron" sx={{ color: "var(--g-primary-contrast)" }}>
          <NavChevron open={open} sx={{ color: "inherit" }} />
        </Box>
      ) : !collapsed ? (
        <Box sx={{ width: 12, flex: "0 0 auto" }} />
      ) : null}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  selected: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  collapsed: PropTypes.bool,
};
