// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";
import { loadNewMember } from "./screens";

export function register(app) {
  // Register *loaders*, not components.
  registerComponent("NewMember",  LazyWrap(loadNewMember, "New Member"));

  // Actions
  registerAction("member.start", () => app.history.push("/member/start"));
  

  // Routes (unchanged)
  app.addRoutes([
    { path: "/member",        exact: true, layout: "Shell", page: { type: "NewMember" } },
    { path: "/member/start", exact: true, layout: "Shell", page: { type: "NewMember" } },
  ]);
}
