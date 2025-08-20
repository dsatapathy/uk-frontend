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
  
  export function buildManifestsFromConfig(modules) {
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
  