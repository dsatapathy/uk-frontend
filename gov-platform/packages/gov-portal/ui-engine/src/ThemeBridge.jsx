// ThemeBridge.jsx
import * as React from "react";
import { GlobalStyles, useTheme } from "@mui/material";
import { alpha, lighten, darken } from "@mui/material/styles";
import { useAppConfig } from "./engine/app-config-context";
import { DEFAULT_THEME } from "./constants";

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const normalizeBrandKey = (key) => {
  if (key == null) return null;
  const str = String(key);
  if (str.startsWith("--agri-")) return str;
  if (str.startsWith("--")) return str;
  if (str.startsWith("agri-")) return `--${str}`;
  return `--agri-${str}`;
};

const applyScaleOverrides = (target, overrides) => {
  if (!isObject(overrides)) return;
  Object.entries(overrides).forEach(([key, value]) => {
    if (value == null) return;
    const normalized = normalizeBrandKey(key);
    if (normalized) target[normalized] = value;
  });
};

const assignVars = (bucket, candidate) => {
  if (!isObject(candidate)) return;
  Object.assign(bucket, candidate);
};

const collectCustomVars = (themeCfg) => {
  const root = {};
  const dark = {};

  assignVars(root, themeCfg?.vars);
  assignVars(root, themeCfg?.tokens);

  const cssVars = themeCfg?.cssVars;
  if (isObject(cssVars)) {
    const hasModes = isObject(cssVars.root) || isObject(cssVars.dark);
    if (hasModes) {
      assignVars(root, cssVars.root);
      assignVars(dark, cssVars.dark);
    } else {
      assignVars(root, cssVars);
    }
  }

  assignVars(root, themeCfg?.varsLight);
  assignVars(dark, themeCfg?.varsDark);
  assignVars(dark, themeCfg?.darkVars);
  assignVars(dark, themeCfg?.tokensDark);
  assignVars(dark, themeCfg?.cssVarsDark);

  return { root, dark };
};

const lightenSafe = (color, amount, fallback) => {
  const base = color || fallback;
  if (!base) return fallback;
  try {
    return lighten(base, amount);
  } catch (err) {
    return fallback ?? base;
  }
};

const darkenSafe = (color, amount, fallback) => {
  const base = color || fallback;
  if (!base) return fallback;
  try {
    return darken(base, amount);
  } catch (err) {
    return fallback ?? base;
  }
};

const alphaSafe = (color, amount, fallback) => {
  const base = color || fallback;
  if (!base) return fallback;
  try {
    return alpha(base, amount);
  } catch (err) {
    return fallback ?? base;
  }
};

export default function ThemeBridge() {
  const cfg = useAppConfig();
  const themeCfg = isObject(cfg?.theme) ? cfg.theme : {};

  const t = useTheme();
  const p = t.palette;

  const fallbackPrimary = DEFAULT_THEME.palette.primary.main;
  const fallbackSecondary = DEFAULT_THEME.palette.secondary.main;

  const primaryMain =
    themeCfg?.palette?.primary?.main ?? p?.primary?.main ?? fallbackPrimary;
  const secondaryMain =
    themeCfg?.palette?.secondary?.main ??
    p?.secondary?.main ??
    themeCfg?.palette?.primary?.dark ??
    p?.primary?.dark ??
    fallbackSecondary;

  const safePrimary = primaryMain || fallbackPrimary;
  const safeSecondary = secondaryMain || safePrimary;

  const getContrastText = typeof p?.getContrastText === "function" ? p.getContrastText : null;
  const primaryContrast =
    themeCfg?.palette?.primary?.contrastText ??
    p?.primary?.contrastText ??
    (getContrastText ? getContrastText(safePrimary) : "#ffffff");

  const focusFallback = alpha(fallbackPrimary, p.mode === "light" ? 0.35 : 0.45);
  const focus = alphaSafe(safePrimary, p.mode === "light" ? 0.35 : 0.45, focusFallback);

  const brandScale = {
    "--agri-50": "#ecfdf5",
    "--agri-100": "#d1fae5",
    "--agri-200": "#a7f3d0",
    "--agri-300": "#6ee7b7",
    "--agri-400": "#34d399",
    "--agri-500": "#10b981",
    "--agri-600": "#16a34a",
    "--agri-700": "#15803d",
    "--agri-800": "#166534",
    "--agri-900": "#14532d",
  };

  brandScale["--agri-600"] = safePrimary;
  brandScale["--agri-500"] = lightenSafe(safePrimary, 0.18, brandScale["--agri-500"]);
  brandScale["--agri-400"] = lightenSafe(safePrimary, 0.32, brandScale["--agri-400"]);
  brandScale["--agri-300"] = lightenSafe(safePrimary, 0.48, brandScale["--agri-300"]);
  brandScale["--agri-200"] = lightenSafe(safePrimary, 0.68, brandScale["--agri-200"]);
  brandScale["--agri-100"] = lightenSafe(safePrimary, 0.82, brandScale["--agri-100"]);
  brandScale["--agri-50"] = lightenSafe(safePrimary, 0.92, brandScale["--agri-50"]);

  const darkBaseColor = safeSecondary || darkenSafe(safePrimary, 0.14, brandScale["--agri-700"]);
  brandScale["--agri-700"] = safeSecondary || brandScale["--agri-700"];
  brandScale["--agri-800"] = darkenSafe(darkBaseColor, 0.16, brandScale["--agri-800"]);
  brandScale["--agri-900"] = darkenSafe(darkBaseColor, 0.3, brandScale["--agri-900"]);

  applyScaleOverrides(brandScale, themeCfg?.brandScale);
  applyScaleOverrides(brandScale, themeCfg?.palette?.brandScale);

  const linkColor =
    themeCfg?.links?.default ?? themeCfg?.linkColor ?? brandScale["--agri-600"];
  const linkColorDark =
    themeCfg?.links?.dark ?? themeCfg?.linkColorDark ?? brandScale["--agri-400"];

  const loginBgLight =
    themeCfg?.login?.background ??
    `linear-gradient(180deg, ${brandScale["--agri-50"]}, ${brandScale["--agri-100"]})`;
  const loginOverlayLight = themeCfg?.login?.overlay ?? "rgba(255,255,255,0.6)";

  const loginBgDark =
    themeCfg?.login?.backgroundDark ??
    `linear-gradient(180deg, ${darkenSafe(brandScale["--agri-900"], 0.05, "#0f1a14")}, ${darkenSafe(brandScale["--agri-900"], 0.15, "#0b1510")})`;
  const loginOverlayDark = themeCfg?.login?.overlayDark ?? "rgba(11,21,16,0.40)";

  const sidebarLine = alphaSafe(brandScale["--agri-900"], 0.55, "rgba(20,83,45,0.55)");
  const sidebarLineDark = alphaSafe(brandScale["--agri-900"], 0.65, "rgba(20,83,45,0.65)");
  const sidebarGlow1 = alphaSafe(brandScale["--agri-600"], 0.18, "rgba(22,163,74,0.18)");
  const sidebarGlow2 = alphaSafe(brandScale["--agri-500"], 0.14, "rgba(16,185,129,0.14)");
  const sidebarSheen1 = alphaSafe(brandScale["--agri-700"], 0.12, "rgba(21,128,61,0.12)");
  const sidebarSheen2 = alphaSafe(brandScale["--agri-500"], 0.10, "rgba(16,185,129,0.10)");
  const sidebarScroll = alphaSafe(p.text.primary, 0.25, "rgba(255,255,255,0.25)");
  const sidebarFootGlow = alphaSafe(p.text.primary, 0.03, "rgba(255,255,255,0.03)");

  const sidebarBgTop =
    themeCfg?.sidebar?.bgTop ?? darkenSafe(darkBaseColor, 0.36, "#0b1a12");
  const sidebarBgMid =
    themeCfg?.sidebar?.bgMid ?? darkenSafe(darkBaseColor, 0.42, "#0a2015");
  const sidebarBgBottom =
    themeCfg?.sidebar?.bgBottom ?? darkenSafe(darkBaseColor, 0.52, "#07140e");

  // Derived/soft surfaces from theme paper
  const paper = p.background.paper;
  const surface2 = p.mode === "light" ? lighten(paper, 0.02) : darken(paper, 0.06);
  const surface3 = p.mode === "light" ? lighten(paper, 0.04) : darken(paper, 0.10);

  // Radius, expose both px string and numeric (for calc() needs)
  const rNum = typeof t.shape.borderRadius === "number" ? t.shape.borderRadius : 8;
  const rPx = `${rNum}px`;

  // Feature detection (SSR-safe)
  const canCSS = typeof CSS !== "undefined" && typeof CSS.supports === "function";
  const supportsColorMix =
    canCSS && CSS.supports("color", "color-mix(in srgb, #000 50%, transparent)");
  const supportsVarGradient =
    canCSS &&
    CSS.supports(
      "background-image",
      "linear-gradient(180deg, var(--agri-50), var(--agri-100))"
    );

  const { root: customRootVars, dark: customDarkVars } = collectCustomVars(themeCfg);

  const defaultAttentionGradient = "linear-gradient(to right, #239460 0%, #6fc926 100%)";
  const attentionGradient =
    themeCfg?.gradients?.attention ??
    themeCfg?.attention?.gradient ??
    defaultAttentionGradient;

  // ---- Build variable maps (no duplicate keys) ----
  const rootVars = {
    /* ---------------- BRAND SCALE (Agri/Green) – reference-only ---------------- */
    ...brandScale,

    /* ---------------- GLOBAL SEMANTIC TOKENS ---------------- */
    "--g-bg": p.background.default,   // page background
    "--g-surface-1": paper,           // cards
    "--g-surface-2": surface2,        // elevated/soft surfaces
    "--g-surface-3": surface3,

    "--g-fg": p.text.primary,         // primary text
    "--g-fg-muted": "#000", // secondary text
    "--g-border": p.divider,          // dividers, card borders

    "--g-primary": brandScale["--agri-600"],
    "--g-primary-contrast": primaryContrast,
    "--g-secondary": brandScale["--agri-700"],
    "--attention-gradient": attentionGradient,
    "--g-link": linkColor,

    "--g-focus-ring": focus,          // :focus-visible outlines

    "--success-600": p.success?.main ?? brandScale["--agri-600"],
    "--warning-600": p.warning?.main ?? "#f59e0b",
    "--error-600": p.error?.main ?? "#ef4444",
    "--info-600": p.info?.main ?? "#0ea5e9",

    "--g-radius": rPx,
    "--g-radius-num": rNum,

    /* ---------------- LOGIN VIEW DEFAULTS ---------------- */
    "--login-card-border": `1px solid ${p.divider}`,
    "--login-bg": loginBgLight,
    "--login-overlay": loginOverlayLight,

    /* ---------------- TOPBAR TOKENS ---------------- */
    "--topbar-fg": "var(--g-fg)",
    "--topbar-border": "var(--g-border)",
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

    /* ---------------- SIDEBAR TOKENS ---------------- */
    "--sidebar-fg": "#EAF0F7",
    "--sidebar-fg-dim": "rgba(234,240,247,0.72)",
    "--sidebar-icon": "var(--sidebar-fg-dim)",

    // Lines / outlines inside the sidebar (fallbacks)
    "--sidebar-line": sidebarLine,

    "--sidebar-focus": brandScale["--agri-600"],

    "--sidebar-hover-bg": "rgba(255,255,255,0.06)",
    "--sidebar-active-bg": "rgba(120,180,255,0.14)",
    "--sidebar-active-bd": "rgba(120,180,255,0.28)",
    "--sidebar-accent": themeCfg?.sidebar?.accent ?? "rgba(120,180,255,1)",
    "--sidebar-label-active": "#fff",

    "--sidebar-bg-top": sidebarBgTop,
    "--sidebar-bg-mid": sidebarBgMid,
    "--sidebar-bg-bottom": sidebarBgBottom,

    // Accent glows & sheens (fallbacks)
    "--sidebar-glow-1": sidebarGlow1,
    "--sidebar-glow-2": sidebarGlow2,
    "--sidebar-sheen-1": sidebarSheen1,
    "--sidebar-sheen-2": sidebarSheen2,

    // Scrollbar/foot (fallbacks)
    "--sidebar-scroll": sidebarScroll,
    "--sidebar-foot-glow": sidebarFootGlow,
  };

  // Modern overrides (applied only if supported)
  const rootModern = {
    ...(supportsVarGradient && {
      "--login-bg": "linear-gradient(180deg, var(--agri-50), var(--agri-100))",
    }),
    ...(supportsColorMix && {
      "--login-overlay": "color-mix(in srgb, #ffffff 60%, transparent)",
      "--sidebar-line": "color-mix(in srgb, var(--agri-900) 55%, transparent)",
      "--sidebar-glow-1": "color-mix(in srgb, var(--agri-600) 18%, transparent)",
      "--sidebar-glow-2": "color-mix(in srgb, var(--agri-500) 14%, transparent)",
      "--sidebar-sheen-1": "color-mix(in srgb, var(--agri-700) 12%, transparent)",
      "--sidebar-sheen-2": "color-mix(in srgb, var(--agri-500) 10%, transparent)",
      "--sidebar-scroll": "color-mix(in srgb, var(--g-fg) 25%, transparent)",
      "--sidebar-foot-glow": "color-mix(in srgb, var(--g-fg) 3%, transparent)",
    }),
  };

  const darkFocus = alphaSafe(brandScale["--agri-500"], 0.45, focus);

  // Dark-mode overrides
  const darkBase = {
    "--g-primary": brandScale["--agri-500"],
    "--g-primary-contrast":
      themeCfg?.modes?.dark?.primaryContrast ?? "#0b0f19",
    "--g-secondary": brandScale["--agri-400"],
    "--g-link": linkColorDark,
    "--g-focus-ring": darkFocus,

    "--login-bg": loginBgDark,
    "--login-overlay": loginOverlayDark,

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

    "--sidebar-line": sidebarLineDark,
    "--sidebar-bg-top": sidebarBgTop,
    "--sidebar-bg-mid": sidebarBgMid,
    "--sidebar-bg-bottom": sidebarBgBottom,

    // fallbacks
    "--sidebar-glow-1": alphaSafe(brandScale["--agri-500"], 0.18, "rgba(16,185,129,0.18)"),
    "--sidebar-glow-2": alphaSafe(brandScale["--agri-600"], 0.16, "rgba(22,163,74,0.16)"),
  };

  const darkModern = {
    ...(supportsColorMix && {
      "--login-overlay": "color-mix(in srgb, #0b1510 40%, transparent)",
      "--sidebar-glow-1": "color-mix(in srgb, var(--agri-500) 18%, transparent)",
      "--sidebar-glow-2": "color-mix(in srgb, var(--agri-600) 16%, transparent)",
    }),
  };

  return (
    <GlobalStyles
      styles={{
        html: { colorScheme: p.mode },
        body: { colorScheme: p.mode },

        ":root": { ...rootVars, ...rootModern, ...customRootVars },

        '[data-theme="dark"], [data-mui-color-scheme="dark"]': {
          ...darkBase,
          ...darkModern,
          ...customDarkVars,
        },
      }}
    />
  );
}
