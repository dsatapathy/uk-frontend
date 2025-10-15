// atoms/IconSlot.jsx
import React from "react";
import PropTypes from "prop-types";
import { ListItemIcon } from "@mui/material";
import { getIcon } from "../utils/icons.jsx";

export default function IconSlot({ name, className, sx }) {
  if (!name) return null;
  return (
    <ListItemIcon className={className} sx={{ minWidth: 32, color: "inherit", ...(sx || {}) }}>
      {getIcon(name)}
    </ListItemIcon>
  );
}
IconSlot.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
};
