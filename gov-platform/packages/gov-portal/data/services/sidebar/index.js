// src/services/useMenu.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../bootstrap";

// Be permissive: only block on explicit null or empty strings.
// Ignore undefined keys (like hydrated/userId when not available yet).
function depsReady(deps = {}) {
  for (const [k, v] of Object.entries(deps || {})) {
    if (v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    // undefined is OK
  }
  return true;
}

export function getMenuQueryKey(count = 150, deps = {}) {
  const userKey = deps.userId ? String(deps.userId) : "anonymous";
  return ["menu", count, userKey];
}

export function useMenu({
  count = 150,
  deps = {},                 // e.g. { hydrated, accessToken, userId }
  enabled = true,
  staleTime = 10 * 60 * 1000,
} = {}) {
  const url = "/menu";       // baseURL should already include /api

  const ready = depsReady(deps);

  // Only require `hydrated` if the caller actually passed it.
  const callerProvidedHydrated = Object.prototype.hasOwnProperty.call(deps, "hydrated");
  const hasToken =
    !!deps.accessToken ||
    // Optional fallback: read from axios instance if it exposes getAccessToken()
    !!(http().getAccessToken && http().getAccessToken());

  const hydrationOk = callerProvidedHydrated ? !!deps.hydrated : true;
  const isEnabled = !!enabled && ready && hasToken && hydrationOk;

  // DEBUG (remove later): see exactly why it isn't firing
  // console.debug("[useMenu]", { isEnabled, ready, hasToken, hydrationOk, deps });

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
      if (status === 401) return false; // avoid loops while logged out
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
    const callerProvidedHydrated = Object.prototype.hasOwnProperty.call(deps, "hydrated");
    const hasToken =
      !!deps.accessToken ||
      !!(http().getAccessToken && http().getAccessToken());
    const hydrationOk = callerProvidedHydrated ? !!deps.hydrated : true;
    if (!(hasToken && hydrationOk)) return;

    await qc.prefetchQuery({
      queryKey: getMenuQueryKey(count, { userId: deps.userId }),
      queryFn: async () => {
        const { data } = await http().get("/menu", { params: { count } });
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
