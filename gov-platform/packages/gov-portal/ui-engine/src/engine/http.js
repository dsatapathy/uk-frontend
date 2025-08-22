// src/engine/http.js
import { createHttp, setHttp, VersionedStorage } from "@gov/data";
export function initHttp(config, appInfo, history) {
  // Build a versioned, namespaced storage keyed by tenant (mirrors to session if enabled)
  const storage = new VersionedStorage({
    version: config?.auth?.storage?.version || "v1",
    namespace: `${appInfo?.tenant || "default"}-${config?.auth?.storage?.namespace || "uk-portal"}`,
    mirrorToSession: config?.auth?.storage?.mirrorToSession ?? true,
    ttlSeconds: config?.auth?.storage?.ttlSeconds,
  });

  // Create the Axios instance with refresh queue + retries
  const http = createHttp(config, storage);

  // Optional: centralize auth-fail navigation
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
  setHttp(http);
  return http;
}
