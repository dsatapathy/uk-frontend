// src/engine/routes.js
import { ensureAuthGuard } from "../auth";
import { buildLazyModuleRoutes, registerModuleGate } from "../modules-orchestrator";
import { resolveRouteLayouts } from "./layouts";

export function registerGateAndBuildRoutes(app, manifests, redirects, Shell, auth) {
    registerModuleGate(app, manifests);
    const baseRoutes = buildLazyModuleRoutes(manifests, redirects);

    const publicPaths = [auth?.login?.path || "/login", ...(auth?.publicPaths || [])];
    // de-dupe and inject each as a public stub so the auth module can load
    [...new Set(publicPaths)].forEach((p) => {
        baseRoutes.unshift({
            path: p,
            exact: true,
            layout: "Shell",
            meta: { public: true },
            page: { type: "ModuleGate", props: { moduleKey: "auth" } },
        });
    });

    const layoutResolved = resolveRouteLayouts(baseRoutes, Shell);
    return ensureAuthGuard(layoutResolved, auth,  { loginPath: auth?.login?.path || "/login" } );
}
