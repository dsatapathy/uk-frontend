import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, ListItemText, Box } from "@mui/material";
import IconSlot from "../atoms/IconSlot";
import NavChevron from "../atoms/NavChevron";

export default function NavItem({ item, level, selected, open, onClick }) {
  const leftPad = 12 + level * 12;

  return (
    <ListItemButton onClick={onClick} selected={!!selected} sx={{ pl: leftPad }}>
      {item.icon && (
        <Box
          sx={{
            // show on mobile, hide on desktop
            display: { xs: "inline-flex", md: "none" },
            alignItems: "center",
            mr: { xs: 1.5, md: 0 },
          }}
        >
          <IconSlot name={item.icon} />
        </Box>
      )}

      <ListItemText primary={item.label} />

      {Array.isArray(item.children) && item.children.length ? (
        <NavChevron open={open} />
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
};
