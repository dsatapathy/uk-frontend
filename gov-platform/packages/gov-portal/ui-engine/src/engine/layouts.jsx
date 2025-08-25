// src/engine/layouts.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DRAWER_WIDTH, findAncestorsByPath } from "@gov/library";

import { runtime } from "@gov/core";

export function AuthBlank({ children }) {
  return <main>{children}</main>;
}

export function DefaultShell({ children }) {
  const history = useHistory();

  // get registered component once
  const NavLayout = React.useMemo(() => runtime.getComponent?.("NavLayout"), []);

  // HARD-CODED for now — memoize so refs are stable (no re-renders/loops)
  const logo = React.useMemo(
    () => <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1976d2" }} />,
    []
  );
  const user = React.useMemo(() => ({ name: "Jane Admin" }), []);
  const menu = React.useMemo(
    () => [
      { label: "Home", icon: "home", path: "/" },
      {
        label: "BPA",
        icon: "layers",
        path: "/bpa",
        children: [
          { label: "New Application", path: "/bpa/start" },
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

  const handleSearch = React.useCallback((q) => {
    console.log("Search query:", q);
    // TODO: hit your search endpoint or dispatch an action
  }, []);

  const handleNavigate = React.useCallback((target, item) => {
    if (item?.url && !item?.path) window.open(target, item.target || "_blank");
    else history.push(target);
  }, [history]);

  // simple fallback if NavLayout isn’t registered yet
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
    >
      {children}
    </NavLayout>
  );
}

// Auto layout that reacts to Redux auth and swaps shells live
export function AutoShell({ children }) {
  const isAuthed = useSelector((s) => s?.auth?.status === "authenticated");
  const Layout = isAuthed ? DefaultShell : AuthBlank;
  console.log("Resolving layout component:", Layout)

  return <Layout>{children}</Layout>;
}

export function resolveShell(layoutComponent) {
  if (!layoutComponent) return AutoShell;
  if (typeof layoutComponent === "string") {
    return runtime.getLayout?.(layoutComponent) || AutoShell;
  }
  return layoutComponent;
}

export function registerShellAsLayout(Shell) {
  // Register to BOTH registries so RouteBuilder (local) can resolve it.
  runtime.registerLayout?.("Shell", Shell);
  runtime.registerLayout?.("AuthBlank", AuthBlank);
  runtime.registerLayout?.("AutoShell", AutoShell);
}

export function resolveRouteLayouts(routes, fallbackLayout) {
  return routes.map((r) => {
    const resolved =
      typeof r.layout === "string"
        ? (runtime.getLayout?.(r.layout) || fallbackLayout)
        : (r.layout || fallbackLayout);
    return { ...r, layout: resolved };
  });
}
