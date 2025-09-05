// src/engine/modules.js
import { buildManifestsFromConfig, getByPath, mergeModuleLists } from "./utils";
import { registerGateAndBuildRoutes } from "./routes";

/**
 * IMPORTANT: use static import functions so Vite/Rollup can see the deps and extract CSS.
 * Add to this map for every lazy-loadable module you support.
 * (Bare specifiers are OK here because they're static, not string-built.)
 */
const KNOWN_IMPORTERS = {
  "@gov/mod-auth":  () => import("@gov/mod-auth"),
  "@gov/mod-bpa":   () => import("@gov/mod-bpa"),
  // add more keys if/when you publish new modules
};

function resolveLoaderFrom(m, registry) {
  // precedence: explicit registry > provided loader > known by key > known by import file
  return (
    registry?.[m.key] ||
    m.loader ||
    KNOWN_IMPORTERS[m.key] ||
    null
  );
}

export function buildInitialManifests(modules) {
  return buildManifestsFromConfig(modules);
}

export async function bootstrapModules({
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
}) {
  // When modules is already a list (no remote), honour it as-is.
  if (Array.isArray(modules)) return;

  const src = modules?.source;
  if (!src) return;

  try {
    const url = src.endpoint
      ? config.http?.endpoints?.[src.endpoint]?.url
      : (src.url || src.endpoint);

    const params = { tenant: appInfo?.tenant, ...(src.params || {}) };

    const { data } = await http.get(url, { params, retry: false });

    const listPath = src.mapping?.list || "modules";
    const apiModules =
      (data && (listPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data) || data.modules)) || [];

    // Normalize fields from the API using mapping
    const normalized = apiModules.map((m) => ({
      key:      getByPath(m, src.mapping?.fields?.key,      m.key),
      basePath: getByPath(m, src.mapping?.fields?.basePath, m.basePath),
      import:   getByPath(m, src.mapping?.fields?.import,   m.import),
      loader:   getByPath(m, src.mapping?.fields?.loader,   m.loader),
    }));

    const defaultsList = modules?.defaults?.list || [];
    const registry     = modules?.defaults?.registry || {};

    // Merge defaults + server list according to the chosen strategy
    const mergedList = mergeModuleLists(
      defaultsList,
      normalized,
      modules?.mergeStrategy || "enabled-first"
    ).map((m) => {
      const loader = resolveLoaderFrom(m, registry);
      if (!loader) {
        console.warn(`[engine/modules] No static importer found for module key="${m.key}" import="${m.import}".`);
      }
      return { ...m, loader: loader || (async () => {
        throw new Error(`Unknown module "${m.key}". Add it to KNOWN_IMPORTERS in modules.js`);
      }) };
    });

    const guarded = registerGateAndBuildRoutes(app, mergedList, redirects, Shell, auth);
    setManifests(mergedList);
    setRoutes(guarded);
  } catch (e) {
    console.error("[engine/modules] Failed loading remote module list:", e);
    if (modules?.onErrorFallback === "defaults") {
      onFallback?.();
    }
  }
}
