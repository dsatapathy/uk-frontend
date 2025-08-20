import { start } from "@gov/ui-engine";
start({
  target: "#root",
  base: "/uk-portal",

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

  // --- Authentication + Captcha ---
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

  // --- HTTP / API defaults used by engine & modules ---
  http: {
    baseURL: "/api",
    timeout: 15000,
    headers: { "X-Tenant": "odisha" },
    retry: { attempts: 2, backoffMs: 300 },
    cache: { ttlMs: 60_000 },

    // named endpoints that the engine can use by key
    endpoints: {
      "masters.sidebar": { url: "/masters/sidebar", method: "GET" },
      "masters.modules": { url: "/masters/modules", method: "GET" }
    },

    // engine auto-attaches Authorization from auth.tokens
    authHeader: (tokens) => tokens?.access ? `Bearer ${tokens.access}` : null
  },

  // --- Global layout (landing page frame) ---
  layout: {
    component: "Shell",
    header: {
      show: true,
      items: [
        { type: "brand", text: "SUJOG" },
        { type: "spacer" },
        { type: "notifications", component: "NotificationsBell" },
        { type: "profile", component: "UserMenu" }
      ]
    },

    sidebar: {
      show: true,
      collapsible: true,

      // ✅ Source from API with defaults + merge rules
      source: {
        endpoint: "masters.sidebar",
        params: {
          tenant: "{app.tenant}",
          locale: "{i18n.defaultLocale}",
          role: "{auth.user.role}"
        },
        cache: {
          key: "sidebar::{tenant}::{role}::{locale}",
          ttlMs: 5 * 60_000,
          staleWhileRevalidate: true
        },
        rbacMode: "client", // or "server" if API pre-filters
        mapping: {
          list: "$.items",
          fields: {
            key: "$.code",
            text: "$.label",
            to: "$.route",
            icon: "$.icon",
            visibleWhen: {
              roles: "$.roles",
              perms: "$.permissions",
              expr: "$.expr"
            }
          },
          i18n: { field: "text", treatAsKey: false } // set true if label is a key
        }
      },

      // Default nav used until API arrives OR if it errors
      defaults: [
        { key: "home", text: "Home", to: "/",  icon: "Home",
          visibleWhen: { roles: ["EMPLOYEE","ADMIN"] } },
        { key: "bpa",  text: "BPA",  to: "/bpa", icon: "Package",
          visibleWhen: { perms: ["bpa:view"] } },
        { key: "tl",   text: "Trade", to: "/tl", icon: "Store",
          visibleWhen: { roles: ["ADMIN"] } },
        { key: "wns",  text: "Water", to: "/ws", icon: "Droplet",
          visibleWhen: { expr: "user.department === 'Water'" } }
      ],

      // how fetched items combine with defaults
      mergeStrategy: "replace", // "replace" | "append" | "prepend"
      placeholders: [{ type: "skeleton", count: 6 }],
      onErrorFallback: "defaults" // or [] for empty sidebar on error
    }
  },

  // --- Modules: source from API with local fallbacks ---
  // Engine will fetch a list of enabled modules and then resolve loaders.
  // For known modules, we provide a local registry as defaults.
  modules: {
    source: {
      endpoint: "masters.modules",
      params: { tenant: "{app.tenant}" },
      cache: { key: "modules::{tenant}", ttlMs: 5 * 60_000 },
      // Expected API shape example:
      // { "modules": [ { "key":"bpa", "basePath":"/bpa" }, ... ] }
      mapping: {
        list: "$.modules",
        fields: {
          key: "$.key",
          basePath: "$.basePath"
          // optional: "$.remote" if using Module Federation remotes
        }
      },
      // If API only tells which modules are enabled,
      // engine resolves loaders by key using defaults.registry below
      resolveLoaderByKey: true
    },

    // Local defaults = guaranteed loaders so app still works offline / on error
    defaults: {
      list: [
        { key: "bpa", basePath: "/bpa", rbac: { perms: ["bpa:*"] } },
        { key: "tl",  basePath: "/tl",  rbac: { roles: ["ADMIN"] } },
        { key: "wns", basePath: "/ws" }
      ],
      registry: {
        // key -> loader function (tree‑shaken dynamic import)
        bpa: () => import("@gov/mod-bpa"),
        tl:  () => import("@gov/mod-tl"),
        wns: () => import("@gov/mod-wns")
      },
      // If API provides extra modules unknown to host,
      // you can choose to ignore, or allow remote loaders (MF)
      allowUnknownKeys: false
    },

    // How API list merges with defaults.list
    mergeStrategy: "enabled-first", // "replace" | "append" | "enabled-first"
    // "enabled-first": keep order from API; include any default not mentioned at the end
    onErrorFallback: "defaults" // use defaults if API fails
  },

  // --- Route redirects ---
  redirects: [
    { from: "/", to: "/bpa" },
    { from: "/home", to: "/" }
  ],

  // --- Feature flags / A-B testing ---
  flags: {
    prefetchAllOnIdle: true,
    showBetaBadges: false
  },

  // --- Internationalization ---
  i18n: {
    defaultLocale: "en-IN",
    fallbackLocale: "en",
    bundles: [ "/i18n/en.json", "/i18n/hi.json" ]
  },

  // --- Telemetry / Sentry / audit ---
  telemetry: {
    sentryDsn: "<dsn>",
    sampleRate: 0.2,
    logLevel: "info",
    auditEvents: true
  },

  // --- Hooks (engine handles fetching; these are just signals) ---
  hooks: {
    onBootstrap:   ({ app }) => { /* no fetch here; engine owns it */ },
    onRouteChange: (loc, action) => {},
    beforeModuleRegister: (key) => {},
    afterModuleRegister:  (key) => {},
    renderModuleLoading:  ({ moduleKey }) => null,

    onLoginSuccess: (ctx) => {
      // optional: hint engine to refresh sidebar/modules after login
      ctx.engine?.refresh?.("sidebar");
      ctx.engine?.refresh?.("modules");
    },
    onLogout: () => {}
  }
});

