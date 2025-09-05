// src/engine/utils.js
export function getByPath(obj, path, fallback) {
  if (!path) return fallback;
  try {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

export function mergeModuleLists(defaultsList, apiList, strategy = "enabled-first") {
  if (!apiList || !apiList.length) return defaultsList;
  if (strategy === "replace") return apiList;
  if (strategy === "append") return [...defaultsList, ...apiList];

  const apiKeys = new Set(apiList.map((m) => m.key));
  const tail = defaultsList.filter((m) => !apiKeys.has(m.key));
  return [...apiList, ...tail];
}

export function applySidebarMerge(defaults, fetched, strategy = "replace") {
  if (!fetched || !Array.isArray(fetched)) return defaults || [];
  if (!defaults || !defaults.length) return fetched;
  if (strategy === "append") return [...defaults, ...fetched];
  if (strategy === "prepend") return [...fetched, ...defaults];
  return fetched; // replace
}

/* ------------------------------------------------------------------ */
/*  STATIC IMPORT MAP – add any new modules you publish here           */
/* ------------------------------------------------------------------ */
export const KNOWN_IMPORTERS = {
  "@gov/mod-auth":  () => import("@gov/mod-auth"),
  "@gov/mod-bpa":   () => import("@gov/mod-bpa"),
};

export function resolveStaticLoader(m, registry) {
  return (
    registry?.[m.key] ||
    m.loader ||
    KNOWN_IMPORTERS[m.key] ||
    null
  );
}

/**
 * Build manifests from local config (no remote). IMPORTANT:
 * we use static import functions so Vite/Rollup can see CSS and include it.
 */
export function buildManifestsFromConfig(modules) {
  if (Array.isArray(modules)) {
    return modules.map((m) => ({
      key: m.key,
      basePath: m.basePath,
      loader:
        resolveStaticLoader(m) ||
        (async () => {
          throw new Error(
            `Unknown module "${m.key}". Add it to KNOWN_IMPORTERS in utils.js`
          );
        }),
    }));
  }

  const list = modules?.defaults?.list || [];
  const registry = modules?.defaults?.registry || {};
  return list.map((m) => ({
    key: m.key,
    basePath: m.basePath,
    loader:
      resolveStaticLoader(m, registry) ||
      (async () => {
        throw new Error(
          `Unknown module "${m.key}". Add it to KNOWN_IMPORTERS in utils.js`
        );
      }),
  }));
}
