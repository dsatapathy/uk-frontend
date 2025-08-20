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
  redirects: [{ from: "/", to: "/bpa" }]
});
