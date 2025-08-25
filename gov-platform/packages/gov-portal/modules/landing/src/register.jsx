import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { loadLandingPage } from "./screens";

export function register(app) {
  registerComponent("LandingPage", LazyWrap(loadLandingPage, "Landing Page"));

  app.addRoutes([
    { path: "/landing", exact: true, layout: "Shell", page: { type: "LandingPage" } }
  ]);
}