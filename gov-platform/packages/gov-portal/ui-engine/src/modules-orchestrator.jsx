import React from "react";
import { registerComponent } from "@gov/core";
import { CircularProgress } from "@mui/material";

const loaded = new Map(); // moduleKey -> boolean

export function makeModuleGate({ app, manifests }) {
  return function ModuleGate({ moduleKey, renderLoading }) {
    const manifest = manifests.find((m) => m.key === moduleKey);
    if (!manifest) {
      return <div style={{ color: "crimson" }}>Unknown module: {moduleKey}</div>;
    }

    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      // If already loaded (from a previous visit), nothing to do.
      if (loaded.get(moduleKey)) return;

      let cancel = false;

      Promise.resolve()
        .then(() => app.config.hooks?.beforeModuleRegister?.(moduleKey))
        .then(() => manifest.loader())
        .then((mod) => {
          if (cancel) return;
          // IMPORTANT: do not setState after this — register will typically unmount the gate.
          mod.register?.(app);
          loaded.set(moduleKey, true);
          app.config.hooks?.afterModuleRegister?.(moduleKey);
          // No setState here: we expect this component to unmount immediately after routes are added.
        })
        .catch((e) => {
          console.error(`[ModuleGate] failed to load ${moduleKey}`, e);
          if (!cancel) setError(e);
        });

      return () => {
        cancel = true;
      };
    }, [moduleKey, app, manifest]);

    // If already loaded, render nothing (routes will take over)
    if (loaded.get(moduleKey)) return null;

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
  const ModuleGate = makeModuleGate({ app, manifests });
  registerComponent("ModuleGate", ModuleGate);
}
