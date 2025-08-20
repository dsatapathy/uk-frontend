// src/engine/routes.js
import { ensureAuthGuard } from "../auth";
import { buildLazyModuleRoutes, registerModuleGate } from "../modules-orchestrator";
import { resolveRouteLayouts } from "./layouts";

export function registerGateAndBuildRoutes(app, manifests, redirects, Shell, auth) {
  registerModuleGate(app, manifests);
  const baseRoutes = buildLazyModuleRoutes(manifests, redirects);
  const layoutResolved = resolveRouteLayouts(baseRoutes, Shell);
  return ensureAuthGuard(layoutResolved, auth);
}
