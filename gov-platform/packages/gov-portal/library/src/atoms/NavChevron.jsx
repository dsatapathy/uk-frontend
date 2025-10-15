import React from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function NavChevron({ open, sx, fontSize = "small", ...props }) {
  const common = {
    color: "inherit",                 // let it inherit from parent
    sx: { color: "inherit", ...(sx || {}) },  // allow overrides
    fontSize,
    ...props,
  };
  return open ? <ExpandLess {...common} /> : <ExpandMore {...common} />;
}