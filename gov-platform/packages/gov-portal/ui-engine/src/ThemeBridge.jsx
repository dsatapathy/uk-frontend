// ThemeBridge.jsx
import * as React from "react";
import { GlobalStyles, useTheme } from "@mui/material";
import { alpha, lighten, darken } from "@mui/material/styles";

export default function ThemeBridge() {
  const t = useTheme();
  const p = t.palette;

  // base paper used to derive subtle surfaces
  const paper    = p.background.paper;
  const surface2 = p.mode === "light" ? lighten(paper, 0.02) : darken(paper, 0.06);
  const surface3 = p.mode === "light" ? lighten(paper, 0.04) : darken(paper, 0.10);

  // if you keep MUI primary in sync (see createTheme below), focus rings match
  const focus = alpha(p.primary.main, p.mode === "light" ? 0.35 : 0.45);

  const radius = typeof t.shape.borderRadius === "number"
    ? `${t.shape.borderRadius}px`
    : String(t.shape.borderRadius || "8px");

  return (
    <GlobalStyles
      styles={{
        html: { colorScheme: p.mode }, // native controls adapt to light/dark
        ":root": {
          /* ---------------- Agri (Green) Scale ---------------- */
          "--agri-50":  "#ecfdf5",
          "--agri-100": "#d1fae5",
          "--agri-200": "#a7f3d0",
          "--agri-300": "#6ee7b7",
          "--agri-400": "#34d399",
          "--agri-500": "#10b981",
          "--agri-600": "#16a34a", /* brand agri green */
          "--agri-700": "#15803d",
          "--agri-800": "#166534",
          "--agri-900": "#14532d",

          /* Semantic surfaces & text (from MUI theme) */
          "--g-bg":        p.background.default,
          "--g-surface-1": paper,
          "--g-surface-2": surface2,
          "--g-surface-3": surface3,
          "--g-fg":        p.text.primary,
          "--g-fg-muted":  p.text.secondary,
          "--g-border":    p.divider,

          /* Brand / links — map to agri scale */
          "--g-primary":          "var(--agri-600)",
          "--g-primary-contrast": "#ffffff",
          "--g-secondary":        "var(--agri-700)",
          "--g-link":             "var(--agri-600)",
          "--g-focus-ring":       "color-mix(in srgb, var(--agri-600) 35%, transparent)",

          /* Functional (kept from MUI theme; you can remap if needed) */
          "--success-600": p.success.main,
          "--warning-600": p.warning.main,
          "--error-600":   p.error.main,
          "--info-600":    p.info.main,

          /* Shape */
          "--g-radius": radius,

          /* Defaults for login knobs (overridable via styleVars) */
          "--login-card-border": `1px solid ${p.divider}`,

          /* Green gradient for login background (light mode) */
          "--login-bg":     "linear-gradient(180deg, var(--agri-50), var(--agri-100))",
          "--login-overlay":"color-mix(in srgb, #ffffff 60%, transparent)",
        },

        /* Dark theme overrides (opt-in via data-theme or palette.mode) */
        '[data-theme="dark"]': {
          "--g-primary":          "var(--agri-500)",
          "--g-primary-contrast": "#0b0f19",
          "--g-secondary":        "var(--agri-400)",
          "--g-link":             "var(--agri-400)",
          "--g-focus-ring":       "color-mix(in srgb, var(--agri-400) 45%, transparent)",

          "--login-bg":           "linear-gradient(180deg, #0f1a14, #0b1510)",
          "--login-overlay":      "color-mix(in srgb, #0b1510 40%, transparent)",
        },
      }}
    />
  );
}
