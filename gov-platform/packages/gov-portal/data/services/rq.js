// src/services/rq.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "./bootstrap";

/** ---------- Small utilities ---------- */

// Allow undefined; block only explicit null or empty strings
export function depsReady(deps = {}) {
  for (const v of Object.values(deps || {})) {
    if (v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
  }
  return true;
}

// Deterministic JSON.stringify (sorted keys) to keep queryKeys stable
export function stableStringify(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stableStringify).join(",")}]`;
  const keys = Object.keys(x).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(x[k])}`).join(",")}}`;
}

// Extract id/code quickly
export function idOf(v) {
  return typeof v === "object" ? (v?.code ?? v?.id ?? v?.value ?? v?.name) : v;
}

// Accept 304 to avoid spurious "error" when ETag hits
function defaultValidateStatus(s) {
  return (s >= 200 && s < 300) || s === 304;
}

// Normalize common array payload shapes
export function normalizeArray(payload, paths = ["menu", "items", "data", "data.menu"]) {
  if (Array.isArray(payload)) return payload;
  for (const path of paths) {
    const val = path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), payload);
    if (Array.isArray(val)) return val;
  }
  if (payload && typeof payload === "object") {
    const { meta, ...rest } = payload;
    const ks = Object.keys(rest);
    if (ks.length && ks.every((k) => /^\d+$/.test(k))) {
      return ks.sort((a, b) => Number(a) - Number(b)).map((k) => rest[k]);
    }
  }
  return [];
}

/** ---------- Generic hooks ---------- */

/**
 * useRQQuery: one hook for all GETs (or any read)
 * cfg:
 *  - key: array | string (base key parts)
 *  - url: string
 *  - method: "get" (default) | "post" | ...
 *  - params, data, headers
 *  - deps: gating object for readiness
 *  - requireToken: bool (default false)
 *  - requireHydrated: bool (default false)
 *  - enabled: bool
 *  - selectPath: "items" | "data.menu" | ...
 *  - select: fn(data) => any
 *  - normalize: fn(data) => any (e.g., normalizeArray)
 *  - validateStatus: fn(status) => boolean (default accepts 304)
 *  - staleTime, gcTime, retry, keepPreviousData, refetchOn*
 */
export function useRQQuery(cfg = {}) {
  const {
    key = [],
    keyExtras = [],

    url,
    method = "get",
    params,
    data,
    headers,

    deps = {},
    enabled = true,
    requireToken = false,
    requireHydrated = false,

    selectPath,
    select,
    normalize,

    validateStatus = defaultValidateStatus,

    staleTime = 10 * 60 * 1000,
    gcTime = 30 * 60 * 1000,
    retry = (failureCount, err) => {
      const s = err?.response?.status;
      if (s === 401) return false;
      return failureCount < 2;
    },
    keepPreviousData = true,
    refetchOnMount = "always",
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
  } = cfg;

  // gating
  const hasToken = requireToken
    ? !!(deps?.accessToken || (http().getAccessToken && http().getAccessToken()))
    : true;
  const hydrationOk = requireHydrated ? !!deps?.hydrated : true;
  const ready = depsReady(deps);
  const isEnabled = !!enabled && !!url && ready && hasToken && hydrationOk;

  // key
  const baseKey = Array.isArray(key) ? key : [key];
  const queryKey = [
    ...baseKey,
    stableStringify(params || {}),
    stableStringify({ deps }),
    ...keyExtras,
  ];

  return useQuery({
    queryKey,
    enabled: isEnabled,
    queryFn: async () => {
      const resp = await http().request({
        url,
        method,
        params,
        data,
        headers,
        validateStatus,
      });

      let payload = resp.data;
      if (selectPath) {
        payload = selectPath.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), payload);
      }
      if (typeof select === "function") payload = select(payload);
      if (typeof normalize === "function") payload = normalize(payload);
      return payload;
    },
    staleTime,
    gcTime,
    retry,
    keepPreviousData,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
  });
}

/**
 * useRQMutation: one hook for all writes
 * cfg:
 *  - url, method
 *  - headers
 *  - buildFormData(arg) or buildBody(arg) to produce request body
 *  - selectPath / select / normalize
 *  - validateStatus
 */
export function useRQMutation(cfg = {}) {
  const {
    url,
    method = "post",
    headers,

    buildFormData,
    buildBody,

    selectPath,
    select,
    normalize,

    validateStatus = (s) => s >= 200 && s < 300,
  } = cfg;

  return useMutation({
    mutationFn: async (arg) => {
      const data =
        typeof buildFormData === "function"
          ? buildFormData(arg)
          : typeof buildBody === "function"
          ? buildBody(arg)
          : arg;

      const resp = await http().request({
        url,
        method,
        headers,
        data,
        validateStatus,
      });

      let payload = resp.data;
      if (selectPath) {
        payload = selectPath.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), payload);
      }
      if (typeof select === "function") payload = select(payload);
      if (typeof normalize === "function") payload = normalize(payload);
      return payload;
    },
  });
}
