// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadAcknowledgePage
} from "./screens";


export function register(app) {
  registerComponent("AcknowledgePage", LazyWrap(loadAcknowledgePage, "Acknowledge Page"));
  app.addRoutes([
    // default member landing (kept)
    { path: "/common", exact: true, layout: "Shell", page: { type: "AcknowledgePage" } },
    { path: "/common/acknowledgement_page", exact: true, layout: "Shell", page: { type: "AcknowledgePage" } },
  ]);
}
