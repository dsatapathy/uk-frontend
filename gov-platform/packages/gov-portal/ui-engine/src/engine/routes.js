// src/engine/routes.js
import { ensureAuthGuard } from "../auth";
import { buildLazyModuleRoutes, registerModuleGate } from "../modules-orchestrator";
import { resolveRouteLayouts } from "./layouts";

export function registerGateAndBuildRoutes(app, manifests, redirects, Shell, auth) {
  registerModuleGate(app, manifests);
  const baseRoutes = buildLazyModuleRoutes(manifests, redirects);

  // 1) Normalize paths with the app base (e.g. "/uk-portal")
  const base = app?.base || ""; // keep "" if you truly run at domain root

  const normalize = (p) => {
    if (!p) return p;
    // already base-prefixed or an absolute http(s) url → keep as-is
    if (base && p.startsWith(base)) return p;
    // make "/login" -> "/uk-portal/login"
    // return base && p.startsWith("/") ? base + p : p;
    return base && p.startsWith("/") ? p : p;
  };

  const loginPathRaw = auth?.login?.path || "/login";
  const loginPath = normalize(loginPathRaw);

  // 2) Build public paths set (login + declared public)
  const publicPaths = [loginPath, ...((auth?.publicPaths || []).map(normalize))];
  const publicSet = new Set(publicPaths); // de-dupe

  // 3) Inject a public stub route for each public path so the auth module can load
  [...publicSet].forEach((p) => {
    baseRoutes.unshift({
      path: p,
      exact: true,               // react-router-dom v5
      layout: "AutoShell",
      meta: { public: true },
      page: { type: "ModuleGate", props: { moduleKey: "auth" } },
    });
  });

  const layoutResolved = resolveRouteLayouts(baseRoutes, Shell);

  // 4) Call the guard with normalized loginPath + base
  //    Also pass the normalized publicPaths back into auth so guard logic sees them.
  const nextAuth = { ...auth, publicPaths: [...publicSet] };

  return ensureAuthGuard(layoutResolved, nextAuth, { loginPath, base });
}
