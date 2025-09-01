export function buildAuthClient(http, cfg, storage) {
    const baseURL = cfg.baseURL || "";
    const withCreds = typeof cfg.withCredentials === "boolean" ? cfg.withCredentials : true;
  
    const toURL = (p) => (baseURL ? new URL(p, baseURL).toString() : p);
  
    // Interceptors (optional, once per axios instance)
    if (cfg.installInterceptors && http && http.interceptors) {
      if (!http.__auth_interceptor_installed__) {
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
        http.__auth_interceptor_installed__ = true;
      }
    }
  
    return {
      url: toURL,
      post: (p, body) => http.post(toURL(p), body, { withCredentials: withCreds }),
      get: (p, opts) => http.get(toURL(p), { withCredentials: withCreds, ...(opts || {}) }),
    };
  }