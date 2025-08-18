// apps/uk-portal/src/modules-orchestrator.jsx
import React from "react";
import { manifests } from "./module-manifest";

const loaded = new Map();

export function makeModuleGate({ app }) {
  return function ModuleGate({ moduleKey }) {
    const manifest = manifests.find(m => m.key === moduleKey);
    if (!manifest) return <div style={{ color: "crimson" }}>Unknown module: {moduleKey}</div>;

    const [ready, setReady] = React.useState(Boolean(loaded.get(moduleKey)));

    React.useEffect(() => {
      if (ready) return;
      manifest.loader().then(mod => {
        mod.register?.(app);       // module pushes real routes
        loaded.set(moduleKey, true);
        setReady(true);
      });
    }, [ready, moduleKey]);

    return ready ? null : <div>Loading {moduleKey}…</div>;
  };
}

export function buildLazyModuleRoutes() {
  return [
    { path: "/bpa", exact: false, layout: "Shell", page: { type: "ModuleGate", props: { moduleKey: "bpa" } } },
    { path: "/tl",  exact: false, layout: "Shell", page: { type: "ModuleGate", props: { moduleKey: "tl"  } } },
  ];
}
