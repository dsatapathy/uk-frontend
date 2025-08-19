import { start } from "@gov/ui-engine";
start({
  target: "#root",
  base: "/uk-portal",
  modules: [
    { key: "bpa", basePath: "/bpa", loader: () => import("@gov/mod-bpa") },
    { key: "tl",  basePath: "/tl",  loader: () => import("@gov/mod-tl")  },
    { key: "wns", basePath: "/ws",  loader: () => import("@gov/mod-wns") },
  ],
  redirects: [{ from: "/", to: "/bpa" }],
  auth: { strategy: "none" }, // or jwt/custom/oidc
  theme: { palette: { mode: "light" } }
});
