import axios from "axios";

/**
 * Factory that returns a preconfigured Axios instance.
 * cfg: { baseURL?: string, auth?: { endpoints?: { refresh?: string } } }
 * storage: optional VersionedStorage with get/set/remove
 */
export default function createHttp(cfg = {}, storage) {
  let isRefreshing = false;
  let refreshPromise = null;
  const queue = [];
  let refreshFailed = false;

  const apiBase = cfg.http.baseURL || "";
  const refreshPath = (cfg.auth && cfg.auth.endpoints && cfg.auth.endpoints.refresh) || "/auth/refresh";
  const refreshURL = new URL(refreshPath, apiBase).toString();

  function getAccessToken() {
    const saved = storage?.get?.("auth");
    return saved?.tokens?.accessToken;
  }

  function setTokens(tokens) {
    if (!storage) return;
    if (tokens) {
      const saved = storage.get("auth") || {};
      storage.set("auth", { ...saved, tokens });
    } else {
      storage.remove("auth");
    }
  }

  function enqueue(fn) {
    queue.push(fn);
  }
  function flush(token) {
    while (queue.length) {
      const fn = queue.shift();
      try { fn(token); } catch {}
    }
  }

  const instance = axios.create({
    baseURL: apiBase,        // single API base
    withCredentials: true,   // needed if you use httpOnly cookies for refresh
  });

  // expose getter (handy for hooks to gate queries)
  instance.getAccessToken = getAccessToken;

  // Attach latest token on every request
  instance.interceptors.request.use((req) => {
    const token = getAccessToken();
    if (token) {
      req.headers = { ...(req.headers || {}), Authorization: `Bearer ${token}` };
    } else if (req.headers && req.headers.Authorization) {
      delete req.headers.Authorization; // avoid sending stale header
    }
    return req;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      const original = error?.config || {};
      // prevent infinite retry loops
      if (original._retry) {
        return Promise.reject(error);
      }

      // if we've already attempted refresh and it failed, bail out early
      if (refreshFailed && status === 401) {
        // clear tokens and notify app to logout
        setTokens(undefined);
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
          window.dispatchEvent(new CustomEvent("auth:forbidden", { detail: { message: "Refresh failed", status } }));
        }
        return Promise.reject(error);
      }
      // Handle 403 "Token has been revoked" (or similar) early:
      try {
        const respData = error?.response?.data;
        const msg = (respData && respData.message) ? String(respData.message).toLowerCase() : "";
        if (status === 403 && msg.includes("revoked")) {
          // clear tokens from storage
          setTokens(undefined);
          // emit a global event so the app can handle logout/redirect
          if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("auth:forbidden", { detail: { message: respData?.message, status } }));
         }
          // reject with the original error so callers can handle if needed
          return Promise.reject(error);
        }
      } catch (e) {
        // swallow any handling errors and continue below
      }
      // Build full request URL and check same-origin
      const reqURL = new URL(
        original.url || "",
        original.baseURL || apiBase || (typeof window !== "undefined" ? window.location.origin : "http://localhost")
      ).toString();

      const sameOrigin = new URL(reqURL).origin === new URL(apiBase || reqURL).origin;
      const isRefreshCall = reqURL === refreshURL;

      if (status === 401 && sameOrigin && !isRefreshCall) {
        original._retry = true;
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const { data } = await axios.post(refreshURL, {}, { withCredentials: true });
              const token = data?.tokens?.accessToken || data?.token;
              const refreshToken = data?.tokens?.refreshToken || data?.refreshToken;
              if (token) {
                setTokens({ accessToken: token, refreshToken });
                refreshFailed = false;
              }
              return token;
            } catch (e) {
              refreshFailed = true;
              // clear tokens from storage
              setTokens(undefined);
              return undefined;
            } finally {
              isRefreshing = false;
            }
          })();
        }

        const token = await refreshPromise.catch(() => undefined);

        return new Promise((resolve, reject) => {
          enqueue(async (t) => {
            if (!t) {
              // refresh failed -> emit forbidden and reject
              setTokens(undefined);
              if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                window.dispatchEvent(new CustomEvent("auth:forbidden", { detail: { message: "Refresh failed", status } }));
              }
              return reject(error);
            }
            try {
              const retryCfg = {
                ...original,
                headers: { ...(original.headers || {}), Authorization: `Bearer ${t}` },
              };
              // Use same instance so interceptors stay applied
              const resp = await instance.request(retryCfg);
              resolve(resp);
            } catch (e) {
              reject(e);
            }
          });
          flush(token);
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
