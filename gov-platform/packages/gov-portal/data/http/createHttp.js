import axios from "axios";

// Factory that returns a preconfigured Axios instance.
// `cfg` is the host application's config object containing auth endpoints.
// `storage` is an optional VersionedStorage used for persisting tokens.
export default function createHttp(cfg = {}, storage) {
  let isRefreshing = false;
  let refreshPromise = null;
  const queue = [];

  const authBase = cfg?.auth?.endpoints?.baseURL || "";

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

  function queueRequest(fn) {
    queue.push(fn);
  }

  function flushQueue(token) {
    while (queue.length) {
      const fn = queue.shift();
      fn(token);
    }
  }

  const instance = axios.create({
    baseURL: authBase,
    withCredentials: true,
  });

  instance.interceptors.request.use((req) => {
    const token = getAccessToken();
    if (token) {
      req.headers = { ...(req.headers || {}), Authorization: `Bearer ${token}` };
    }
    return req;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;
      const isAuthHost = (error.config?.baseURL ?? "").includes(authBase);

      if (status === 401 && isAuthHost) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const { data } = await axios.post(
                new URL(cfg?.auth?.endpoints?.refresh || "", authBase).toString(),
                {},
                { withCredentials: true }
              );
              const token = data?.accessToken || data?.token;
              const refreshToken = data?.refreshToken;
              if (token) setTokens({ accessToken: token, refreshToken });
              return token;
            } catch (e) {
              setTokens(undefined);
              throw e;
            } finally {
              isRefreshing = false;
            }
          })();
        }

        const token = await refreshPromise.catch(() => undefined);
        return new Promise((resolve, reject) => {
          queueRequest(async (t) => {
            if (!t) return reject(error);
            try {
              const cfgRetry = {
                ...error.config,
                headers: { ...(error.config.headers || {}), Authorization: `Bearer ${t}` },
              };
              const resp = await axios(cfgRetry);
              resolve(resp);
            } catch (e) {
              reject(e);
            }
          });
          flushQueue(token);
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
}