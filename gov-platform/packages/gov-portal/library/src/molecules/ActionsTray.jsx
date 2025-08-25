import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Tooltip, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";


export default function ActionsTray({ user }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
                <IconButton>
                    <Badge color="error" variant="dot"><NotificationsIcon /></Badge>
                </IconButton>
            </Tooltip>
            <Tooltip title={user?.name || "Account"}>
                <IconButton><AccountCircle /></IconButton>
            </Tooltip>
        </Box>
    );
}
ActionsTray.propTypes = { user: PropTypes.object };