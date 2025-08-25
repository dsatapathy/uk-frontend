import React from "react";
import PropTypes from "prop-types";
import { Box, Drawer } from "@mui/material";
import DrawerHeader from "../molecules/DrawerHeader";
import NavTree from "../molecules/NavTree";
import { DRAWER_WIDTH } from "../utils/menu-utils";
import SearchField from "../atoms/SearchField";


export default function Sidebar({ isDesktop, open, onClose, logo, title, items, currentPath, expandedSet, onToggle, onNavigate, searchValue, onSearchChange, onSearchEnter }) {    const content = (
        <Box role="navigation" sx={{ width: { xs: 280, md: DRAWER_WIDTH } }}>
            {/* Show title in the drawer header ONLY on mobile; hide on desktop */}
            <DrawerHeader logo={logo} title={title} showClose={!isDesktop} showTitle={!isDesktop} onClose={onClose} />

            {/* On desktop, search lives inside the sidebar */}
            {isDesktop && (
                <Box sx={{ p: 1.5 }}>
                    <SearchField value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} />
                </Box>
            )}
            <NavTree items={items} currentPath={currentPath} expandedSet={expandedSet} onToggle={onToggle} onNavigate={onNavigate} />
        </Box>
    );


    return isDesktop ? (
        <Drawer variant="permanent" open PaperProps={{ sx: { position: "relative", width: DRAWER_WIDTH, borderRight: "1px solid", borderColor: "divider" } }}>
            {content}
        </Drawer>
    ) : (
        <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: 280 } }}>
            {content}
        </Drawer>
    );
}
Sidebar.propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    logo: PropTypes.node,
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    currentPath: PropTypes.string.isRequired,
    expandedSet: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    searchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    onSearchEnter: PropTypes.func,
};