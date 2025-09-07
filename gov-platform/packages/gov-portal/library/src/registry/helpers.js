// helpers.js
import { asDefault, LazyWrap, registerComponent, lazyModule } from "@gov/core";
import { ensureOnce } from "@gov/core";

const MANIFEST = {
  ...import.meta.glob("../components/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../form/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../atoms/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../molecules/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../organisms/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../icons/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../utils/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../layouts/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../lazyFns/**/*.{jsx,tsx,js,ts}"),
  ...import.meta.glob("../constants/**/*.{jsx,tsx,js,ts}"),
};

const normalize = (p) => String(p).replace(/\\/g, "/").replace(/^\.\/+/, "");

// Build an index once (module scope) so we don't scan on every lookup
const INDEX = new Map();
for (const [k, loader] of Object.entries(MANIFEST)) {
  const n = normalize(k);
  INDEX.set(n, loader);
  INDEX.set("./" + n, loader);
  INDEX.set("../" + n, loader);
}

// Optional: support suffix matches without scanning the whole manifest each time
// Build a secondary index by basename (last N segments)
const SUFFIX_INDEX = new Map(); // key: "atoms/AppButton.jsx" → [loaders...]
for (const k of INDEX.keys()) {
  const parts = k.split("/");
  for (let i = 1; i <= 3 && i <= parts.length; i++) { // last 1..3 segments
    const suf = parts.slice(-i).join("/");
    const arr = SUFFIX_INDEX.get(suf) || [];
    if (arr.length === 0 || arr[arr.length - 1] !== INDEX.get(k)) {
      arr.push(INDEX.get(k));
    }
    SUFFIX_INDEX.set(suf, arr);
  }
}

const warned = new Set();
function warnOnce(msg) {
  if (!warned.has(msg)) {
    warned.add(msg);
    console.warn(msg);
  }
}

function resolveFromManifest(relPath) {
  const p = normalize(relPath);
  console.log(`resolveFromManifest: looking for "${relPath}" normalized to "${p}"`);
  // Fast exact matches
  const exact = INDEX.get(p) || INDEX.get("./" + p) || INDEX.get("../" + p);
  if (exact) return exact;

  // Optional suffix fallback (avoid O(n) scan)
  const list = SUFFIX_INDEX.get(p);
  if (list?.length === 1) return list[0];
  if (list?.length > 1) {
    warnOnce(`resolveFromManifest: ambiguous suffix "${relPath}" matched ${list.length} files`);
    return list[0]; // or throw to force exact paths
  }

  warnOnce(`resolveFromManifest: no match for "${relPath}". Add it to MANIFEST or use an exact path.`);
  return null;
}

// Public helpers (unchanged call sites)
const loaderCache = new Map();

export const makeLoader = (relPath, exportName = "default") => {
  const key = `${relPath}::${exportName}`;  
  // Return from cache if exists
  if (loaderCache.has(key)) {
    return loaderCache.get(key);
  }
  const loader = resolveFromManifest(relPath);
  if (!loader) {
    throw new Error(`Unknown dynamic import "${relPath}".`);
  }
  // Create wrapped loader once and store in cache
  const wrappedLoader = asDefault(() => loader(), exportName);
  loaderCache.set(key, wrappedLoader);
  return wrappedLoader;
};

export const lazy = (relPath) => {
  const loader = resolveFromManifest(relPath);
  if (!loader) throw new Error(`Unknown dynamic import "${relPath}".`);
  return lazyModule(() => loader());
};

export const registerAll = (defs) => {
  defs.forEach(([name, second, maybeExport]) => {
    const loader =
      typeof second === "function" ? second : makeLoader(second, maybeExport);
    registerComponent(name, LazyWrap(loader, name));
  });
};

// Optional: name-level de-dupe (belt & suspenders)
const seenNames = new Set();

export function registerAllOnce(key, defs) {
  ensureOnce(key, () => {
    defs.forEach(([name, second, maybeExport]) => {
      if (seenNames.has(name)) return; // skip duplicates across bundles
      const loader =
        typeof second === "function" ? second : makeLoader(second, maybeExport);
      registerComponent(name, LazyWrap(loader, name));
      seenNames.add(name);
    });
  });
}
