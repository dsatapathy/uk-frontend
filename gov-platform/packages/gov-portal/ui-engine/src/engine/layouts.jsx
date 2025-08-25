// src/engine/layouts.jsx
import React from "react";
import { useSelector } from "react-redux";
import { runtime } from "@gov/core";

export function AuthBlank({ children }) {
  return <main>{children}</main>;
}

export function DefaultShell({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateRows: "64px 1fr", height: "100vh" }}>
      <header style={{ borderBottom: "1px solid #eee", padding: 12 }}>Header</header>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr" }}>
        <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
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
