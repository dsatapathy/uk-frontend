// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";
import { loadMemberList, loadNewMember, loadUpdateMember } from "./screens";

export function register(app) {
  // Register *loaders*, not components.
  registerComponent("NewMember",  LazyWrap(loadNewMember, "New Member"));
  registerComponent("UpdateMember",  LazyWrap(loadUpdateMember, "Update Member"));
  registerComponent("MemberList",  LazyWrap(loadMemberList, "Member List"));

  // Actions
  registerAction("member.start", () => app.history.push("/member/start"));
  registerAction("member.update", () => app.history.push("/member/update"));
  registerAction("member.list", () => app.history.push("/member/list"));
  

  // Routes (unchanged)
  app.addRoutes([
    { path: "/member",        exact: true, layout: "Shell", page: { type: "NewMember" } },
    { path: "/member/start", exact: true, layout: "Shell", page: { type: "NewMember" } },
    { path: "/member/update", exact: true, layout: "Shell", page: { type: "UpdateMember" } },
    { path: "/member/list", exact: true, layout: "Shell", page: { type: "MemberList" } },
  ]);
}
