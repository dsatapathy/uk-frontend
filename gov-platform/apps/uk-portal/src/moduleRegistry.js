// full map of lazy modules (each stays its own chunk)
const all = {
    landing: () => import("@gov/mod-landing"),
    auth:    () => import("@gov/mod-auth"),
    bpa:     () => import("@gov/mod-bpa"),
    tl:      () => import("@gov/mod-tl"),
    wns:     () => import("@gov/mod-wns"),
  };
  
  // Allow selection with VITE_ENABLED_MODULES="landing,auth,tl"
  // If missing, default to *all* in dev; lock it in prod via .env.production
  const list = (import.meta.env.VITE_ENABLED_MODULES ||
                (import.meta.env.DEV ? Object.keys(all).join(",") : ""))
    .split(",").map(s => s.trim()).filter(Boolean);
  
  export const moduleMap = Object.fromEntries(
    (list.length ? list : Object.keys(all)).map(k => [k, all[k]]).filter(([k]) => !!all[k])
  );
  
  export function resolveModule(key) {
    const loader = moduleMap[key];
    if (!loader) throw new Error(`Unknown/disabled module: ${key}`);
    return loader;
  }
  