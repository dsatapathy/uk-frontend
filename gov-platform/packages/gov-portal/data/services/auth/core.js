export function makeAuthCore(httpClient, cfg, storage) {
    const ep = cfg.endpoints || {};
    const adapt = cfg.responseAdapter || ((d) => ({ tokens: { accessToken: d?.token, tokenType: "Bearer" }, user: d?.user }));
    const rememberSelector = cfg.rememberSelector || ((p) => !!p?.remember);
    const ns = cfg.storageNamespace || "gov-portal";
  
    function setAuth(auth, scope) { storage.set("auth", auth, scope); }
    function getAuth() { return storage.get("auth"); }
    function clearAuth() { storage.remove("auth"); }
  
    async function login(payload) {
      const { data } = await httpClient.post(ep.login, payload);
      const mapped = adapt(data);
      const scope = rememberSelector(payload) ? "local" : "session";
      setAuth(mapped, scope);
      return mapped;
    }
  
    async function getMe() {
      const { data } = await httpClient.get(ep.me);
      return data;
    }
  
    async function logout() {
      try { await httpClient.post(ep.logout, {}); } finally { clearAuth(); }
    }
  
    async function refresh() {
      if (!ep.refresh) return null;
      const { data } = await httpClient.post(ep.refresh, {});
      const mapped = adapt(data);
      const prev = getAuth();
      const isLocal = !!localStorage.getItem(`${ns}:auth`);
      const scope = prev ? (isLocal ? "local" : "session") : "session";
      setAuth({ ...(prev || {}), ...mapped }, scope);
      return mapped;
    }
  
    return { login, getMe, logout, refresh, getAuth, setAuth, clearAuth };
  }