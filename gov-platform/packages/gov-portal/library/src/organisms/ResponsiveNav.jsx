import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { findAncestorsByPath, filterTreeByQuery } from "../utils/menu-utils";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";


export default function ResponsiveNav({ menu, logo, title, user, onSearch, onNavigate, currentPath, children }) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const [openMobile, setOpenMobile] = React.useState(false);
    const [query, setQuery] = React.useState("");


    const defaultExpanded = React.useMemo(() => findAncestorsByPath(menu, currentPath), [menu, currentPath]);
    const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));


    React.useEffect(() => {
        const anc = findAncestorsByPath(menu, currentPath);
        setExpanded((prev) => new Set([...prev, ...anc]));
    }, [menu, currentPath]);


    const filteredMenu = React.useMemo(() => filterTreeByQuery(menu, query), [menu, query]);


    const onToggle = React.useCallback((id) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);


    return (
        <Box sx={{ display: "grid", gridTemplateRows: "56px 1fr", height: "100vh" }}>
            <TopBar
                isDesktop={isDesktop}
                logo={logo}
                title={title}
                user={user}
                searchValue={query}
                onSearchChange={setQuery}
                onSearchEnter={(q) => onSearch?.(q)}
                onOpenMobile={() => setOpenMobile(true)}
            />


            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "256px 1fr" }, minHeight: 0 }}>
                <Sidebar
                    isDesktop={isDesktop}
                    open={openMobile}
                    onClose={() => setOpenMobile(false)}
                    logo={logo}
                    title={title}
                    items={filteredMenu}
                    currentPath={currentPath}
                    expandedSet={expanded}
                    onToggle={onToggle}
                    onNavigate={onNavigate}
                    searchValue={query}
                    onSearchChange={setQuery}
                    onSearchEnter={(q) => onSearch?.(q)}
                />
                <Box component="main" sx={{ p: 2, overflow: "auto" }}>{children}</Box>
            </Box>
        </Box>
    );
}
ResponsiveNav.propTypes = {
    menu: PropTypes.array.isRequired,
    logo: PropTypes.node,
    title: PropTypes.string,
    user: PropTypes.object,
    onSearch: PropTypes.func,
};