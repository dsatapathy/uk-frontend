// src/services/useMenu.js
import { useQueryClient } from "@tanstack/react-query";
import { useRQQuery, normalizeArray, depsReady, stableStringify } from "../rq";
import { http } from "../bootstrap";

/** Build a stable query key identical to what useRQQuery will generate */
export function getMenuQueryKey(count = 150, deps = {}) {
  const userKey = deps.userId ? String(deps.userId) : "anonymous";
  // useRQQuery appends stableStringify(params) and stableStringify({ deps })
  return ["menu", count, userKey, stableStringify({ count }), stableStringify({ deps })];
}

/** Shared builder so hook & prefetch stay in sync */
function buildMenuConfig({ count = 150, deps = {}, enabled = true, staleTime = 10 * 60 * 1000 } = {}) {
  const requireHydrated = Object.prototype.hasOwnProperty.call(deps, "hydrated");
  return {
    key: ["menu", count, deps.userId ? String(deps.userId) : "anonymous"],
    url: "/menu",
    method: "get",
    params: { count },
    deps,
    enabled,
    requireToken: true,
    requireHydrated,
    normalize: normalizeArray,
    staleTime,
  };
}

/** Main hook — completely declarative via rq.js */
export function useMenu(opts = {}) {
  return useRQQuery(buildMenuConfig(opts));
}

/** Optional: prefetch helper that matches the same key & fetcher */
export function usePrefetchMenu() {
  const qc = useQueryClient();

  return async ({ count = 150, deps = {}, staleTime = 10 * 60 * 1000 } = {}) => {
    // replicate rq gating (minimal): require token if provided / axios getter
    const hasToken = !!deps.accessToken || (http().getAccessToken && !!http().getAccessToken());
    const callerProvidedHydrated = Object.prototype.hasOwnProperty.call(deps, "hydrated");
    const hydrationOk = callerProvidedHydrated ? !!deps.hydrated : true;
    if (!depsReady(deps) || !hasToken || !hydrationOk) return;

    await qc.prefetchQuery({
      queryKey: getMenuQueryKey(count, deps),
      queryFn: async () => {
        const resp = await http().request({
          url: "/menu",
          method: "get",
          params: { count },
          headers: { "Cache-Control": "no-cache" },
          validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
        });
        return normalizeArray(resp.data);
      },
      staleTime,
    });
  };
}

/** Invalidate helper that matches the same stable key */
export function invalidateMenu(qc, { count = 150, deps = {} } = {}) {
  return qc.invalidateQueries({ queryKey: getMenuQueryKey(count, deps) });
}
