import React from "react";
import { registerComponent } from "@gov/core";

const loaded = new Map();

export function makeModuleGate({ app, manifests }) {
  return function ModuleGate({ moduleKey }) {
    const manifest = manifests.find((m) => m.key === moduleKey);
    if (!manifest) return <div style={{ color: "crimson" }}>Unknown module: {moduleKey}</div>;

    const [ready, setReady] = React.useState(Boolean(loaded.get(moduleKey)));

    React.useEffect(() => {
      if (ready) return;
      let cancel = false;
      manifest
        .loader()
        .then((mod) => {
          if (cancel) return;
          app.config.hooks?.beforeModuleRegister?.(moduleKey);
          mod.register?.(app);              // module adds real routes/nav
          loaded.set(moduleKey, true);
          setReady(true);
          app.config.hooks?.afterModuleRegister?.(moduleKey);
        })
        .catch((e) => console.error(`[ModuleGate] failed to load ${moduleKey}`, e));
      return () => { cancel = true; };
    }, [ready, moduleKey]);

    return null; // real pages come from module routes
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
  const ModuleGate = makeModuleGate({ app, manifests });
  registerComponent("ModuleGate", ModuleGate);
}
