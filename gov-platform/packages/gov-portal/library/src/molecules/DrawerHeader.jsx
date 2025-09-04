import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function DrawerHeader({ logo, title, showClose, onClose, showTitle = true }) {
    return (
        <>
            <Box
                sx={{
                    p: 1.5,
                    position: "relative",
                }}
            >
                {/* FULL-WIDTH LOGO WRAPPER */}
                <Box
                    sx={{
                        width: "100%",
                        "& img, & svg, & .logo": {
                            width: "100% !important",
                            height: "auto !important",
                            display: "block",
                            // objectFit: "contain",
                            borderRadius: 1.5,
                        },
                    }}
                >
                    {logo}
                </Box>

                {showClose && (
                    <IconButton
                        onClick={onClose}
                        aria-label="Close menu"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            <Divider />
        </>
    );
}
DrawerHeader.propTypes = { logo: PropTypes.node, title: PropTypes.string, showClose: PropTypes.bool, onClose: PropTypes.func };