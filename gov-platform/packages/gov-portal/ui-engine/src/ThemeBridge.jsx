// ThemeBridge.jsx
import * as React from "react";
import { GlobalStyles, useTheme } from "@mui/material";
import { alpha, lighten, darken } from "@mui/material/styles";

export default function ThemeBridge() {
  const t = useTheme();
  const p = t.palette;

  // Subtle surfaces from MUI background.paper
  const paper = p.background.paper;
  const surface2 = p.mode === "light" ? lighten(paper, 0.02) : darken(paper, 0.06);
  const surface3 = p.mode === "light" ? lighten(paper, 0.04) : darken(paper, 0.10);

  // Palette-aware focus ring
  const focus = alpha(p.primary.main, p.mode === "light" ? 0.35 : 0.45);

  const radius = typeof t.shape.borderRadius === "number"
    ? `${t.shape.borderRadius}px`
    : String(t.shape.borderRadius || "8px");

  return (
    <GlobalStyles
      styles={{
        html: { colorScheme: p.mode },

        ":root": {
          /* ---------------- Agri (Green) Scale ---------------- */
          "--agri-50": "#ecfdf5",
          "--agri-100": "#d1fae5",
          "--agri-200": "#a7f3d0",
          "--agri-300": "#6ee7b7",
          "--agri-400": "#34d399",
          "--agri-500": "#10b981",
          "--agri-600": "#16a34a", /* brand */
          "--agri-700": "#15803d",
          "--agri-800": "#166534",
          "--agri-900": "#14532d",

          /* Semantic surfaces & text (from MUI theme) */
          "--g-bg": p.background.default,
          "--g-surface-1": paper,
          "--g-surface-2": surface2,
          "--g-surface-3": surface3,
          "--g-fg": p.text.primary,
          "--g-fg-muted": p.text.secondary,
          "--g-border": p.divider,

          /* Brand / links */
          "--g-primary": "var(--agri-600)",
          "--g-primary-contrast": "#ffffff",
          "--g-secondary": "var(--agri-700)",
          "--g-link": "var(--agri-600)",
          "--g-focus-ring": focus, // palette-synced focus ring

          /* Functional (kept from MUI theme) */
          "--success-600": p.success.main,
          "--warning-600": p.warning.main,
          "--error-600": p.error.main,
          "--info-600": p.info.main,

          /* Shape */
          "--g-radius": radius,

          /* Login defaults (overridable via styleVars) */
          "--login-card-border": `1px solid ${p.divider}`,
          "--login-bg": "linear-gradient(180deg, var(--agri-50), var(--agri-100))",
          "--login-overlay": "color-mix(in srgb, #ffffff 60%, transparent)",

          //* -------- Sidebar (LIGHT) : deep, contrasty agri gradient -------- */
          "--sidebar-fg": "var(--g-fg)",
          "--sidebar-fg-dim": "var(--g-fg-muted)",
          "--sidebar-line": "color-mix(in srgb, var(--agri-900) 55%, transparent)",
          "--sidebar-focus": "var(--g-primary)",
          "--sidebar-icon": "var(--g-fg-muted)",

          /* ---------------- NavItem specific tokens ---------------- */
          "--sidebar-fg": "#EAF0F7", // txt
          "--sidebar-fg-dim": "rgba(234,240,247,0.72)", // txtDim
          "--sidebar-hover-bg": "rgba(255,255,255,0.06)", // hoverBg
          "--sidebar-active-bg": "rgba(120,180,255,0.14)", // activeBg
          "--sidebar-active-bd": "rgba(120,180,255,0.28)", // activeBd
          "--sidebar-accent": "rgba(120,180,255,1)", // accent
          "--sidebar-label-active": "#DCE9FF", // active label color

          /* Base: 3 stops (very dark green to slightly lighter dark green) */
          "--sidebar-bg-top": "#0b1a12",
          "--sidebar-bg-mid": "#0a2015",
          "--sidebar-bg-bottom": "#07140e",

          /* Accents */
          "--sidebar-glow-1": "color-mix(in srgb, var(--agri-600) 18%, transparent)", // emerald
          "--sidebar-glow-2": "color-mix(in srgb, var(--agri-500) 14%, transparent)", // jade
          "--sidebar-sheen-1": "color-mix(in srgb, var(--agri-700) 12%, transparent)", // diagonal sheen
          "--sidebar-sheen-2": "color-mix(in srgb, var(--agri-500) 10%, transparent)",

          "--sidebar-scroll": "color-mix(in srgb, var(--g-fg) 25%, transparent)",
          "--sidebar-foot-glow": "color-mix(in srgb, var(--g-fg) 3%, transparent)",
        },

        /* ---------------- Dark theme overrides ---------------- */
        '[data-theme="dark"]': {
          "--g-primary": "var(--agri-500)",
          "--g-primary-contrast": "#0b0f19",
          "--g-secondary": "var(--agri-400)",
          "--g-link": "var(--agri-400)",
          "--g-focus-ring": focus,

          "--login-bg": "linear-gradient(180deg, #0f1a14, #0b1510)",
          "--login-overlay": "color-mix(in srgb, #0b1510 40%, transparent)",

          /* Sidebar even deeper in dark */
          "--sidebar-line": "color-mix(in srgb, var(--agri-900) 65%, transparent)",
          "--sidebar-bg-top": "#0b1a12",
          "--sidebar-bg-bottom": "#07140e",
          "--sidebar-glow-1": "color-mix(in srgb, var(--agri-500) 18%, transparent)",
          "--sidebar-glow-2": "color-mix(in srgb, var(--agri-600) 16%, transparent)",
        },
      }}
    />
  );
}
