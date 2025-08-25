import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";


export const ICONS = {
    home: HomeIcon,
    layers: LayersIcon,
    report: AssessmentIcon,
    settings: SettingsIcon,
    external: OpenInNewIcon,
};


export function getIcon(name, props = {}) {
    if (!name) return null;
    const key = String(name || "").toLowerCase();
    const Comp = ICONS[key];
    return Comp ? <Comp fontSize="small" {...props} /> : null;
}