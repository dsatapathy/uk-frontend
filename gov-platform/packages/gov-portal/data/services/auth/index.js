// data/service/authApi.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * makeAuthApi(http, cfg)
 * - http: your Axios instance
 * - cfg: {
 *     auth: {
 *       baseURL: "",                           // e.g. "https://api.example.com"
 *       endpoints: {
 *         login: "/api/auth/login",
 *         me: "/api/auth/me",
 *         logout: "/api/auth/logout",
 *         refresh: "/api/auth/refresh"        // optional
 *       },
 *       withCredentials: true,                 // default: true
 *       storageNamespace: "gov-portal",        // key prefix
 *       installInterceptors: true,             // attach Authorization from storage
 *       // map raw login response -> { tokens, user }
 *       responseAdapter: (data) => ({
 *         tokens: {
 *           accessToken: data?.accessToken || data?.token,
 *           refreshToken: data?.refreshToken,
 *           tokenType: data?.tokenType || "Bearer",
 *         },
 *         user: data?.user,
 *       }),
 *       // decide local vs session storage from login payload
 *       rememberSelector: (payload) => !!payload?.remember,
 *       // optional: custom header builder for authorized calls
 *       authHeader: (tokens) =>
 *         tokens?.accessToken
 *           ? { Authorization: `${tokens.tokenType || "Bearer"} ${tokens.accessToken}` }
 *           : {},
 *     }
 *   }
 */

// ---- tiny namespaced storage that supports session/local scopes ----
function makeStorage(ns) {
  const k = (n) => `${ns}:${n}`;
  return {
    get(name) {
      try {
        const a = localStorage.getItem(k(name));
        const b = sessionStorage.getItem(k(name));
        return a ? JSON.parse(a) : b ? JSON.parse(b) : null;
      } catch (_) {
        return null;
      }
    },
    set(name, value, scope) {
      try {
        const s = scope === "local" ? localStorage : sessionStorage;
        s.setItem(k(name), JSON.stringify(value));
        // ensure only one scope holds the value
        if (scope === "local") sessionStorage.removeItem(k(name));
        else localStorage.removeItem(k(name));
      } catch (_) {}
    },
    remove(name) {
      try {
        localStorage.removeItem(k(name));
        sessionStorage.removeItem(k(name));
      } catch (_) {}
    },
  };
}

export function makeAuthApi(http, cfg) {
  const opts = cfg?.auth || {};
  const ns = opts.storageNamespace || "gov-portal";
  const storage = opts.storage || makeStorage(ns);
  const withCreds = typeof opts.withCredentials === "boolean" ? opts.withCredentials : true;

  const baseURL = opts.baseURL || "";
  const endpoints = {
    login: opts.endpoints?.login || "/api/auth/login",
    me: opts.endpoints?.me || "/api/auth/me",
    logout: opts.endpoints?.logout || "/api/auth/logout",
    refresh: opts.endpoints?.refresh, // optional
  };

  const responseAdapter =
    typeof opts.responseAdapter === "function"
      ? opts.responseAdapter
      : (d) => ({ tokens: { accessToken: d?.token, tokenType: "Bearer" }, user: d?.user });

  const rememberSelector =
    typeof opts.rememberSelector === "function" ? opts.rememberSelector : (p) => !!p?.remember;

  const authHeaderBuilder =
    typeof opts.authHeader === "function"
      ? opts.authHeader
      : (tokens) =>
          tokens?.accessToken
            ? { Authorization: `${tokens?.tokenType || "Bearer"} ${tokens?.accessToken}` }
            : {};

  const url = (p) => (baseURL ? new URL(p, baseURL).toString() : p);

  // ---- token helpers (persist/read/clear) ----
  function setAuth(auth, scope) {
    storage.set("auth", auth, scope); // scope = "local" | "session"
  }
  function getAuth() {
    return storage.get("auth");
  }
  function clearAuth() {
    storage.remove("auth");
  }

  // ---- optional interceptors to inject Authorization automatically ----
  let reqInterceptorId = null;
  if (opts.installInterceptors) {
    try {
      // prevent double-install if called more than once
      if (!http.__auth_interceptor_installed__) {
        reqInterceptorId = http.interceptors.request.use((config) => {
          // Respect per-call overrides but add defaults
          config.withCredentials = config.withCredentials ?? withCreds;
          const auth = getAuth();
          const hdr = authHeaderBuilder(auth?.tokens);
          config.headers = { ...(config.headers || {}), ...hdr };
          return config;
        });
        http.__auth_interceptor_installed__ = true;
        http.__auth_interceptor_id__ = reqInterceptorId;
      }
    } catch (_) {
      // ignore if axios variant doesn't support interceptors
    }
  }

  // ---- raw HTTP calls (no React) ----
  async function login(payload) {
    const { data } = await http.post(url(endpoints.login), payload, { withCredentials: withCreds });
    const mapped = responseAdapter(data);
    const scope = rememberSelector(payload) ? "local" : "session";
    setAuth(mapped, scope);
    return mapped; // { tokens, user }
  }

  async function getMe() {
    const { data } = await http.get(url(endpoints.me), { withCredentials: withCreds });
    return data;
  }

  async function logout() {
    try {
      await http.post(url(endpoints.logout), {}, { withCredentials: withCreds });
    } finally {
      clearAuth();
    }
  }

  async function refresh() {
    if (!endpoints.refresh) return null;
    const { data } = await http.post(url(endpoints.refresh), {}, { withCredentials: withCreds });
    const mapped = responseAdapter(data);
    const prev = getAuth();
    const scope = prev ? (localStorage.getItem(`${ns}:auth`) ? "local" : "session") : "session";
    setAuth({ ...(prev || {}), ...mapped }, scope);
    return mapped;
  }

  return {
    // low-level methods
    login,
    getMe,
    logout,
    refresh,
    // token helpers
    getAuth,
    setAuth,
    clearAuth,
    // convenience header generator (if you don't install interceptors)
    authHeader: () => authHeaderBuilder(getAuth()?.tokens),
  };
}

/* ------------------------ React Query hooks ------------------------ */

export function useMe(api) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.getMe(),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useLogin(api) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.login(payload),
    onSuccess: () => {
      // Ensure user data auto-refreshes after successful login
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout(api) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      // Clear cached "me" so UI reacts immediately
      qc.removeQueries({ queryKey: ["me"], exact: false });
    },
  });
}
