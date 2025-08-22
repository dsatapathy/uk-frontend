import axios from "axios";

// Assume these exist in your code:
let isRefreshing = false;
let refreshPromise = null;
const queue = [];

function getAccessToken() {
  // Retrieve stored token (localStorage/sessionStorage/custom logic)
}

function setTokens(tokens) {
  // Save tokens to storage (or clear if undefined)
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

// Assume cfg is your config object with auth endpoints
// Example: const cfg = { auth: { endpoints: { baseURL: "http://localhost:3001", refresh: "/api/auth/refresh" } } };

const createHttp = axios.create();

createHttp.interceptors.request.use((req) => {
  const token = getAccessToken();
  if (token) {
    req.headers = { ...(req.headers || {}), Authorization: `Bearer ${token}` };
  }
  return req;
});

createHttp.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const isAuthHost = (error.config?.baseURL ?? "").includes(cfg.auth.endpoints.baseURL);

    if (status === 401 && isAuthHost) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const { data } = await axios.post(
              new URL(cfg.auth.endpoints.refresh, cfg.auth.endpoints.baseURL).toString(),
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
              headers: { ...(error.config.headers || {}), Authorization: `Bearer ${t}` }
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

export default createHttp;
