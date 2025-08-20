import axios from "axios";

export function createHttp(cfg) {
  const api = axios.create({
    baseURL: cfg.baseURL,
    timeout: cfg.timeout != null ? cfg.timeout : 15000,
    headers: cfg.headers || {},
  });

  // Attach Authorization + X-Tenant on every request
  api.interceptors.request.use((req) => {
    const token = cfg.getAccessToken && cfg.getAccessToken();
    if (token) req.headers["Authorization"] = `Bearer ${token}`;
    const tenant = cfg.getTenant && cfg.getTenant();
    if (tenant) req.headers["X-Tenant"] = tenant;
    return req;
  });

  const attempts = cfg.retry?.attempts || 0;
  const backoff = cfg.retry?.backoffMs || 0;

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = error.config || {};
      const status = error.response && error.response.status;
      const method = (config.method || "get").toLowerCase();
      const isGet = method === "get";

      // auth errors → let engine/router decide
      if (status === 401 || status === 403) {
        if (cfg.onAuthError) cfg.onAuthError(error);
      }

      const shouldRetry =
        isGet && attempts > 0 && (!status || (status >= 500 && status < 600));

      const retryCount = config.__retryCount || 0;
      if (shouldRetry && retryCount < attempts) {
        config.__retryCount = retryCount + 1;
        if (backoff) {
          await new Promise((r) => setTimeout(r, backoff * (retryCount + 1)));
        }
        return api(config);
      }

      return Promise.reject(normalizeError(error));
    }
  );

  return api;
}

function normalizeError(err) {
  const status = err.response && err.response.status;
  const data = err.response && err.response.data;
  const message =
    (data && (data.message || (data.error && data.error.message))) ||
    err.message ||
    "Request failed";
  const code = (data && data.code) || status || err.code;
  return { message, code, status, details: data };
}
