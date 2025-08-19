// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { loadBpaCard, loadBpaStart } from "./widgets";
import "@gov/styles/modules/bpa/index.scss";
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
  registerComponent("BpaCard",  lazyWrap(loadBpaCard, "BPA Card"));
  registerComponent("BpaStart", lazyWrap(loadBpaStart, "BPA Start"));

  // Actions
  registerAction("bpa.start", () => app.history.push("/bpa/start"));
  registerAction("bpa.back",  () => app.history.push("/bpa"));
  registerAction("bpa.next",  () => alert("TODO: route to the next BPA step"));

  // Routes (unchanged)
  app.addRoutes([
    { path: "/bpa",        exact: true, layout: "Shell", page: { type: "BpaCard" } },
    { path: "/bpa/start", exact: true, layout: "Shell", page: { type: "BpaStart" } }
  ]);
}
