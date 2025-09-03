import React from "react";
import PropTypes from "prop-types";
import {
  AppBar, Toolbar, Box, Typography, IconButton, Collapse, Badge, Avatar,
  Menu, MenuItem, Divider, ListItemIcon, ListItemText, ListSubheader,
  List, ListItemButton, Tooltip
} from "@mui/material";
import SearchField from "../atoms/SearchField";
import ActionsTray from "../molecules/ActionsTray"; // keep if you still need it
import { getIcon } from "../utils/icons";

function useMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onOpen = (e) => setAnchorEl(e.currentTarget);
  const onClose = () => setAnchorEl(null);
  return { anchorEl, open, onOpen, onClose };
}

export default function TopBar(props) {
  const {
    isDesktop, logo, title,
    searchValue, onSearchChange, onSearchEnter, onOpenMobile, user,
    showSearchOnDesktop = false, maxSearchWidthDesktop = 560,
    mobileSearchInitiallyOpen = false, onToggleMobileSearch,
    notifications = [], notificationCount, onClickNotification,
    profileMenu = [], onLogout, homeMenu = [], lineDeptMenu = [],
  } = props;

  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(!!mobileSearchInitiallyOpen);
  const searchPanelId = "topbar-mobile-search";
  const toggleMobileSearch = () => {
    const next = !mobileSearchOpen;
    setMobileSearchOpen(next);
    onToggleMobileSearch?.(next);
  };

  // Menus
  const notif = useMenu();
  const profile = useMenu();
  const home = useMenu();
  const line = useMenu();

  const unread = React.useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  return (
    <AppBar position="static" elevation={0} color="default"
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
        {/* Left: hamburger (mobile) */}
        {!isDesktop && (
          <IconButton edge="start" onClick={onOpenMobile} aria-label="Open menu" size="large" sx={{ mr: 0.5 }}>
            {getIcon("menu")}
          </IconButton>
        )}

        {/* LEFT SIDE: brand (logo + project title) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flexShrink: 1 }}>
          {logo}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  maxWidth: { xs: 160, sm: 240, md: "none" } }}
            title={title}
          >
            {title}
          </Typography>
        </Box>

        {/* optional centered search on desktop; otherwise just fill space */}
        {isDesktop && showSearchOnDesktop ? (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 2 }}>
            <Box sx={{ flex: 1, maxWidth: maxSearchWidthDesktop, minWidth: 200 }}>
              <SearchField value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {/* RIGHT SIDE: ALL ICONS/MENUS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Mobile search toggle */}
          {!isDesktop && (
            <IconButton
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen ? "true" : "false"}
              aria-controls={searchPanelId}
              onClick={toggleMobileSearch}
              size="large"
            >
              {mobileSearchOpen ? getIcon("close") : getIcon("search")}
            </IconButton>
          )}

          {/* Home menu trigger (desktop only, on RIGHT now) */}
          {isDesktop && (
            <Tooltip title="Home">
              <IconButton
                aria-haspopup="menu"
                aria-controls={home.open ? "home-menu" : undefined}
                aria-expanded={home.open ? "true" : undefined}
                onClick={home.onOpen}
                size="large"
              >
                {getIcon("home")}
              </IconButton>
            </Tooltip>
          )}

          {/* Line Department menu trigger (desktop only, on RIGHT now) */}
          {isDesktop && (
            <Tooltip title="Line Department">
              <IconButton
                aria-haspopup="menu"
                aria-controls={line.open ? "line-menu" : undefined}
                aria-expanded={line.open ? "true" : undefined}
                onClick={line.onOpen}
                size="large"
              >
                {getIcon("layers")}
              </IconButton>
            </Tooltip>
          )}

          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            aria-haspopup="menu"
            aria-controls={notif.open ? "notif-menu" : undefined}
            aria-expanded={notif.open ? "true" : undefined}
            onClick={notif.onOpen}
            size="large"
          >
            <Badge badgeContent={notificationCount ?? unread} color="error" max={99}>
              {getIcon("notifications")}
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            aria-label="Account"
            aria-haspopup="menu"
            aria-controls={profile.open ? "profile-menu" : undefined}
            aria-expanded={profile.open ? "true" : undefined}
            onClick={profile.onOpen}
            size="large"
          >
            <Avatar sx={{ width: 28, height: 28 }}>
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile search panel */}
      {!isDesktop && (
        <Collapse in={mobileSearchOpen} timeout="auto" unmountOnExit>
          <Box
            id={searchPanelId}
            sx={{ px: 2, py: 1, borderTop: "1px solid", borderColor: "divider",
                  bgcolor: "background.paper", display: "flex" }}
          >
            <SearchField autoFocus value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} fullWidth />
          </Box>
        </Collapse>
      )}

      {/* MENUS (unchanged) */}
      <Menu id="home-menu" anchorEl={home.anchorEl} open={home.open} onClose={home.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <ListSubheader disableSticky>Home</ListSubheader>
        {homeMenu.map(item => (
          <MenuItem key={item.id} onClick={() => { home.onClose(); item.onClick?.(item); }}>
            {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Menu id="line-menu" anchorEl={line.anchorEl} open={line.open} onClose={line.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <ListSubheader disableSticky>Line Department</ListSubheader>
        <List dense disablePadding sx={{ minWidth: 260, maxHeight: 360, overflowY: "auto" }}>
          {lineDeptMenu.map(item => (
            <ListItemButton key={item.id} onClick={() => { line.onClose(); item.onClick?.(item); }}>
              {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Menu>

      <Menu id="notif-menu" anchorEl={notif.anchorEl} open={notif.open} onClose={notif.onClose}
            slotProps={{ paper: { sx: { width: 360, maxWidth: "calc(100vw - 32px)" } } }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <ListSubheader disableSticky>Notifications</ListSubheader>
        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <MenuItem disabled>No notifications</MenuItem>
          ) : notifications.map(n => (
            <MenuItem key={n.id}
              onClick={() => { notif.onClose(); onClickNotification?.(n); }}
              sx={{ alignItems: "flex-start", gap: 1, whiteSpace: "normal" }}>
              <Avatar sx={{ width: 32, height: 32 }}>{n.avatar ?? "U"}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: n.unread ? 600 : 400 }} noWrap title={n.title}>
                  {n.title}
                </Typography>
                {n.subtitle && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap title={n.subtitle}>
                    {n.subtitle}
                  </Typography>
                )}
                {n.time && <Typography variant="caption" color="text.secondary">{n.time}</Typography>}
              </Box>
            </MenuItem>
          ))}
        </Box>
        <Divider />
        <MenuItem onClick={notif.onClose}>
          <ListItemIcon>{getIcon("inbox")}</ListItemIcon>
          <ListItemText>Show all messages</ListItemText>
        </MenuItem>
      </Menu>

      <Menu id="profile-menu" anchorEl={profile.anchorEl} open={profile.open} onClose={profile.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {profileMenu.map(item => (
          <MenuItem key={item.id} onClick={() => { profile.onClose(); item.onClick?.(item); }}>
            {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        {profileMenu.length ? <Divider /> : null}
        <MenuItem onClick={() => { profile.onClose(); onLogout?.(); }}>
          <ListItemIcon>{getIcon("logout")}</ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
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
  showSearchOnDesktop: PropTypes.bool,
  maxSearchWidthDesktop: PropTypes.number,
  mobileSearchInitiallyOpen: PropTypes.bool,
  onToggleMobileSearch: PropTypes.func,

  // NEW
  notifications: PropTypes.array,
  notificationCount: PropTypes.number,
  onClickNotification: PropTypes.func,
  profileMenu: PropTypes.array,
  onLogout: PropTypes.func,
  homeMenu: PropTypes.array,
  lineDeptMenu: PropTypes.array,
};
