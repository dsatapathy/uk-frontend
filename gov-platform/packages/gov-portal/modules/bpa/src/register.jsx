// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { loadBpaCard, loadBpaStart } from "./widgets";
import "@gov/styles/modules/bpa/index.scss";
import { loadBpaApply, loadStepperTestPage } from "./screens";


export function register(app) {
  // Register *loaders*, not components.
  registerComponent("BpaApplyPage",  LazyWrap(loadBpaApply, "Bpa Apply Page"));
  registerComponent("BpaCard",  LazyWrap(loadBpaCard, "BPA Card"));
  registerComponent("BpaStart", LazyWrap(loadBpaStart, "BPA Start"));
  registerComponent("StepperTestPage", LazyWrap(loadStepperTestPage, "Stepper Test Page"));

  // Actions
  registerAction("bpa.start", () => app.history.push("/bpa/start"));
  registerAction("bpa.apply", () => app.history.push("/bpa/apply"));
  registerAction("bpa.stepper", () => app.history.push("/bpa/stepper"));
  registerAction("bpa.back",  () => app.history.push("/bpa"));
  registerAction("bpa.next",  () => alert("TODO: route to the next BPA step"));

  // Routes (unchanged)
  app.addRoutes([
    { path: "/bpa",        exact: true, layout: "Shell", page: { type: "BpaCard" } },
    { path: "/bpa/start", exact: true, layout: "Shell", page: { type: "BpaStart" } },
    { path: "/bpa/apply", exact: true, layout: "Shell", page: { type: "BpaApplyPage" } },
    { path: "/bpa/stepper", exact: true, layout: "Shell", page: { type: "StepperTestPage" } }
  ]);
}
