import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { RouteBuilder, runtime } from "@gov/core";
import ThemeBridge from "./ThemeBridge";
import { registerModuleGate, buildLazyModuleRoutes, prefetchModule  } from "./modules-orchestrator";
import { ensureAuthGuard } from "./auth";

// Default Shell (can be overridden by config.layout)
function DefaultShell({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "216px 1fr" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

function useModulePrefetch(manifests) {
  React.useEffect(() => {
    const handleHover = (e) => {
      const key = e.target?.dataset?.moduleKey;
      if (key) prefetchModule(key);
    };
    document.addEventListener("mouseover", handleHover);
    const idleId =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => manifests.forEach((m) => prefetchModule(m.key)))
        : setTimeout(() => manifests.forEach((m) => prefetchModule(m.key)), 0);
    return () => {
      document.removeEventListener("mouseover", handleHover);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, [manifests]);
}

export function start(config) {
  const {
    target = "#root",
    base = "/",
    appName,
    logo,
    theme: themeOverrides,
    layout,
    modules = [],
    redirects = [],
    auth = { strategy: "none" },
    hooks = {},
    context = {},
  } = config;

  // 1) History Theme
  const history = createBrowserHistory({ basename: base });
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#0b5fff" },
      secondary: { main: "#4f46e5" },
      background: { default: "#f9fafb" },
    },
    shape: { borderRadius: 8 },
    ...(themeOverrides || {}),
  });

  // 2) Layout
  const Shell = layout || DefaultShell;
  runtime.registerLayout?.("Shell", Shell);

  // 3) App API given to modules
  let setRoutes;
  const app = {
    history,
    config,
    addRoutes: (r) => setRoutes((prev) => [...r, ...prev]), // prepend
    addNav: (items) => runtime.registerNav?.(items),
    actions: hooks.provideActions?.() || {},
    reducers: hooks.provideReducers?.() || {},
  };

    // 4) Build manifests from config (support npm id string via `import`)
    const manifests = modules.map((m) => {
        if (!m.loader && !m.import) {
            throw new Error(`Module ${m.key} must provide either a loader() or an import string`);
        }
        return {
            key: m.key,
            basePath: m.basePath,
            loader: m.loader ?? (() => import(m.import)), // no @vite-ignore here
        };
    });

  // 5) Register ModuleGate initial stub routes
  registerModuleGate(app, manifests);
  const initialRoutes = buildLazyModuleRoutes(manifests, redirects);

  // 6) Auth guard (optional)
  const guardedRoutes = ensureAuthGuard(initialRoutes, auth);

  // 7) Hooks
  hooks.onBootstrap?.({ app, manifests, appName, logo });

  function EngineApp() {
    const [routes, _setRoutes] = React.useState(guardedRoutes);
    setRoutes = _setRoutes;
    useModulePrefetch(manifests);
    React.useEffect(() => {
      const unlisten = history.listen((loc, action) => hooks.onRouteChange?.(loc, action));
      return unlisten;
    }, []);

    return (
      <Router history={history}>
        <RouteBuilder routes={routes}  />
      </Router>
    );
  }

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeBridge />
      <EngineApp />
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
