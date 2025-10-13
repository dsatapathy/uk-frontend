import React from "react";
import PropTypes from "prop-types";
import {
  AppBar, Toolbar, Box, IconButton, Collapse, Badge, Avatar,
  Menu, MenuItem, Divider, ListItemIcon, ListItemText, ListSubheader,
  List, ListItemButton, Tooltip, Button, Chip
} from "@mui/material";
import Grow from "@mui/material/Grow";
import { useTheme, alpha } from "@mui/material/styles";
import TypographyX from "../atoms/TypographyX";
import SearchField from "../atoms/SearchField";
import { getIcon } from "../utils/icons";
import { Brand } from "../components/Brand";
import { useAppConfig } from "@gov/ui-engine";
import defaultS from "@gov/styles/modules/auth/Auth.module.scss";

function useMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onOpen = (e) => setAnchorEl(e.currentTarget);
  const onClose = () => setAnchorEl(null);
  return { anchorEl, open, onOpen, onClose };
}

/** Compact, modern action chip:
 * - On md+ shows icon + label inside a rounded pill
 * - On xs/sm, collapses label; still shows a Tooltip
 * - Hover grows the pill width and fades label in (md+ only)
 */
function ActionChip({
  icon,
  label,
  onClick,
  tooltip,
  color = "default",
  endAdornment,
  sx,
  collapseOnSmall = true,
  "aria-controls": ariaControls,
  "aria-haspopup": ariaHasPopup,
  "aria-expanded": ariaExpanded,
}) {
  const theme = useTheme();
  const isSmall = /xs|sm/.test(theme.breakpoints.keys.find(k => theme.breakpoints.only(k).toString())); // no actual call—just placeholder; we’ll use CSS breakpoints instead

  const baseBg =
    color === "primary"
      ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.12)
      : alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.18 : 0.08);

  const chip = (
    <Box
      onClick={onClick}
      role="button"
      aria-controls={ariaControls}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: { xs: 0.75, md: 1.25 },
        py: 0.75,
        borderRadius: 2,
        cursor: "pointer",
        userSelect: "none",
        lineHeight: 1,
        backgroundColor: baseBg,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        transition: "all 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          backgroundColor:
            color === "primary"
              ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.28 : 0.18)
              : alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.24 : 0.12),
          boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        },
        "&:active": { transform: "translateY(0)" },
        ...sx,
      }}
    >
      <Box sx={{ display: "grid", placeItems: "center", fontSize: 20 }}>{icon}</Box>

      {/* Label appears on md+; animates in/out based on hover */}
      <Box
        sx={{
          display: { xs: collapseOnSmall ? "none" : "inline-flex", sm: collapseOnSmall ? "none" : "inline-flex", md: "inline-flex" },
          alignItems: "center",
          gap: 0.75,
          pr: endAdornment ? 0.5 : 0,
          transition: "opacity 160ms ease",
          fontWeight: 700,
          fontSize: ".9rem",
        }}
      >
        {label}
        {endAdornment}
      </Box>
    </Box>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow disableInteractive>
      {chip}
    </Tooltip>
  ) : (
    chip
  );
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

  const theme = useTheme();
  const s = defaultS;
  const appCfg = useAppConfig();

  const primaryColor = appCfg?.theme?.palette?.primary?.main || theme.palette.primary.main;
  const titleBase = React.useMemo(() => ({ fontWeight: 700, color: primaryColor }), [primaryColor]);
  const titleSx = isDesktop
    ? { ...titleBase, fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" } }
    : { ...titleBase, fontSize: "1.1rem" };

  const desktopTitleSx = React.useMemo(
    () => ({
      fontWeight: 700,
      color: primaryColor,
      fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
    }),
    [primaryColor]
  );

  const brandProps = React.useMemo(() => {
    const topBarCfg = appCfg?.topBar || {};
    if (isDesktop) {
      const override = topBarCfg.titleSx || topBarCfg.labelSx || {};
      return { ...topBarCfg, titleSx: { ...desktopTitleSx, ...override } };
    }
    return topBarCfg;
  }, [appCfg, desktopTitleSx, isDesktop]);

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

  // ---- Modern menu visuals
  const menuPaperSx = {
    borderRadius: 2,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    background:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.9)
        : "rgba(255,255,255,0.85)",
    boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    minWidth: 260,
  };

  const headerBar = (iconName, label, extraRight = null) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.25,
        background:
          theme.palette.mode === "dark"
            ? alpha(primaryColor, 0.18)
            : `linear-gradient(135deg, ${alpha(primaryColor, 0.18)}, ${alpha(primaryColor, 0.06)})`,
      }}
    >
      <Box
        sx={{
          width: 28, height: 28, borderRadius: "50%",
          display: "grid", placeItems: "center",
          backgroundColor: alpha(primaryColor, 0.18),
          color: primaryColor,
        }}
      >
        {getIcon(iconName)}
      </Box>
      <TypographyX variant="subtitle2" sx={{ fontWeight: 800 }}>{label}</TypographyX>
      <Box sx={{ ml: "auto" }}>{extraRight}</Box>
    </Box>
  );

  const itemSx = {
    mx: 1, my: 0.25, borderRadius: 2,
    "&:hover": { backgroundColor: alpha(primaryColor, 0.08) },
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      color="default"
      sx={{
        borderBottom: "1px solid",
        borderColor: "var(--topbar-border)",
        backgroundColor: "transparent",
        color: "var(--topbar-fg)",
        boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
        {!isDesktop && (
          <IconButton edge="start" onClick={onOpenMobile} aria-label="Open menu" size="large" sx={{ mr: 0.5 }}>
            {getIcon("menu")}
          </IconButton>
        )}

        <Brand classes={s} {...brandProps} showLogo={isDesktop} titleSx={titleSx} />

        {isDesktop && showSearchOnDesktop ? (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 2 }}>
            <Box sx={{ flex: 1, maxWidth: maxSearchWidthDesktop, minWidth: 200 }}>
              <SearchField value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {/* Right actions: chips that show text on md+ and tooltip on small */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {/* Mobile search toggle stays icon-only */}
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

          {/* Home */}
          <ActionChip
            icon={getIcon("home")}
            label="Home"
            tooltip="Home"
            onClick={home.onOpen}
            aria-haspopup="menu"
            aria-controls={home.open ? "home-menu" : undefined}
            aria-expanded={home.open ? "true" : undefined}
          />

          {/* Line Departments */}
          <ActionChip
            icon={getIcon("layers")}
            label="Line Dept."
            tooltip="Line Department"
            onClick={line.onOpen}
            aria-haspopup="menu"
            aria-controls={line.open ? "line-menu" : undefined}
            aria-expanded={line.open ? "true" : undefined}
          />

          {/* Notifications (optional; shows badge on chip) */}
          {/* <ActionChip
            icon={
              <Badge badgeContent={notificationCount ?? unread} color="error" max={99}>
                {getIcon("notifications")}
              </Badge>
            }
            label="Alerts"
            tooltip="Notifications"
            onClick={notif.onOpen}
            aria-haspopup="menu"
            aria-controls={notif.open ? "notif-menu" : undefined}
            aria-expanded={notif.open ? "true" : undefined}
          /> */}

          {/* Profile */}
          <ActionChip
            icon={<Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </Avatar>}
            label={user?.name ? user.name.split(" ")[0] : "Account"}
            tooltip="Account"
            onClick={profile.onOpen}
            aria-haspopup="menu"
            aria-controls={profile.open ? "profile-menu" : undefined}
            aria-expanded={profile.open ? "true" : undefined}
            sx={{ pl: 0.75, pr: 1 }}
          />
        </Box>
      </Toolbar>

      {/* Mobile search panel */}
      {!isDesktop && (
        <Collapse in={mobileSearchOpen} timeout="auto" unmountOnExit>
          <Box
            id={searchPanelId}
            sx={{
              px: 2, py: 1, borderTop: "1px solid", borderColor: "divider",
              bgcolor: "background.paper", display: "flex"
            }}
          >
            <SearchField autoFocus value={searchValue} onChange={onSearchChange} onEnter={onSearchEnter} fullWidth />
          </Box>
        </Collapse>
      )}

      {/* HOME menu */}
      <Menu
        id="home-menu"
        anchorEl={home.anchorEl}
        open={home.open}
        onClose={home.onClose}
        TransitionComponent={Grow}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: menuPaperSx } }}
        MenuListProps={{ dense: true, disablePadding: true }}
      >
        {headerBar("home", "Home")}
        <Box sx={{ py: 0.5 }}>
          {homeMenu.map(item => (
            <MenuItem
              key={item.id}
              onClick={() => { home.onClose(); item.onClick?.(item); }}
              sx={itemSx}
            >
              {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Box>
        {!!homeMenu.length && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ p: 1.25 }}>
              <Button
                fullWidth size="small" variant="outlined"
                startIcon={getIcon("dashboard")}
                onClick={home.onClose}
              >
                Go to Dashboard
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* LINE DEPARTMENT menu */}
      <Menu
        id="line-menu"
        anchorEl={line.anchorEl}
        open={line.open}
        onClose={line.onClose}
        TransitionComponent={Grow}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { ...menuPaperSx, minWidth: 300 } } }}
        MenuListProps={{ dense: true, disablePadding: true }}
      >
        {headerBar("layers", "Line Departments")}
        <List dense disablePadding sx={{ maxHeight: 360, overflowY: "auto", py: 0.5 }}>
          {lineDeptMenu.map(item => (
            <ListItemButton
              key={item.id}
              onClick={() => { line.onClose(); item.onClick?.(item); }}
              sx={itemSx}
            >
              {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
              <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Menu>

      {/* NOTIFICATIONS menu (optional) */}
      <Menu
        id="notif-menu"
        anchorEl={notif.anchorEl}
        open={notif.open}
        onClose={notif.onClose}
        TransitionComponent={Grow}
        slotProps={{ paper: { sx: { ...menuPaperSx, width: 380, maxWidth: "calc(100vw - 32px)" } } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ disablePadding: true }}
      >
        {headerBar("notifications", "Notifications",
          <Badge color="error" badgeContent={notificationCount ?? unread} sx={{ mr: 0.5 }} />
        )}
        <Box sx={{ maxHeight: 420, overflowY: "auto", p: 1 }}>
          {notifications.length === 0 ? (
            <MenuItem disabled sx={{ borderRadius: 2, mx: 1 }}>No notifications</MenuItem>
          ) : notifications.map(n => (
            <MenuItem
              key={n.id}
              onClick={() => { notif.onClose(); onClickNotification?.(n); }}
              sx={{
                alignItems: "flex-start",
                gap: 1,
                whiteSpace: "normal",
                borderRadius: 2,
                my: 0.5,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.06) },
              }}
            >
              <Avatar sx={{ width: 34, height: 34 }}>{n.avatar ?? "U"}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <TypographyX variant="body2" sx={{ fontWeight: n.unread ? 700 : 500 }} noWrap title={n.title}>
                  {n.title}
                </TypographyX>
                {n.subtitle && (
                  <TypographyX variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap title={n.subtitle}>
                    {n.subtitle}
                  </TypographyX>
                )}
                {n.time && <TypographyX variant="caption" color="text.secondary">{n.time}</TypographyX>}
              </Box>
            </MenuItem>
          ))}
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ p: 1.25 }}>
          <Button fullWidth size="small" startIcon={getIcon("inbox")} onClick={notif.onClose}>
            Show all messages
          </Button>
        </Box>
      </Menu>

      {/* PROFILE menu with quick profile card */}
      <Menu
        id="profile-menu"
        anchorEl={profile.anchorEl}
        open={profile.open}
        onClose={profile.onClose}
        TransitionComponent={Grow}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: menuPaperSx } }}
        MenuListProps={{ dense: true, disablePadding: true }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1.25, display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar sx={{ width: 40, height: 40 }}>
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <TypographyX variant="subtitle2" sx={{ fontWeight: 800 }} noWrap title={user?.name || "User"}>
              {user?.name || "User"}
            </TypographyX>
            {user?.email && (
              <TypographyX variant="caption" color="text.secondary" noWrap title={user.email}>
                {user.email}
              </TypographyX>
            )}
          </Box>
        </Box>
        <Divider />

        <Box sx={{ py: 0.5 }}>
          {profileMenu.map(item => (
            <MenuItem
              key={item.id}
              onClick={() => { profile.onClose(); item.onClick?.(item); }}
              sx={itemSx}
            >
              {item.icon ? <ListItemIcon>{getIcon(item.icon)}</ListItemIcon> : null}
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Box>

        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => { profile.onClose(); onLogout?.(); }}
          sx={{
            ...itemSx,
            my: 1,
            color: theme.palette.error.main,
            "& .MuiListItemIcon-root": { color: theme.palette.error.main },
            "&:hover": { backgroundColor: alpha(theme.palette.error.main, 0.08) },
          }}
        >
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
  notifications: PropTypes.array,
  notificationCount: PropTypes.number,
  onClickNotification: PropTypes.func,
  profileMenu: PropTypes.array,
  onLogout: PropTypes.func,
  homeMenu: PropTypes.array,
  lineDeptMenu: PropTypes.array,
};
