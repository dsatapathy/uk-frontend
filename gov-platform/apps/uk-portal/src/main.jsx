import { start } from "@gov/ui-engine";

// Only defaults/registry are used; source/endpoints are ignored here.
start({
  target: "#root",
  base: "/uk-portal",
  layout: { component: "Shell" },
  app: {
    name: "UK Portal",
    logo: "/assets/uk-logo.svg",
    favicon: "/assets/uk-fav.ico",
    version: "1.2.3",
    tenant: "uttar-pradesh", // or "odisha" etc.
    locale: "en-IN"
  },

  theme: {
    palette: { mode: "light", primary: { main: "#0b5fff" } },
    shape: { borderRadius: 8 }
  },
  // --- Authentication ---
  auth: {
    strategy: "jwt",
    login: {
      path: "/login",
      title: "Employee Sign-in",
      fields: ["username", "password"],
      captcha: { provider: "recaptcha", siteKey: "YOUR_PUBLIC_KEY", action: "login" }
    },
    endpoints: {
      login: "/api/auth/login",
      refresh: "/api/auth/refresh",
      logout: "/api/auth/logout",
      me: "/api/auth/me"
    },
    tokens: {
      storage: "localStorage",
      accessKey: "uk.access",
      refreshKey: "uk.refresh",
      prefix: "uk-portal::"
    },
    claims: { rolePath: "user.role", permsPath: "user.permissions" },
    guards: {
      isAuthenticated: (ctx) => !!ctx.tokens.access,
      hasAnyRole: (ctx, roles) => roles.includes(ctx.user.role),
      hasAllPerms: (ctx, perms) => perms.every(p => ctx.user.permissions?.includes(p))
    },
    onAuthFail: "/login"
  },
  modules: {
    defaults: {
      list: [
        { key: "auth", basePath: "/" },
        { key: "bpa", basePath: "/bpa" },
        { key: "tl",  basePath: "/tl"  },
      ],
      registry: {
        auth: () => import("@gov/mod-auth"),
        bpa: () => import("@gov/mod-bpa"),
        tl:  () => import("@gov/mod-tl"),
      }
    }
  },
  redirects: [{ from: "/", to: "/login" }]
});
