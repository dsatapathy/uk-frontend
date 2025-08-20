// src/engine/index.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { RouteBuilder, runtime } from "@gov/core";
import { QueryProvider } from "@gov/data";

import ThemeBridge from "../ThemeBridge";
import { DEFAULT_THEME } from "./constants";
import { useModulePrefetch } from "./prefetch";
import { initHttp } from "./http";
import { resolveShell, registerShellAsLayout } from "./layouts";
import { registerGateAndBuildRoutes } from "./routes";
import { buildInitialManifests, bootstrapModules } from "./modules";
import { bootstrapSidebar } from "./sidebar";
import { buildManifestsFromConfig } from "./utils";

export function start(config) {
    const {
        target = "#root",
        base = "/uk-portal",
        app: appInfo = {},
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
    } = config;

    const history = createBrowserHistory({ basename: base });
    const theme = createTheme(Object.assign({}, DEFAULT_THEME, themeOverrides || {}));

    // Layout/Shell
    const Shell = resolveShell(layoutComponent);
    registerShellAsLayout(Shell);

    // Engine API surface
    let externalSetRoutes;
    const app = {
        history,
        config,
        addRoutes: (r) => externalSetRoutes((prev) => [...r, ...prev]), // prepend real routes
        addNav: (items) => runtime.registerNav?.(items),
        actions: hooks.provideActions?.() || {},
        reducers: hooks.provideReducers?.() || {},
    };

    // HTTP client (engine-owned)
    const http = initHttp(config, appInfo, history);

    // Initial manifests & stub routes
    const initialManifests = buildInitialManifests(modules);
    const initialRoutes = registerGateAndBuildRoutes(app, initialManifests, redirects, Shell, auth);

    hooks.onBootstrap?.({ app, manifests: initialManifests, appName: appInfo?.name, logo: appInfo?.logo });

    function EngineApp() {
        const [manifests, setManifests] = React.useState(initialManifests);
        const [routes, setRoutes] = React.useState(initialRoutes);
        externalSetRoutes = setRoutes;

        // prefetch on hover/idle
        useModulePrefetch(manifests);

        // route change hook
        React.useEffect(() => {
            const unlisten = history.listen((loc, action) => hooks.onRouteChange?.(loc, action));
            return unlisten;
        }, []);

        // Sidebar bootstrap (once)
        React.useEffect(() => {
            bootstrapSidebar({ config, http, app, sidebarCfg, appInfo });
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
                config,
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ThemeBridge />
            <QueryProvider>
                <EngineApp />
            </QueryProvider>
        </ThemeProvider>,
        document.querySelector(target)
    );
}

export async function startFromUrl(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load config: ${url}`);
    const cfg = await res.json();
    return start(cfg);
}
