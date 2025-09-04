import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../bootstrap";

// same depsReady helper
function depsReady(deps = {}) {
  const ks = Object.keys(deps || {});
  if (ks.length === 0) return true;
  return ks.every((k) => {
    const v = deps[k];
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    return true;
  });
}

// Include userId so cache is per-user
export function getMenuQueryKey(count = 150, deps = {}) {
  return ["menu", count, deps.userId ?? "anonymous"];
}

/**
 * Server returns: { total, menu }
 * Hook returns: menu[] for convenience.
 *
 * Pass your auth state in `deps`:
 *   { hydrated: boolean, accessToken?: string, userId?: string }
 */
export function useMenu({
  count = 150,
  deps = {},
  enabled = true,
  staleTime = 10 * 60 * 1000,
} = {}) {
  const url = "/api/menu";

  const ready = depsReady(deps);
  const authReady = !!deps.hydrated && !!deps.accessToken; // critical gate
  const isEnabled = enabled && ready && authReady;

  return useQuery({
    queryKey: getMenuQueryKey(count, { userId: deps.userId }),
    enabled: isEnabled,
    queryFn: async () => {
      const { data } = await http().get(url, { params: { count } });
      return data?.menu || [];
    },
    staleTime,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, err) => {
      const status = err?.response?.status;
      if (status === 401) return false;     // don't spam retries while logged out
      return failureCount < 2;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });
}

export function usePrefetchMenu() {
  const qc = useQueryClient();
  return async ({ count = 150, deps = {} } = {}) => {
    if (!(deps.hydrated && deps.accessToken)) return; // guard prefetch while logged out
    await qc.prefetchQuery({
      queryKey: getMenuQueryKey(count, { userId: deps.userId }),
      queryFn: async () => {
        const { data } = await http().get("/api/menu", { params: { count } });
        return data?.menu || [];
      },
      staleTime: 10 * 60 * 1000,
    });
  };
}

export function invalidateMenu(qc, { count = 150, deps = {} } = {}) {
  return qc.invalidateQueries({
    queryKey: getMenuQueryKey(count, { userId: deps.userId }),
  });
}
