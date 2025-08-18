// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { loadTlCard, loadTlStart } from "./widgets";
// small helper: wrap React.lazy with Suspense once
const lazyWrap = (loader, name = "Loading") => {
  const Lazy = React.lazy(loader);
  return function Wrapped(props) {
    return (
      <React.Suspense fallback={<div>{name}…</div>}>
        <Lazy {...props} />
      </React.Suspense>
    );
  };
};

export function register(app) {
  // Register *loaders*, not components.
  registerComponent("TlCard",  lazyWrap(loadTlCard, "TL Card"));
  registerComponent("TlStart", lazyWrap(loadTlStart, "TL Start"));

  // Actions
  registerAction("tl.start", () => app.history.push("/tl/start"));
  registerAction("tl.back",  () => app.history.push("/tl"));
  registerAction("tl.next",  () => alert("TODO: route to the next TL step"));

  // Routes (unchanged)
  app.addRoutes([
    { path: "/tl",        exact: true, layout: "Shell", page: { type: "TlCard" } },
    { path: "/tl/start", exact: true, layout: "Shell", page: { type: "TlStart" } }
  ]);
}
