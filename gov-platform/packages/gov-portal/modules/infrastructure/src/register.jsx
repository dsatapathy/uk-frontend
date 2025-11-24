// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadInfrastructureLandingPage,
  loadCollectionCenter
} from "./screens";


export function register(app) {
  registerComponent("InfrastructureLanding", LazyWrap(loadInfrastructureLandingPage, "Infrastructure Landing"));
  registerComponent("DefaultLandingPageInfrastructure", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("CollectionCenter", LazyWrap(loadCollectionCenter, "Collection Center"));

  app.addRoutes([
    // default member landing (kept)
    { path: "/infrastructure", exact: true, layout: "Shell", page: { type: "InfrastructureLanding" } },
    { path: "/infrastructure/infrastructure_report_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageInfrastructure" } },
    { path: "/infrastructure/collection_center", exact: true, layout: "Shell", page: { type: "CollectionCenter" } },
  ]);
}


