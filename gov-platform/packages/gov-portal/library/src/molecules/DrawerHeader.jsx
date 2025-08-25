import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function DrawerHeader({ logo, title, showClose, onClose, showTitle = true }) {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {logo}
                    {showTitle && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
                    )}                
                </Box>
                {showClose && (
                    <IconButton onClick={onClose} aria-label="Close menu"><CloseIcon /></IconButton>
                )}
            </Box>
            <Divider />
        </>
    );
}
DrawerHeader.propTypes = { logo: PropTypes.node, title: PropTypes.string, showClose: PropTypes.bool, onClose: PropTypes.func };