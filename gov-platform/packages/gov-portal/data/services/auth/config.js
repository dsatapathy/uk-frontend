export const defaultAuthConfig = {
  baseURL: "", // e.g. "https://api.example.com"
  endpoints: {
    login: "v1/auth/login",
    me: "v1/auth/me",
    logout: "v1/auth/logout",
    refresh: "v1/auth/refresh",
  },
  withCredentials: true,
  storageNamespace: "uk-portal",
  installInterceptors: true,

  // Decide local vs session based on login payload
  rememberSelector: (payload) => !!payload?.remember,

  // Build Authorization header from tokens
  authHeader: (tokens) =>
    tokens?.accessToken
      ? { Authorization: `${tokens?.tokenType || "Bearer"} ${tokens?.accessToken}` }
      : {},

  // Normalize raw backend response → { tokens, user }
  responseAdapter: (raw) => {
    const body = raw?.data ?? raw; // accept both {data:{...}} and flat
    return {
      tokens: {
        accessToken: body?.tokens?.accessToken,
        refreshToken: body?.tokens?.refreshToken,
        tokenType: body?.tokens?.tokenType || "Bearer",
      },
      user: body?.user,
    };
  },
};

export function mergeAuthConfig(base, override) {
  const a = base || {};
  const b = override || {};
  return {
    ...a,
    ...b,
    endpoints: { ...(a.endpoints || {}), ...(b.endpoints || {}) },
  };
}