import { start } from "@gov/ui-engine";
import { moduleMap } from "./moduleRegistry";
import landingLogo from "../public/assets/images/landing_logo.png";
// build the route list to match enabled modules
const enabled = Object.keys(moduleMap);
const basePaths = { auth: "/login", landing: "/landing", bpa: "/bpa", member: "/member" };
const defaultModules = enabled.map(k => ({ key: k, basePath: basePaths[k] || `/${k}` }));
const moduleRegistry = Object.fromEntries(defaultModules.map((m) => [m.key, moduleMap[m.key]]));
// Only defaults/registry are used; source/endpoints are ignored here.
start({
  target: "#root",
  base: "/",
  brand: { logo: landingLogo, title: "UK Portal" },
  layout: {
    component: "AuthBlank", 
    backgroungImg: `
    /* Sharp, angled facets for the diamond-cut effect */
    linear-gradient(
      165deg,
      transparent 45%,
      var(--crystal-highlight, rgba(236, 253, 245, 0.2)) 50%, /* Sharp highlight edge */
      var(--crystal-shadow, rgba(20, 83, 45, 0.15)) 52%,       /* Subtle shadow edge */
      transparent 60%
    ),
    linear-gradient(
      -40deg,
      transparent 30%,
      var(--crystal-highlight, rgba(236, 253, 245, 0.15)) 48%, /* Second highlight facet */
      transparent 60%
    ),
    linear-gradient(
      20deg,
      transparent 40%,
      var(--crystal-shadow, rgba(20, 83, 45, 0.1)) 55%,        /* A wider, softer shadow facet */
      transparent 70%
    ),

    /* The original 3-stop base gradient for color foundation */
    linear-gradient(
      180deg,
      var(--sidebar-bg-top, #aed581) 0%,    /* Light Banana Leaf Green */
      var(--sidebar-bg-mid, #9ccc65) 46%,     /* Medium Banana Leaf Green */
      var(--sidebar-bg-bottom, #8bc34a) 100%  /* Richer Banana Leaf Green */
    )
  ` },
  app: {
    name: "UK Portal",
    logo: "/assets/uk-logo.svg",
    favicon: "/assets/uk-fav.ico",
    version: "1.2.3",
    tenant: "uttar-pradesh", // or "odisha" etc.
    locale: "en-IN"
  },

  theme: {
    palette: {
      mode: "light",
      primary: { main: "#16a34a" },
      secondary: { main: "#15803d", contrastText: "#ffffff" },
      background: { default: "#f9fafb" },
    },
    shape: { borderRadius: 8 }
  },
  // --- Authentication ---
  http: { baseURL: "http://reap-mis-myapp-ukgv.casacam.net:9090/reap-mis/api/" },
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
      login: "v1/auth/login",
      refresh: "v1/auth/refresh",
      logout: "v1/auth/logout",
      me: "v1/auth/me"
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
      hasAllPerms: (ctx, perms) => perms.every((p) => ctx.user.permissions?.includes(p))
    },
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
