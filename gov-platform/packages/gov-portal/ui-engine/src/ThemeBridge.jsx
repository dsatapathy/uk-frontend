// ThemeBridge.jsx
import * as React from "react";
import { GlobalStyles, useTheme } from "@mui/material";
import { alpha, lighten, darken } from "@mui/material/styles";

/**
 * ThemeBridge
 * ----------
 * Purpose: Project MUI theme values -> CSS Custom Properties (design tokens)
 * so that both MUI and non-MUI code can style against a shared, stable token set.
 *
 * HOW TO CONSUME (global):
 *  - Text color:          var(--g-fg)
 *  - Muted text color:    var(--g-fg-muted)
 *  - Page background:     var(--g-bg)
 *  - Card/surface:        var(--g-surface-1/2/3)
 *  - Borders/dividers:    var(--g-border)
 *  - Primary color:       var(--g-primary)
 *  - Focus ring:          var(--g-focus-ring)
 *  - Border radius:       var(--g-radius)
 *
 * HOW TO CONSUME (component scopes):
 *  - TopBar background:   var(--topbar-bg) or var(--topbar-gradient)
 *  - TopBar text:         var(--topbar-fg)
 *  - Sidebar background:  gradient from --sidebar-bg-top/mid/bottom
 *  - Sidebar text:        var(--sidebar-fg), var(--sidebar-fg-dim)
 *  - Sidebar states:      --sidebar-hover-bg, --sidebar-active-bg, --sidebar-active-bd
 */

export default function ThemeBridge() {
  const t = useTheme();
  const p = t.palette;

  // Derived/soft surfaces from theme paper
  const paper = p.background.paper;
  const surface2 = p.mode === "light" ? lighten(paper, 0.02) : darken(paper, 0.06);
  const surface3 = p.mode === "light" ? lighten(paper, 0.04) : darken(paper, 0.10);

  // Palette-aware focus ring (accessible, mode-tuned)
  const focus = alpha(p.primary.main, p.mode === "light" ? 0.35 : 0.45);

  // Radius, expose both px string and numeric (for calc() needs)
  const rNum =
    typeof t.shape.borderRadius === "number" ? t.shape.borderRadius : 8;
  const rPx = `${rNum}px`;

  return (
    <GlobalStyles
      styles={{
        // Helps form controls pick the right native styling in supported browsers
        html: { colorScheme: p.mode },
        body: { colorScheme: p.mode },

        /**
         * :root — Global TOKENS
         * These are app-wide variables you should prefer throughout the app.
         */
        ":root": {
          /* ---------------- BRAND SCALE (Agri/Green) — reference-only ----------------
           * Use --g-primary et al for semantics; keep this as a brand ramp.
           */
          "--agri-50": "#ecfdf5",
          "--agri-100": "#d1fae5",
          "--agri-200": "#a7f3d0",
          "--agri-300": "#6ee7b7",
          "--agri-400": "#34d399",
          "--agri-500": "#10b981",
          "--agri-600": "#16a34a", // brand primary (default light mode)
          "--agri-700": "#15803d",
          "--agri-800": "#166534",
          "--agri-900": "#14532d",

          /* ---------------- GLOBAL SEMANTIC TOKENS (use these!) ---------------- */
          // Backgrounds & Surfaces
          "--g-bg": p.background.default,   // page background
          "--g-surface-1": paper,           // cards
          "--g-surface-2": surface2,        // elevated/soft surfaces
          "--g-surface-3": surface3,

          // Text & Borders
          "--g-fg": p.text.primary,         // primary text
          "--g-fg-muted": p.text.secondary, // secondary text
          "--g-border": p.divider,          // dividers, card borders

          // Brand + Links (semantic, backed by brand ramp)
          "--g-primary": "var(--agri-600)",
          "--g-primary-contrast": "#ffffff",
          "--g-secondary": "var(--agri-700)",
          "--g-link": "var(--agri-600)",    // link color

          // Accessibility
          "--g-focus-ring": focus,          // use for :focus-visible outlines

          // Functional states (from MUI theme)
          "--success-600": p.success.main,
          "--warning-600": p.warning.main,
          "--error-600": p.error.main,
          "--info-600": p.info.main,

          // Shape
          "--g-radius": rPx,
          "--g-radius-num": rNum,

          /* ---------------- LOGIN VIEW DEFAULTS (optional, override via styleVars) ---------------- */
          "--login-card-border": `1px solid ${p.divider}`,
          // Fallback then modern (older browsers will ignore color-mix)
          "--login-bg": "linear-gradient(180deg, #f2fbf7, #e7f7ef)",
          "--login-bg": "linear-gradient(180deg, var(--agri-50), var(--agri-100))",
          "--login-overlay": "rgba(255,255,255,0.6)",
          "--login-overlay": "color-mix(in srgb, #ffffff 60%, transparent)",

          /* ---------------- TOPBAR TOKENS (component scope) ---------------- */
          "--topbar-fg": "var(--g-fg)",
          "--topbar-border": "var(--g-border)",
          // Provide a solid fallback and a gradient option
          "--topbar-bg": "var(--g-surface-1)",
          "--topbar-gradient": `
            /* subtle angled sheen */
            linear-gradient(
              135deg,
              color-mix(in srgb, var(--agri-100) 65%, transparent) 0%,
              transparent 35%
            ),
            /* gentle vertical wash */
            linear-gradient(
              180deg,
              var(--agri-50) 0%,
              color-mix(in srgb, var(--agri-100) 75%, var(--agri-50)) 60%,
              var(--agri-100) 100%
            )
          `,

          /* ---------------- SIDEBAR TOKENS (component scope) ---------------- */
          // Text & icons in the dark sidebar
          "--sidebar-fg": "#EAF0F7",
          "--sidebar-fg-dim": "rgba(234,240,247,0.72)",
          "--sidebar-icon": "var(--sidebar-fg-dim)",

          // Lines / outlines inside the sidebar
          "--sidebar-line": "rgba(20,83,45,0.55)", // fallback
          "--sidebar-line": "color-mix(in srgb, var(--agri-900) 55%, transparent)",

          // Focus outline color inside sidebar
          "--sidebar-focus": "var(--g-primary)",

          // Item states
          "--sidebar-hover-bg": "rgba(255,255,255,0.06)",
          "--sidebar-active-bg": "rgba(120,180,255,0.14)",
          "--sidebar-active-bd": "rgba(120,180,255,0.28)",
          "--sidebar-accent": "rgba(120,180,255,1)",
          "--sidebar-label-active": "#DCE9FF",

          // Gradient base (vertical) for sidebar background
          "--sidebar-bg-top": "#0b1a12",
          "--sidebar-bg-mid": "#0a2015",
          "--sidebar-bg-bottom": "#07140e",

          // Accent glows & sheens (visual polish)
          "--sidebar-glow-1": "rgba(22,163,74,0.18)",  // fallback
          "--sidebar-glow-1": "color-mix(in srgb, var(--agri-600) 18%, transparent)",
          "--sidebar-glow-2": "rgba(16,185,129,0.14)", // fallback
          "--sidebar-glow-2": "color-mix(in srgb, var(--agri-500) 14%, transparent)",
          "--sidebar-sheen-1": "rgba(21,128,61,0.12)", // fallback
          "--sidebar-sheen-1": "color-mix(in srgb, var(--agri-700) 12%, transparent)",
          "--sidebar-sheen-2": "rgba(16,185,129,0.10)", // fallback
          "--sidebar-sheen-2": "color-mix(in srgb, var(--agri-500) 10%, transparent)",

          // Scrollbar/foot subtle effects
          "--sidebar-scroll": "rgba(255,255,255,0.25)", // fallback
          "--sidebar-scroll": "color-mix(in srgb, var(--g-fg) 25%, transparent)",
          "--sidebar-foot-glow": "rgba(255,255,255,0.03)", // fallback
          "--sidebar-foot-glow": "color-mix(in srgb, var(--g-fg) 3%, transparent)",
        },

        /**
         * DARK MODE OVERRIDES
         * Apply when your app toggles [data-theme="dark"] OR when using MUI CssVarsProvider
         * which sets [data-mui-color-scheme="dark"].
         */
        '[data-theme="dark"], [data-mui-color-scheme="dark"]': {
          // Semantic flips
          "--g-primary": "var(--agri-500)",
          "--g-primary-contrast": "#0b0f19",
          "--g-secondary": "var(--agri-400)",
          "--g-link": "var(--agri-400)",
          "--g-focus-ring": focus,

          // Login backdrop in dark
          "--login-bg": "linear-gradient(180deg, #0f1a14, #0b1510)",
          "--login-overlay": "rgba(11,21,16,0.40)",
          "--login-overlay": "color-mix(in srgb, #0b1510 40%, transparent)",

          // TopBar in dark — give a subtle wash (you can pick bg or gradient)
          "--topbar-fg": "var(--g-fg)",
          "--topbar-border": "var(--g-border)",
          "--topbar-bg": "var(--g-surface-1)",
          "--topbar-gradient": `
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--agri-900) 30%, #0b1510) 0%,
              color-mix(in srgb, var(--agri-900) 20%, #0b1510) 100%
            )
          `,

          // Sidebar darker depths and accents in dark
          "--sidebar-line": "rgba(20,83,45,0.65)",
          "--sidebar-bg-top": "#0b1a12",
          "--sidebar-bg-mid": "#0a2015",
          "--sidebar-bg-bottom": "#07140e",
          "--sidebar-glow-1": "rgba(16,185,129,0.18)",
          "--sidebar-glow-1":
            "color-mix(in srgb, var(--agri-500) 18%, transparent)",
          "--sidebar-glow-2": "rgba(22,163,74,0.16)",
          "--sidebar-glow-2":
            "color-mix(in srgb, var(--agri-600) 16%, transparent)",
        },
      }}
    />
  );
}
