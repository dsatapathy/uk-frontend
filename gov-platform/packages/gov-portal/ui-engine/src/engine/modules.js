// src/engine/modules.js
import { buildManifestsFromConfig, getByPath, mergeModuleLists } from "./utils";
import { registerGateAndBuildRoutes } from "./routes";
import { bootstrapFlags } from "./constants";

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
  if (bootstrapFlags.modules) return;
  bootstrapFlags.modules = true;

  if (Array.isArray(modules)) return; // no remote source

  const src = modules?.source;
  if (!src) return;

  try {
    const url = src.endpoint ? config.http?.endpoints?.[src.endpoint]?.url : src.url || src.endpoint;
    const params = { tenant: appInfo?.tenant, ...(src.params || {}) };

    const { data } = await http.get(url, { params, retry: false });

    const listPath = src.mapping?.list || "modules";
    const apiModules =
      (data && (listPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data) || data.modules)) || [];

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

    const guarded = registerGateAndBuildRoutes(app, merged, redirects, Shell, auth);
    setManifests(merged);
    setRoutes(guarded);
  } catch (e) {
    if (modules?.onErrorFallback === "defaults") {
      onFallback?.();
    }
  }
}
