import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, Box } from "@mui/material";
import IconSlot from "../atoms/IconSlot";
import NavChevron from "../atoms/NavChevron";
import TypographyX from "../atoms/TypographyX";

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

        color: "var(--sidebar-fg, var(--g-fg))",
        backgroundColor: selected
          ? "var(--sidebar-active-bg)"
          : "transparent",
        border: selected
          ? "1px solid var(--sidebar-active-bd)"
          : "1px solid transparent",

        transition:
          "background-color .18s ease, transform .12s ease, border-color .18s ease",
        "&:hover": {
          backgroundColor: "var(--sidebar-hover-bg)",
          transform: "translateY(-1px)",
        },

        // active accent strip
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
        sx={{
          width: ICON_W,
          height: 22,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: selected
            ? "var(--sidebar-accent)"
            : "var(--sidebar-fg-dim, var(--g-fg-muted))",
        }}
      >
        {item.icon ? <IconSlot name={item.icon} /> : null}
      </Box>

      {/* label */}
      <TypographyX
        variant="body2"
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: selected ? 700 : 600,
          letterSpacing: 0.1,
          color: selected
            ? "var(--sidebar-label-active)"
            : "var(--sidebar-fg, var(--g-fg))",
        }}
        onClick={(e) => {
          if (!hasChildren && onClick) onClick(e);
        }}
      >
        {item.label}
      </TypographyX>

      {/* chevron or spacer */}
      {hasChildren ? (
        <Box
          sx={{
            color: selected
              ? "var(--sidebar-accent)"
              : "var(--sidebar-fg-dim, var(--g-fg-muted))",
          }}
        >
          <NavChevron open={open} />
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
