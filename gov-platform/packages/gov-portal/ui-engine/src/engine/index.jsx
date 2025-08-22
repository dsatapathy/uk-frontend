// src/engine/index.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { RouteBuilder, runtime } from "@gov/core";
import { registerLibraryDefaults } from "@gov/library";
import { registerUtilsDefaults } from "@gov/utils";
import { useModulePrefetch } from "./prefetch";
import { initHttp } from "./http";
import { resolveShell, registerShellAsLayout } from "./layouts";
import { registerGateAndBuildRoutes } from "./routes";
import { buildInitialManifests, bootstrapModules } from "./modules";
import { bootstrapSidebar } from "./sidebar";
import { buildManifestsFromConfig } from "./utils";
import { configSchema } from "./config-schema";
import "@gov/styles/core/index.scss";
import { AppProviders } from "./bootstrap-auth";

export function start(rawConfig) {
    const validated = configSchema.safeParse(rawConfig);

    if (!validated.success) {
        console.error("Invalid engine config:", validated.error.flatten().fieldErrors);
        throw new Error("Engine configuration validation failed");
    }

    const cfg = validated.data;
    const {
        target,
        base,
        app: appInfo,
        theme: themeOverrides,
        layout,
        layout: {
            sidebar: sidebarCfg = {},
            component: layoutComponent,
            header: _headerCfg, // reserved
        } = {},
        modules = [],
        redirects = [],
        auth = { strategy: "none" },
        hooks = {},
        context = {},
    } = cfg;

    const history = createBrowserHistory({ basename: base });

    // Layout/Shell
    const Shell = resolveShell(layoutComponent);
    registerShellAsLayout(Shell);
    // 🔽 Register library components lazily (no code is fetched until rendered)
    registerLibraryDefaults();
    registerUtilsDefaults();
    // Engine API surface
    let externalSetRoutes;
    const app = {
        history,
        config: cfg,
        addRoutes: (r) => externalSetRoutes((prev) => [...r, ...prev]), // prepend real routes
        addNav: (items) => runtime.registerNav?.(items),
        actions: hooks.provideActions?.() || {},
        reducers: hooks.provideReducers?.() || {},
    };

    // HTTP client (engine-owned)
    const http = initHttp(cfg, appInfo, history);

    // Initial manifests & stub routes
    const initialManifests = buildInitialManifests(modules);
    const initialRoutes = registerGateAndBuildRoutes(app, initialManifests, redirects, Shell, auth);

    hooks.onBootstrap?.({ app, manifests: initialManifests, appName: appInfo?.name, logo: appInfo?.logo });

    function EngineApp() {
        const [manifests, setManifests] = React.useState(initialManifests);
        const [routes, setRoutes] = React.useState(initialRoutes);
        externalSetRoutes = setRoutes;

        // prefetch on hover/idle
        useModulePrefetch();

        // route change hook
        React.useEffect(() => {
            const unlisten = history.listen((loc, action) => hooks.onRouteChange?.(loc, action));
            return unlisten;
        }, []);

        // Sidebar bootstrap (once)
        React.useEffect(() => {
            bootstrapSidebar({ config: cfg, http, app, sidebarCfg, appInfo });
        }, []);

        // Modules bootstrap/merge (once)
        React.useEffect(() => {
            // Fallback callback: re-derive from defaults on error
            const onFallback = () => {
                const merged = buildManifestsFromConfig(modules);
                const guarded = registerGateAndBuildRoutes(app, merged, redirects, Shell, auth);
                setManifests(merged);
                setRoutes(guarded);
            };

            bootstrapModules({
                config: cfg,
                http,
                modules,
                app,
                redirects,
                Shell,
                auth,
                setManifests,
                setRoutes,
                onFallback,
                appInfo,
            });
        }, []);

        return (
            <Router history={history}>
                <RouteBuilder routes={routes} context={context} />
            </Router>
        );
    }

    ReactDOM.render(
        <AppProviders cfg={cfg}>
            <EngineApp />
        </AppProviders>
        ,
        document.querySelector(target)
    );
}

export async function startFromUrl(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load config: ${url}`);
    const cfg = await res.json();
    return start(cfg);
}
