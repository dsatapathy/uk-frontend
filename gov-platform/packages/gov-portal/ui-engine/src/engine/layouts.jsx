// layouts.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { runtime } from "@gov/core";

// ⬇️ import the hook (adjust path alias if needed)
import { useMenu } from "@gov/data";

export function AuthBlank({ children }) {
  return <main>{children}</main>;
}

export function DefaultShell({ children }) {
  const history = useHistory();
  const NavLayout = React.useMemo(() => runtime.getComponent?.("NavLayout"), []);

  const logo = React.useMemo(
    () => <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1976d2" }} />,
    []
  );
  const user = React.useMemo(() => ({ name: "Jane Admin" }), []);

  // 👉 lightweight fallback (shown while fetching / on error)
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

  // 🔑 load the 150-item, role-aware menu
  // enabled can be tied to auth state; for now it always runs (adjust if needed)
  const {
    data: fetchedMenu = [],
    isLoading: menuLoading,
    isError: menuError,
  } = useMenu({ count: 150, enabled: true });

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
      menu={menu}
      user={user}
      logo={logo}
      title="UGVS-REAP : MIS"
      onSearch={handleSearch}
      onNavigate={handleNavigate}
      // You can also pass menuLoading to NavLayout if it supports a skeleton
    >
      {children}
    </NavLayout>
  );
}

// Auto layout that reacts to Redux auth and swaps shells live
export function AutoShell({ children }) {
  const isAuthed = useSelector((s) => s?.auth?.status === "authenticated");
  const Layout = isAuthed ? DefaultShell : AuthBlank;
  return <Layout>{children}</Layout>;
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

export function resolveShell(layout, authCfg) {
  ensureBuiltinsRegistered();

  const lc = typeof layout === "string" ? { component: layout } : (layout || {});
  const comp = lc.component;
  const forceBlank = !!lc.forceAuthBlank;
  const authEnabled = authCfg && authCfg.strategy && authCfg.strategy !== "none";

  if (forceBlank) return AuthBlank;
  if (authEnabled && (!comp || comp === "AuthBlank")) return AutoShell;

  if (!comp) return AutoShell;
  if (typeof comp === "string") {
    if (comp === "AuthBlank") return AuthBlank;
    if (comp === "AutoShell" || comp === "Shell") return AutoShell;
    return runtime.getLayout?.(comp) || AutoShell;
  }
  return comp;
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
