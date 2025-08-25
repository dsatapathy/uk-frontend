import React from "react";
import PropTypes from "prop-types";
import { ListItemIcon } from "@mui/material";
import { getIcon } from "../utils/icons.jsx";


export default function IconSlot({ name }) {
    if (!name) return null;
    return <ListItemIcon sx={{ minWidth: 32 }}>{getIcon(name)}</ListItemIcon>;
}
IconSlot.propTypes = { name: PropTypes.string };