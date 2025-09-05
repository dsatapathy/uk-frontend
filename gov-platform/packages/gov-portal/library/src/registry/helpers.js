import { asDefault, LazyWrap, registerComponent, lazyModule } from "@gov/core";

/**
 * Build a manifest of every lazily-loadable module so Vite can statically
 * include/split them at build time. Add folders here as needed.
 * Keys are file paths relative to THIS file.
 */
const MANIFEST = {
  // relative imports used in your code, e.g. "../components/AuthCard.jsx"
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

/**
 * Try to find a loader function in the MANIFEST for a requested relative path.
 * Accepts "../components/X.jsx" OR "components/X.jsx" and even matches by suffix.
 */
function resolveFromManifest(relPath) {
  const p = normalize(relPath);
  const variants = new Set([p, "./" + p, "../" + p]);

  for (const key of Object.keys(MANIFEST)) {
    const k = normalize(key);
    if (variants.has(k) || k.endsWith("/" + p)) return MANIFEST[key];
  }
  return null;
}

/**
 * === Public helpers (unchanged calling style) ================================
 */

/** Create a React.lazy-compatible loader for a given file path + optional export */
export const makeLoader = (relPath, exportName = "default") => {
  const loader = resolveFromManifest(relPath);
  if (!loader) {
    throw new Error(
      `Unknown dynamic import "${relPath}". Add it to MANIFEST globs in helpers.js.`
    );
  }
  // asDefault expects a function returning a module Promise
  return asDefault(() => loader(), exportName);
};

/** Lazy “module” (non-component) loader */
export const lazy = (relPath) => {
  const loader = resolveFromManifest(relPath);
  if (!loader) {
    throw new Error(
      `Unknown dynamic import "${relPath}". Add it to MANIFEST globs in helpers.js.`
    );
  }
  return lazyModule(() => loader());
};

/**
 * Bulk registrar – same as before.
 * Accepts either:
 *   [name, loaderFn]
 * or
 *   [name, relPath, exportName?]
 */
export const registerAll = (defs) => {
  defs.forEach((def) => {
    const [name, second, maybeExport] = def;

    const loader =
      typeof second === "function"
        ? second
        : makeLoader(second /* relPath */, maybeExport /* export */);

    registerComponent(name, LazyWrap(loader, name));
  });
};

/** Optional: a slightly clearer alias name */
export const registerAllComponents = registerAll;
