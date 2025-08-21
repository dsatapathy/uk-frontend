// ThemeBridge.jsx
import * as React from "react";
import { GlobalStyles, useTheme } from "@mui/material";
import { alpha, lighten, darken } from "@mui/material/styles";

export default function ThemeBridge() {
  const t = useTheme();
  const p = t.palette;

  const paper = p.background.paper;
  const surface2 = p.mode === "light" ? lighten(paper, 0.02) : darken(paper, 0.06);
  const surface3 = p.mode === "light" ? lighten(paper, 0.04) : darken(paper, 0.10);
  const focus    = alpha(p.primary.main, p.mode === "light" ? 0.35 : 0.45);
  const radius   = typeof t.shape.borderRadius === "number"
    ? `${t.shape.borderRadius}px`
    : String(t.shape.borderRadius || "8px");

  return (
    <GlobalStyles
      styles={{
        html: { colorScheme: p.mode }, // native controls adapt
        ":root": {
          /* Semantic surfaces & text */
          "--g-bg":            p.background.default,
          "--g-surface-1":     paper,
          "--g-surface-2":     surface2,
          "--g-surface-3":     surface3,
          "--g-fg":            p.text.primary,
          "--g-fg-muted":      p.text.secondary,
          "--g-border":        p.divider,

          /* Brand / links */
          "--g-primary":            p.primary.main,
          "--g-primary-contrast":   p.getContrastText?.(p.primary.main) ?? "#fff",
          "--g-secondary":          p.secondary.main,
          "--g-link":               p.primary.main,
          "--g-focus-ring":         focus,

          /* Functional */
          "--success-600": p.success.main,
          "--warning-600": p.warning.main,
          "--error-600":   p.error.main,
          "--info-600":    p.info.main,

          /* Shape */
          "--g-radius": radius,

          /* Defaults for login knobs (still overridable via styleVars) */
          "--login-card-border": `1px solid ${p.divider}`,
        },
      }}
    />
  );
}
