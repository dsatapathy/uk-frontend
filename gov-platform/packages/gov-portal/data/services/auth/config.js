export const defaultAuthConfig = {
    baseURL: "", // e.g. "https://api.example.com"
    endpoints: {
      login: "/api/auth/login",
      me: "/api/auth/me",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh", // optional
    },
    withCredentials: true,
    storageNamespace: "gov-portal",
    installInterceptors: true,
  
    // Decide local vs session based on login payload
    rememberSelector: (payload) => !!payload?.remember,
  
    // Build Authorization header from tokens
    authHeader: (tokens) =>
      tokens?.accessToken
        ? { Authorization: `${tokens?.tokenType || "Bearer"} ${tokens?.accessToken}` }
        : {},
  
    // Normalize raw backend response → { tokens, user }
    responseAdapter: (data) => ({
      tokens: {
        accessToken: data?.accessToken || data?.token,
        refreshToken: data?.refreshToken,
        tokenType: data?.tokenType || "Bearer",
      },
      user: data?.user,
    }),
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