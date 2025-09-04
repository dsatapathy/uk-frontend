// layouts.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { runtime } from "@gov/core";
import { useMenu } from "@gov/data";
import { Box } from "@mui/material";
// ---------- helpers ----------
function renderLogoFromBrand(brand) {
  if (!brand) return null;
  if (brand.logoNode) return brand.logoNode;

  if (brand.logo) {
    return (
      <Box
        component="img"
        src={brand.logo}
        alt={brand.title || brand.appName || "logo"}
        sx={{
          width: { xs: 120, sm: 160, md: 200 }, // responsive breakpoints
          height: "auto",
          borderRadius: 2,
          objectFit: "contain",
          mx: "auto", // center horizontally
        }}
      />
    );
  }

  return null;
}

// ---------- shells ----------
export function AuthBlank({ children }) {
  return <main>{children}</main>;
}

export function DefaultShell({ children, brand }) {
  const history = useHistory();
  const NavLayout = React.useMemo(() => runtime.getComponent?.("NavLayout"), []);

  // logo: prefer brand → fallback to colored square
  const fallbackLogo = React.useMemo(
    () => <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1976d2" }} />,
    []
  );
  const logo = React.useMemo(() => renderLogoFromBrand(brand) || fallbackLogo, [brand, fallbackLogo]);

  // title: prefer brand → fallback text
  const title = brand?.title || brand?.appName || "UGVS-REAP : MIS";

  const fallbackMenu = React.useMemo(
    () => [
      { label: "Home", icon: "home", path: "/" },
      {
        label: "BPA",
        icon: "layers",
        path: "/bpa",
        children: [
          { label: "New Application", path: "/bpa/apply" },
          { label: "My Applications", path: "/bpa/list" },
          {
            label: "Reports",
            icon: "report",
            children: [
              { label: "Daily", path: "/tl" },
              { label: "Monthly", path: "/bpa/reports/monthly" },
            ],
          },
        ],
      },
      { label: "Trade License", path: "/tl" },
      { label: "Water & Sewerage", path: "/ws" },
      { label: "Docs (external)", icon: "external", url: "https://example.com/docs" },
    ],
    []
  );

  const { tokens, user, hydrated } = useSelector((s) => s.auth || {});
  const accessToken = tokens?.accessToken;

  const {
    data: fetchedMenu = [],
    isLoading: menuLoading,
    isError: menuError,
  } = useMenu({
    count: 150,
    deps: { accessToken, hydrated, userId: user?.id },
    enabled: true,
  });

  const menu = React.useMemo(() => {
    if (menuLoading || menuError) return fallbackMenu;
    return Array.isArray(fetchedMenu) && fetchedMenu.length ? fetchedMenu : fallbackMenu;
  }, [fetchedMenu, menuLoading, menuError, fallbackMenu]);

  const handleSearch = React.useCallback((q) => {
    console.log("Search query:", q);
  }, []);

  const handleNavigate = React.useCallback(
    (target, item) => {
      if (item?.url && !item?.path) window.open(target, item.target || "_blank");
      else history.push(target);
    },
    [history]
  );

  if (!NavLayout) {
    return <div style={{ padding: 16 }}>{children}</div>;
  }

  return (
    <NavLayout
      brand={brand}          // ⬅️ pass through
      menu={menu}
      user={user}
      logo={logo}
      title={title}
      onSearch={handleSearch}
      onNavigate={handleNavigate}
    >
      {children}
    </NavLayout>
  );
}

// Auto layout that reacts to Redux auth and swaps shells live
export function AutoShell({ children, brand }) {
  const isAuthed = useSelector((s) => s?.auth?.status === "authenticated");
  const Layout = isAuthed ? DefaultShell : AuthBlank;
  return <Layout brand={brand}>{children}</Layout>;  // ⬅️ forward brand
}

// Ensure built-ins are registered once before any resolution
function ensureBuiltinsRegistered() {
  try {
    runtime.getLayout?.("AuthBlank");
  } catch {
    runtime.registerLayout?.("AuthBlank", AuthBlank);
    runtime.registerLayout?.("AutoShell", AutoShell);
  }
}

// Returns a component (not an element). We inject `brand` so callers don't forget.
export function resolveShell(layout, authCfg, brand) {
  ensureBuiltinsRegistered();

  const lc = typeof layout === "string" ? { component: layout } : (layout || {});
  const comp = lc.component;
  const forceBlank = !!lc.forceAuthBlank;
  const authEnabled = authCfg && authCfg.strategy && authCfg.strategy !== "none";

  let Resolved;
  if (forceBlank) Resolved = AuthBlank;
  else if (authEnabled && (!comp || comp === "AuthBlank")) Resolved = AutoShell;
  else if (!comp) Resolved = AutoShell;
  else if (typeof comp === "string") {
    if (comp === "AuthBlank") Resolved = AuthBlank;
    else if (comp === "AutoShell" || comp === "Shell") Resolved = AutoShell;
    else Resolved = runtime.getLayout?.(comp) || AutoShell;
  } else {
    Resolved = comp;
  }

  // Inject brand via a tiny wrapper so downstream doesn’t have to
  const WithBrand = (props) => <Resolved {...props} brand={brand} />;
  // Give React DevTools a friendly name
  Object.defineProperty(WithBrand, "name", { value: (Resolved.displayName || Resolved.name || "Shell") + "WithBrand" });

  return WithBrand;
}

export function registerShellAsLayout(Shell) {
  ensureBuiltinsRegistered();
  if (Shell) runtime.registerLayout?.("Shell", Shell);
}

export function resolveRouteLayouts(routes, fallbackLayout) {
  ensureBuiltinsRegistered();
  return routes.map((r) => {
    const resolved =
      typeof r.layout === "string"
        ? runtime.getLayout?.(r.layout) || fallbackLayout
        : r.layout || fallbackLayout;
    return { ...r, layout: resolved };
  });
}
