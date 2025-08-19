import React from "react";
import { registerComponent } from "@gov/core";
import { CircularProgress } from "@mui/material";

/** Cache of in-flight loads: moduleKey -> Promise<mod> */
const loadCache = new Map();
/** Flags of completed registration: moduleKey -> true */
const loadedFlags = new Map();
/** Registry of manifests by key */
const manifestMap = new Map();

/** Start (or reuse) the dynamic import for a module. */
export function prefetchModule(moduleKey) {
  if (loadCache.has(moduleKey)) return loadCache.get(moduleKey);
  const manifest = manifestMap.get(moduleKey);
  if (!manifest) return Promise.resolve(null);
  const p = manifest.loader();
  loadCache.set(moduleKey, p);
  return p;
}

export function makeModuleGate({ app, manifests }) {
  return function ModuleGate({ moduleKey, renderLoading }) {
    const manifest = manifests.find((m) => m.key === moduleKey);
    if (!manifest) {
      return <div style={{ color: "crimson" }}>Unknown module: {moduleKey}</div>;
    }

    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      // If already registered, nothing to do.
      if (loadedFlags.get(moduleKey) === true) return;

      let cancel = false;

      Promise.resolve()
        .then(() => app.config.hooks?.beforeModuleRegister?.(moduleKey))
        // Use the prefetch (single import per key), do NOT call manifest.loader() again
        .then(() => prefetchModule(moduleKey))
        .then((mod) => {
          if (cancel || !mod) return;
          // Register routes/nav once. Do NOT set state after this: gate will usually unmount.
          mod.register?.(app);
          loadedFlags.set(moduleKey, true);
          app.config.hooks?.afterModuleRegister?.(moduleKey);
        })
        .catch((e) => {
          console.error(`[ModuleGate] failed to load ${moduleKey}`, e);
          if (!cancel) setError(e);
        });

      return () => { cancel = true; };
    }, [moduleKey, app]);

    // If already registered, render nothing (module routes will render the real pages)
    if (loadedFlags.get(moduleKey) === true) return null;

    // Error UI
    if (error) {
      return (
        <div style={{ color: "crimson", padding: 16 }}>
          Failed to load module: {moduleKey}
        </div>
      );
    }

    // Loading UI (customizable)
    const hookContent = app.config.hooks?.renderModuleLoading?.({ moduleKey });
    const loading =
      typeof renderLoading === "function"
        ? renderLoading({ moduleKey })
        : renderLoading || hookContent;

    return (
      loading ?? (
        <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
          <CircularProgress />
        </div>
      )
    );
  };
}

export function buildLazyModuleRoutes(manifests = [], redirects = []) {
  const gates = manifests.map((m) => ({
    path: m.basePath,
    exact: false,
    layout: "Shell",
    page: { type: "ModuleGate", props: { moduleKey: m.key } },
  }));
  const rds = redirects.map((r) => ({ path: r.from, exact: true, redirect: r.to }));
  return [...rds, ...gates];
}

export function registerModuleGate(app, manifests) {
  manifests.forEach((m) => manifestMap.set(m.key, m));
  const ModuleGate = makeModuleGate({ app, manifests });
  registerComponent("ModuleGate", ModuleGate);
}
