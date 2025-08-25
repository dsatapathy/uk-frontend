import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchField from "../atoms/SearchField";
import ActionsTray from "../molecules/ActionsTray";


export default function TopBar({ isDesktop, logo, title, searchValue, onSearchChange, onSearchEnter, onOpenMobile, user }) {
    return (
        <AppBar position="static" elevation={0} color="default" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Toolbar sx={{ gap: 1 }}>
                {!isDesktop && (
                    <IconButton edge="start" onClick={onOpenMobile} aria-label="Open menu"><MenuIcon /></IconButton>
                )}
                {/* Brand block */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}>
                    {logo}
                    {/* Title should be visible in mobile top bar; keeping it visible on desktop is OK too */}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
                </Box>

                {/* Search should appear in the TopBar only on mobile */}
                {!isDesktop && (
                    <SearchField value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} />
                )}
                <ActionsTray user={user} />
            </Toolbar>
        </AppBar>
    );
}
TopBar.propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    logo: PropTypes.node,
    title: PropTypes.string,
    searchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    onSearchEnter: PropTypes.func,
    onOpenMobile: PropTypes.func,
    user: PropTypes.object,
};