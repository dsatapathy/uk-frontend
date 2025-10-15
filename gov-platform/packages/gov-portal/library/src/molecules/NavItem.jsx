import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, Box } from "@mui/material";
import NavChevron from "../atoms/NavChevron";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";

export default function NavItem({ item, level = 0, selected, open, onClick }) {
  const INDENT = 12 + level * 14;
  const ICON_W = 24;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <ListItemButton
      onClick={onClick}
      selected={!!selected}
      sx={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        my: 0.5,
        py: 0.9,
        pr: 1.25,
        pl: 0,
        borderRadius: "var(--g-radius, 12px)",
        position: "relative",
        color: "var(--g-primary-contrast)",
        backgroundColor: selected ? "var(--sidebar-active-bg)" : "transparent",
        border: selected
          ? "1px solid var(--sidebar-active-bd)"
          : "1px solid transparent",

        transition:
          "background-color .18s ease, transform .12s ease, border-color .18s ease",
        "&:hover": {
          backgroundColor: "var(--g-primary-contrast)",
          transform: "translateY(-1px)",
          transition:
            "background-color .18s ease, transform .08s ease-out, border-color .18s ease",

          "& .nav-label": { color: "#01604a !important" },
          "& .nav-icon .MuiSvgIcon-root, & .nav-chevron .MuiSvgIcon-root": {
            color: "#01604a !important",
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
              "linear-gradient(var(--sidebar-accent), color-mix(in srgb, var(--sidebar-accent) 25%, transparent))",
          }
          : {},
      }}
    >
      {/* left indentation */}
      <Box sx={{ width: INDENT, flex: "0 0 auto" }} />

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
          color: "var(--g-primary-contrast)"
        }}
      >
        {item.icon ? getIcon(item.icon, { fontSize: "medium", sx: { color: "inherit" } }) : null}
      </Box>

      {/* label */}
      <TypographyX
        variant="body2"
        className="nav-label"
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: selected ? 700 : 600,
          letterSpacing: 0.1,
          color: "var(--g-primary-contrast)"
        }}
        onClick={(e) => {
          if (!hasChildren && onClick) onClick(e);
        }}
      >
        {item.label}
      </TypographyX>

      {/* chevron or spacer */}
      {hasChildren ? (
        <Box className="nav-chevron" sx={{ color: "var(--g-primary-contrast)" }}>
          <NavChevron open={open} sx={{ color: "inherit" }} />
        </Box>
      ) : (
        <Box sx={{ width: 12, flex: "0 0 auto" }} />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  selected: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func,
};
