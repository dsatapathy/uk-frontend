// utils/icons.jsx
import React from "react";

/** 1) Explicit, tree-shakable loaders */
const LOADERS = {
  home:        () => import("@mui/icons-material/Home"),
  layers:      () => import("@mui/icons-material/Layers"),
  assessment:  () => import("@mui/icons-material/Assessment"),
  settings:    () => import("@mui/icons-material/Settings"),
  openinnew:   () => import("@mui/icons-material/OpenInNew"),
  logout:      () => import("@mui/icons-material/Logout"),
  notifications: () => import("@mui/icons-material/Notifications"),
  inbox:       () => import("@mui/icons-material/Inbox"),
  menu:        () => import("@mui/icons-material/Menu"),
  search:      () => import("@mui/icons-material/Search"),
  close:       () => import("@mui/icons-material/Close"),
  person:      () => import("@mui/icons-material/Person"),
  campaign:    () => import("@mui/icons-material/Campaign"),
  edit:        () => import("@mui/icons-material/Edit"),
};

/** 2) Aliases */
const ALIASES = {
  bell: "notifications",
  notification: "notifications",
  mail: "inbox",
  messages: "inbox",
  user: "person",
  account: "person",
  report: "assessment",
  external: "openinnew",
};

const normalize = (n) => String(n || "").trim().toLowerCase();
const resolveKey = (name) => {
  const n = normalize(name);
  return LOADERS[n] ? n : ALIASES[n] || n;
};

/** 3) Cache for lazy components and in-flight imports */
const lazyCache = new Map();     // key -> React.LazyExoticComponent
const importCache = new Map();   // key -> Promise (optional prefetch)

/** Get (or create + cache) a lazy component for an icon key */
function getLazyIconForKey(key) {
  if (!key) return null;
  if (lazyCache.has(key)) return lazyCache.get(key);
  const loader = LOADERS[key];
  if (!loader) return null;
  const lazyComp = React.lazy(() => {
    // also cache the import promise so prefetch() and renders share it
    const p = importCache.get(key) || loader();
    importCache.set(key, p);
    return p;
  });
  lazyCache.set(key, lazyComp);
  return lazyComp;
}

/** Optional: prefetch one or many icons ahead of time */
export function prefetchIcons(...names) {
  names.forEach((name) => {
    const key = resolveKey(name);
    if (!key || importCache.has(key)) return;
    const loader = LOADERS[key];
    if (loader) importCache.set(key, loader());
  });
}

/** 4) Icon component using the cache */
export function Icon({ name, fontSize = "small", ...props }) {
  const key = resolveKey(name);
  const LazyIcon = getLazyIconForKey(key);
  if (!LazyIcon) return null;

  return (
    <React.Suspense fallback={null}>
      <LazyIcon fontSize={fontSize} {...props} />
    </React.Suspense>
  );
}

/** 5) Back-compat helper */
export const getIcon = (name, props = {}) => <Icon name={name} {...props} />;
