// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { loadBpaCard, loadBpaStart } from "./widgets";
import "@gov/styles/modules/bpa/index.scss";


export function register(app) {
  // Register *loaders*, not components.
  registerComponent("BpaCard",  LazyWrap(loadBpaCard, "BPA Card"));
  registerComponent("BpaStart", LazyWrap(loadBpaStart, "BPA Start"));

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
