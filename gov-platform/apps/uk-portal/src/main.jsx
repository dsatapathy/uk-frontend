import { start } from "@gov/ui-engine";
import { moduleMap } from "./moduleRegistry";
import landingLogo from "../public/assets/images/landing_logo.png";
// build the route list to match enabled modules
const enabled = Object.keys(moduleMap);
const basePaths = { auth: "/", landing: "/landing", bpa: "/bpa", tl: "/tl", wns: "/wns" };
const defaultModules = enabled.map(k => ({ key: k, basePath: basePaths[k] || `/${k}` }));
const moduleRegistry = Object.fromEntries(defaultModules.map((m) => [m.key, moduleMap[m.key]]));
// Only defaults/registry are used; source/endpoints are ignored here.
start({
  target: "#root",
  base: "/uk-portal/",
  brand: { logo : landingLogo , title: "UK Portal" },
  layout: { component: "AuthBlank" },
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
  http: { baseURL: "http://localhost:3001/api/" },
  auth: {
    strategy: "jwt",
    login: {
      path: "/login",
      title: "Employee Sign-in",
      fields: ["username", "password"],
      captcha: { provider: "recaptcha", siteKey: "YOUR_PUBLIC_KEY", action: "login" }
    },
    publicPaths: ["/register", "/forgot", "/otp"],
    endpoints: {
      login: "auth/login",
      refresh: "auth/refresh",
      logout: "auth/logout",
      me: "auth/me"
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
      hasAllPerms: (ctx, perms) => perms.every((p) => ctx.user.permissions?.includes(p))    },
    onAuthFail: "/login"
  },
  publicPaths: ["/register"],
  modules: {
    defaults: {
      list: defaultModules,
      registry: moduleRegistry
    }
  },
  redirects: [{ from: "/", to: "/bpa" }]
});
