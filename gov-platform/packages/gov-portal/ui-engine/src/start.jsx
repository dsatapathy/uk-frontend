// start.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { RouteBuilder, runtime } from "@gov/core";
import ThemeBridge from "./ThemeBridge";
import { registerModuleGate, buildLazyModuleRoutes, prefetchModule } from "./modules-orchestrator";
import { ensureAuthGuard } from "./auth";

// shared data layer (engine owns fetching)
import { QueryProvider, createHttp, setHttp } from "@gov/data";

// ---------------- Layout ----------------
function DefaultShell({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "216px 1fr" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

// ---------------- Prefetch helpers ----------------
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

// ---------------- Utilities ----------------
function buildManifestsFromConfig(modules) {
  // Accept:
  // - Array: [{ key, basePath, loader? | import? }]
  // - Object: { defaults: { list, registry }, source?, mergeStrategy?, onErrorFallback? }
  if (Array.isArray(modules)) {
    return modules.map((m) => ({
      key: m.key,
      basePath: m.basePath,
      loader: m.loader || (() => import(/* @vite-ignore */ m.import)),
    }));
  }
  const list = modules?.defaults?.list || [];
  return list.map((m) => ({
    key: m.key,
    basePath: m.basePath,
    loader:
      (modules?.defaults?.registry && modules.defaults.registry[m.key]) ||
      m.loader ||
      (() => import(/* @vite-ignore */ m.import)),
  }));
}

function mergeModuleLists(defaultsList, apiList, strategy = "enabled-first") {
  if (!apiList || !apiList.length) return defaultsList;
  if (strategy === "replace") return apiList;
  if (strategy === "append") return [...defaultsList, ...apiList];

  // enabled-first: order by API first, then include any default not mentioned
  const apiKeys = new Set(apiList.map((m) => m.key));
  const tail = defaultsList.filter((m) => !apiKeys.has(m.key));
  return [...apiList, ...tail];
}

function applySidebarMerge(defaults, fetched, strategy = "replace") {
  if (!fetched || !Array.isArray(fetched)) return defaults || [];
  if (!defaults || !defaults.length) return fetched;
  if (strategy === "append") return [...defaults, ...fetched];
  if (strategy === "prepend") return [...fetched, ...defaults];
  return fetched; // replace
}

function resolveRouteLayouts(routes, fallbackLayout) {
  return routes.map((r) => {
    const resolved =
      typeof r.layout === "string"
        ? (runtime.getLayout?.(r.layout) || fallbackLayout)
        : (r.layout || fallbackLayout);
    return { ...r, layout: resolved };
  });
}

function getByPath(obj, path, fallback) {
  if (!path) return fallback;
  try {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// ---------------- Engine entry ----------------
export function start(config) {
  const {
    target = "#root",
    base = "/",

    // app/info
    app: appInfo = {},
    theme: themeOverrides,

    // layout sidebar
    layout,
    layout: {
      sidebar: sidebarCfg = {},
      component: layoutComponent,
      header: headerCfg, // eslint-disable-line no-unused-vars
    } = {},

    // modules
    modules = [], // array OR { defaults, source, ... }
    redirects = [],

    // http auth hooks
    http: httpCfg = { baseURL: "/api", timeout: 15000 },
    auth = { strategy: "none" },
    hooks = {},
    context = {},
  } = config;

  // 1) History + Theme
  const history = createBrowserHistory({ basename: base });
  const theme = createTheme(
    Object.assign(
      {
        palette: {
          mode: "light",
          primary: { main: "#0b5fff" },
          secondary: { main: "#4f46e5" },
          background: { default: "#f9fafb" },
        },
        shape: { borderRadius: 8 },
      },
      themeOverrides || {}
    )
  );

  // 2) Init shared HTTP (engine-owned)
  const http = createHttp({
    baseURL: httpCfg.baseURL || "/api",
    timeout: httpCfg.timeout || 15000,
    headers: httpCfg.headers || {},
    retry: httpCfg.retry || { attempts: 2, backoffMs: 300 },
    getAccessToken: () => {
      const { tokens = {}, prefix = "" } = config.auth || {};
      const key = tokens?.accessKey ? `${prefix || ""}${tokens.accessKey}` : null;
      return key ? localStorage.getItem(key) : null;
    },
    getTenant: () => appInfo?.tenant || "default",
    onAuthError: () => {
      if (config.auth?.onAuthFail) history.push(config.auth.onAuthFail);
    },
  });
  setHttp(http);

  // 3) Layout (resolve string names to actual components)
  let Shell;
  if (!layoutComponent) {
    Shell = DefaultShell;
  } else if (typeof layoutComponent === "string") {
    Shell = runtime.getLayout?.(layoutComponent) || DefaultShell;
  } else {
    Shell = layoutComponent;
  }
  // Ensure "Shell" is registered for route layout resolution
  runtime.registerLayout?.("Shell", Shell);

  // 4) App API
  let setRoutes;
  const app = {
    history,
    config,
    addRoutes: (r) => setRoutes((prev) => [...r, ...prev]), // prepend real routes
    addNav: (items) => runtime.registerNav?.(items),
    actions: hooks.provideActions?.() || {},
    reducers: hooks.provideReducers?.() || {},
  };

  // 5) Build initial manifests from config defaults/array
  const initialManifests = buildManifestsFromConfig(modules);

  // 6) Register ModuleGate stub routes
  registerModuleGate(app, initialManifests);
  const initialRoutes = buildLazyModuleRoutes(initialManifests, redirects);

  // 7) Auth guard + resolve layouts
  const guardedInitialRoutes = ensureAuthGuard(
    resolveRouteLayouts(initialRoutes, Shell),
    auth
  );

  // 8) Hooks
  hooks.onBootstrap?.({ app, manifests: initialManifests, appName: appInfo?.name, logo: appInfo?.logo });

  function EngineApp() {
    // state that can be replaced by fetched module manifests/routes
    const [manifests, setManifests] = React.useState(initialManifests);
    const [routes, _setRoutes] = React.useState(guardedInitialRoutes);
    setRoutes = _setRoutes;

    // Prefetch
    useModulePrefetch(manifests);

    // Route change hook
    React.useEffect(() => {
      const unlisten = history.listen((loc, action) => hooks.onRouteChange?.(loc, action));
      return unlisten;
    }, []);

    // single-run refs (React 17 compatible, avoids multiple API hits)
    const sidebarRanRef = React.useRef(false);
    const modulesRanRef = React.useRef(false);

    // -------- Sidebar: source + defaults + mergeStrategy ----------
    React.useEffect(() => {
      if (sidebarRanRef.current) return;
      sidebarRanRef.current = true;

      const s = sidebarCfg?.source;
      const defaults = sidebarCfg?.defaults || sidebarCfg?.nav || [];
      const mergeStrategy = sidebarCfg?.mergeStrategy || "replace";

      async function loadSidebar() {
        if (!s) {
          // no API source, just register defaults if provided
          if (defaults?.length) app.addNav?.(defaults);
          return;
        }
        try {
          // endpoint or url + params
          const url = s.endpoint ? config.http?.endpoints?.[s.endpoint]?.url : s.url || s.endpoint;
          const params = Object.assign(
            {},
            s.params || {},
            {
              tenant: appInfo?.tenant,
              locale: config.i18n?.defaultLocale,
              role: config.auth?.currentUser?.role, // optional, in case host passes
            }
          );

          // ⬇ ensure we don't retry this bootstrap call
          const { data } = await http.get(url, { params, retry: false });

          const listPath = s.mapping?.list || "items";
          const serverItems =
            (data && (listPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data) || data.items)) || [];

          // map fields if mapping is provided
          const map = s.mapping?.fields;
          const mapped = map
            ? serverItems.map((it) => ({
                key: getByPath(it, map.key, it.code),
                text: getByPath(it, map.text, it.label),
                to: getByPath(it, map.to, it.route),
                icon: getByPath(it, map.icon, it.icon),
                visibleWhen: {
                  roles: getByPath(it, map?.visibleWhen?.roles, it.roles),
                  perms: getByPath(it, map?.visibleWhen?.perms, it.permissions),
                  expr: getByPath(it, map?.visibleWhen?.expr, it.expr),
                },
              }))
            : serverItems;

          const finalNav = applySidebarMerge(defaults, mapped, mergeStrategy);
          if (finalNav?.length) app.addNav?.(finalNav);
        } catch (e) {
          // fallback on error
          if (sidebarCfg?.onErrorFallback === "defaults" && defaults?.length) {
            app.addNav?.(defaults);
          }
        }
      }

      loadSidebar();
      // empty deps: intentionally run once per mount
    }, []);

    // -------- Modules: fetch from API and merge with defaults -----
    React.useEffect(() => {
      if (modulesRanRef.current) return;
      modulesRanRef.current = true;

      if (Array.isArray(modules)) return; // nothing to load
      const src = modules?.source;
      if (!src) return;

      async function loadModules() {
        try {
          const url = src.endpoint ? config.http?.endpoints?.[src.endpoint]?.url : src.url || src.endpoint;
          const params = Object.assign({ tenant: appInfo?.tenant }, src.params || {});
          // ⬇ ensure we don't retry this bootstrap call
          const { data } = await http.get(url, { params, retry: false });

          const listPath = src.mapping?.list || "modules";
          const apiModules =
            (data && (listPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data) || data.modules)) || [];

          // normalize into { key, basePath } then attach loader via defaults.registry
          const normalized = apiModules.map((m) => ({
            key: getByPath(m, src.mapping?.fields?.key, m.key),
            basePath: getByPath(m, src.mapping?.fields?.basePath, m.basePath),
          }));

          const defaultsList = modules?.defaults?.list || [];
          const registry = modules?.defaults?.registry || {};
          const merged = mergeModuleLists(defaultsList, normalized, modules?.mergeStrategy || "enabled-first")
            .map((m) => ({
              ...m,
              loader: registry[m.key] || m.loader || (() => import(/* @vite-ignore */ m.import)),
            }));

          // Re-register stub routes and module gate with new manifest set
          registerModuleGate(app, merged);
          const newRoutes = ensureAuthGuard(
            resolveRouteLayouts(buildLazyModuleRoutes(merged, redirects), Shell),
            auth
          );

          setManifests(merged);
          _setRoutes(newRoutes);
        } catch (e) {
          if (modules?.onErrorFallback === "defaults") {
            const merged = buildManifestsFromConfig(modules);
            registerModuleGate(app, merged);
            const newRoutes = ensureAuthGuard(
              resolveRouteLayouts(buildLazyModuleRoutes(merged, redirects), Shell),
              auth
            );
            setManifests(merged);
            _setRoutes(newRoutes);
          }
        }
      }

      loadModules();
      // empty deps: intentionally run once per mount
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
      {/* React Query globally for engine + modules */}
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
