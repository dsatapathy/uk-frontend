// src/engine/http.js
import { createHttp, setHttp, VersionedStorage } from "@gov/data";

export function initHttp(config, appInfo, history) {
  // One versioned, tenant-namespaced storage
  const storage = new VersionedStorage({
    version: config?.auth?.storage?.version || "v1",
    // namespace: `${appInfo?.tenant || "default"}-${config?.auth?.storage?.namespace || "uk-portal"}`,
    namespace: "uk-portal",
    mirrorToSession: config?.auth?.storage?.mirrorToSession ?? true,
    ttlSeconds: config?.auth?.storage?.ttlSeconds,
  });

  // Normalize base and refresh path so URL() composes correctly
  const baseURL = (config?.auth?.endpoints?.baseURL || config?.auth?.baseURL || "").replace(/\/+$/, "");
  // Prefer path without leading slash so it appends after /api
  const refreshPath = (config?.auth?.endpoints?.refresh || "/api/auth/refresh").replace(/^\/+/, "");

  // Create the Axios instance with refresh queue + retries
  const http = createHttp(
    config,
    storage
  );

  // Optional: centralize auth-fail navigation AFTER refresh truly failed
  http.interceptors?.response?.use(
    (r) => r,
    (err) => {
      if (err?.response?.status === 401) {
        const failPath = config?.auth?.onAuthFail || config?.auth?.login?.path || "/login";
        if (history.location.pathname !== failPath) history.push(failPath);
      }
      return Promise.reject(err);
    }
  );

  // Expose globally (if your app uses http() getter elsewhere)
  setHttp(http);

  // Return both so callers can pass them down
  return { http, storage };
}
