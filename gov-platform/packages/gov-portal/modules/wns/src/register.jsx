import React from "react";
import { registerComponent, registerAction } from "@gov/core";

// tiny helper to keep per-widget code-splitting
const lazyWrap = (loader, name = "Water & Sewerage") => {
  const C = React.lazy(loader);
  return (props) => (
    <React.Suspense fallback={<div>Loading {name}…</div>}>
      <C {...props} />
    </React.Suspense>
  );
};

export function register(app) {
  // lazy widgets (do NOT import them at top-level)
  registerComponent("WnsHome", lazyWrap(() => import("./widgets/WnsHome.jsx"), "Water & Sewerage"));

  // actions
  registerAction("wns.goto", () => app.history.push("/ws"));

  // initial route
  app.addRoutes([
    { path: "/ws", exact: true, layout: "Shell", page: { type: "WnsHome" } }
  ]);
}
