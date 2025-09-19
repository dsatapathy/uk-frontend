export function buildAuthClient(http, cfg, storage) {
  const baseURL = cfg.baseURL || "";
  const withCreds =
    typeof cfg.withCredentials === "boolean" ? cfg.withCredentials : true;

  const toURL = (p) => (baseURL ? new URL(p, baseURL).toString() : p);

  // Interceptors (optional, once per axios instance)
  if (cfg.installInterceptors && http && http.interceptors) {
    if (!http.__auth_interceptor_installed__) {
      // ---- Request interceptor: inject auth header + withCredentials ----
      http.interceptors.request.use((req) => {
        req.withCredentials = req.withCredentials ?? withCreds;
        try {
          const auth = storage.get("auth");
          const tokens = auth?.tokens;
          const header = cfg.authHeader ? cfg.authHeader(tokens) : {};
          req.headers = { ...(req.headers || {}), ...header };
        } catch (_) {}
        return req;
      });

      // ---- Response interceptor: unwrap { data: ... } envelopes ----
      http.interceptors.response.use(
        (res) => {
          // If backend returns { success, message, data: {...} }, unwrap to inner body
          if (
            res &&
            res.data &&
            typeof res.data === "object" &&
            Object.prototype.hasOwnProperty.call(res.data, "data")
          ) {
            res.data = res.data.data;
          }
          return res;
        },
        (error) => {
          // Also normalize error responses if they use the same envelope
          const resp = error && error.response;
          if (
            resp &&
            resp.data &&
            typeof resp.data === "object" &&
            Object.prototype.hasOwnProperty.call(resp.data, "data")
          ) {
            resp.data = resp.data.data;
          }
          return Promise.reject(error);
        }
      );

      http.__auth_interceptor_installed__ = true;
    }
  }

  return {
    url: toURL,
    post: (p, body) =>
      http.post(toURL(p), body, { withCredentials: withCreds }),
    get: (p, opts) =>
      http.get(toURL(p), { withCredentials: withCreds, ...(opts || {}) }),
  };
}
