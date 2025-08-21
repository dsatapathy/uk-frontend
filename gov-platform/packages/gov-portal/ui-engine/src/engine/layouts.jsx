// src/engine/layouts.jsx
import React from "react";
import { runtime } from "@gov/core";

export function DefaultShell({ children }) {
  return (
    <div >
      {/* <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside> */}
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

export function resolveShell(layoutComponent) {
  if (!layoutComponent) return DefaultShell;
  if (typeof layoutComponent === "string") {
    return runtime.getLayout?.(layoutComponent) || DefaultShell;
  }
  return layoutComponent;
}

export function registerShellAsLayout(Shell) {
  runtime.registerLayout?.("Shell", Shell);
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
