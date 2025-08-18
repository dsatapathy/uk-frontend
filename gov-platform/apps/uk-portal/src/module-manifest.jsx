// No imports here — just loader fns.
// Each loader returns the dynamic import *when called* (on first route visit).
export const manifests = [
    { key: "bpa", basePath: "/bpa",  loader: () => import("@gov/mod-bpa") },
    { key: "tl",  basePath: "/tl",   loader: () => import("@gov/mod-tl")  }
  ];
  