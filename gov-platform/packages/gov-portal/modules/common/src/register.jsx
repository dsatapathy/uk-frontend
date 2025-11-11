// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadAcknowledgePage,
  loadCommonHome,
  loadUserDataModuleSearch,
} from "./screens";


export function register(app) {
  const getBasePath = () => {
    const defaultsList = app?.config?.modules?.defaults?.list;
    const match =
      Array.isArray(defaultsList) && defaultsList.find((m) => m.key === "common");
    const raw = match?.basePath || "/common";
    const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
    if (withLeading.length > 1 && withLeading.endsWith("/")) {
      return withLeading.replace(/\/+$/, "");
    }
    return withLeading || "/";
  };

  const basePath = getBasePath();
  const buildPath = (suffix = "") => {
    if (!suffix) return basePath;
    const trimmed = suffix.replace(/^\/+/, "");
    if (!trimmed) return basePath;
    if (basePath === "/") return `/${trimmed}`;
    return `${basePath}/${trimmed}`;
  };

  registerComponent("CommonHome", LazyWrap(loadCommonHome, "Common Home"));
  registerComponent("AcknowledgePage", LazyWrap(loadAcknowledgePage, "Acknowledge Page"));
  registerComponent("UserDataModuleSearch", LazyWrap(loadUserDataModuleSearch, "User Data Module Search"));

  // Define routes
  app.addRoutes([
    { path: buildPath(), exact: true, layout: "Shell", page: { type: "CommonHome" } },
    { path: buildPath("home"), exact: true, layout: "Shell", page: { type: "CommonHome" } },
    { path: buildPath("acknowledgement_page"), exact: true, layout: "Shell", page: { type: "AcknowledgePage" } },
    { path: "/common/user_data_module_search", exact: true, layout: "Shell", page: { type: "UserDataModuleSearch" } },
  ]);
}
