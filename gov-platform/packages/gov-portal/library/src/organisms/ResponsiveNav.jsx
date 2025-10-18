import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { findAncestorsByPath, filterTreeByQuery, DRAWER_WIDTH } from "../utils/menu-utils";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { handleLogoutService } from "@gov/data";
import { useLoader } from "../atoms/Loader";
import { useSnackbar } from "../atoms/Snackbar";

export default function ResponsiveNav({
  menu,
  logo,
  title,
  user,
  onSearch,
  onNavigate,
  currentPath,
  children,
}) {
  const theme = useTheme();
  const mdUpQuery = React.useMemo(() => theme.breakpoints.up("md"), [theme]);
  const normalizedMdQuery = React.useMemo(
    () => (mdUpQuery.startsWith("@media ") ? mdUpQuery.replace("@media ", "") : mdUpQuery),
    [mdUpQuery],
  );
  const defaultDesktopMatch = React.useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(normalizedMdQuery).matches;
  }, [normalizedMdQuery]);
  const mediaQueryOptions = React.useMemo(
    () => ({ defaultMatches: defaultDesktopMatch, noSsr: true }),
    [defaultDesktopMatch],
  );
  const isDesktop = useMediaQuery(mdUpQuery, mediaQueryOptions);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { show, hide } = useLoader();
  const { enqueue } = useSnackbar();
  const defaultExpanded = React.useMemo(
    () => findAncestorsByPath(menu, currentPath),
    [menu, currentPath]
  );
  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));

  React.useEffect(() => {
    const anc = findAncestorsByPath(menu, currentPath);
    setExpanded((prev) => new Set([...prev, ...anc]));
  }, [menu, currentPath]);

  const filteredMenu = React.useMemo(
    () => filterTreeByQuery(menu, query),
    [menu, query]
  );
  const logoutService = async () => {

    try {
      show("Logging out...");
      // call actual logout service
      const isLoggedOut = await handleLogoutService();
      if (isLoggedOut) {
        hide();
        enqueue({
          message: "Logged out successfully",
          severity: "success",
          duration: 3000,
        });
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      } else {
        hide();
        enqueue({
          message: "Failed to log out",
          severity: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      hide();
      enqueue({
        message: "Failed to log out",
        severity: "error",
        duration: 5000,
      });
    }
  };

  const onToggle = React.useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: { xs: "56px 1fr", sm: "64px 1fr" },
        "--sidebar-w": `${DRAWER_WIDTH}px`,
        "--sidebar-collapsed-w": "72px",
        height: "100dvh",          // lock to viewport
        overflow: "hidden",        // window never scrolls
      }}
    >
      <TopBar
        isDesktop={isDesktop}
        logo={logo}
        title={title}
        user={user}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchEnter={(q) => onSearch?.(q)}
        onOpenMobile={() => setOpenMobile(true)}
        notifications={[
          { id: 1, title: "UGVS-REAP : MIS", subtitle: "Velit asperiores...", time: "4 hrs ago", unread: true },
          { id: 2, title: "File report ready", subtitle: "Click to view", time: "Yesterday" },
        ]}
        onClickNotification={(n) => onNavigate?.(`/messages/${n.id}`)}
        homeMenu={[
          { id: "dash", label: "Dashboard", icon: "home", onClick: () => onNavigate?.("/") },
          { id: "reports", label: "Reports", icon: "report", onClick: () => onNavigate?.("/reports") },
        ]}
        lineDeptMenu={[
          { id: "agri", label: "Agriculture", icon: "layers", onClick: () => onNavigate?.("/dept/agri") },
          { id: "fisheries", label: "Fisheries", icon: "layers", onClick: () => onNavigate?.("/dept/fisheries") },
        ]}
        profileMenu={[
          { id: "profile", label: "My Profile", icon: "user", onClick: () => onNavigate?.("/me") },
          { id: "settings", label: "Settings", icon: "settings", onClick: () => onNavigate?.("/settings") },
        ]}
        onLogout={logoutService}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
          minHeight: 0,
          overflow: "hidden",      // prevent second scrollbar here
        }}
      >
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

        {/* Only scrolling area for page content */}
        <Box
          component="main"
          sx={{
            // p: 2,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
          }}
        >
          {children}
        </Box>
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
  onNavigate: PropTypes.func,
  currentPath: PropTypes.string,
  children: PropTypes.node,
};
