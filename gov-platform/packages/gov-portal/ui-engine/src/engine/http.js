// src/engine/http.js
import { createHttp, setHttp } from "@gov/data";

export function initHttp(config, appInfo, history) {
  const httpCfg = config.http || { baseURL: "/api", timeout: 15000 };
  const http = createHttp({
    baseURL: httpCfg.baseURL || "/api",
    timeout: httpCfg.timeout || 15000,
    headers: httpCfg.headers || {},
    retry: httpCfg.retry || { attempts: 2, backoffMs: 300 },
    getAccessToken: () => {
      const { tokens = {}, prefix = "" } = config.auth || {};
      const key = tokens?.accessKey ? `${prefix || ""}${tokens.accessKey}` : null;
      return key ? localStorage.getItem(key) : null;
    },
    getTenant: () => appInfo?.tenant || "default",
    onAuthError: () => {
      const failPath = config.auth?.onAuthFail;
      if (failPath && history.location.pathname !== failPath) {
        history.push(failPath);
      }
    },
  });
  setHttp(http);
  return http;
}
