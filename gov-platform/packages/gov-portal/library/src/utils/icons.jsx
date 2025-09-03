// utils/icons.js
import React from "react";

// Core nav
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";

// Actions & status
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";

// UI chrome
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// People
import PersonIcon from "@mui/icons-material/Person";

export const ICONS = {
  // nav
  home: HomeIcon,
  layers: LayersIcon,

  // actions/status
  report: AssessmentIcon,
  settings: SettingsIcon,
  external: OpenInNewIcon,
  logout: LogoutIcon,
  notifications: NotificationsIcon,
  notification: NotificationsIcon,
  bell: NotificationsIcon,
  inbox: InboxIcon,
  mail: InboxIcon,
  messages: InboxIcon,

  // ui chrome
  menu: MenuIcon,
  search: SearchIcon,
  close: CloseIcon,

  // people
  user: PersonIcon,
  person: PersonIcon,
  account: PersonIcon,
};

export function getIcon(name, props = {}) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  const Comp = ICONS[key];
  return Comp ? <Comp fontSize="small" {...props} /> : null;
}
