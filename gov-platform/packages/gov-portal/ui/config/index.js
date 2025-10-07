// Lazy map of loaders; no configs are imported until asked.
const GLOB_LOADERS = import.meta.glob("./**/*.config.js"); // vite creates code-split chunks
const REGISTRY = new Map(
  Object.entries(GLOB_LOADERS).map(([key, loader]) => [normalizeKey(key), loader])
);

function normalizeKey(input) {
  return String(input)
    .replace(/^\.\//, "")           // remove leading "./"
    .replace(/\.config\.js$/, "");  // drop extension
}

function assertLoader(loader, key) {
  if (typeof loader !== "function") {
    throw new Error(`Config loader for "${key}" must be a function returning a promise`);
  }
}

export function registerConfigLoader(path, loader) {
  const key = normalizeKey(path);
  assertLoader(loader, key);
  REGISTRY.set(key, loader);
}

export function unregisterConfigLoader(path) {
  const key = normalizeKey(path);
  REGISTRY.delete(key);
}

export function hasConfigLoader(path) {
  const key = normalizeKey(path);
  return REGISTRY.has(key);
}

export function listConfigLoaders() {
  return Array.from(REGISTRY.keys());
}

export async function loadConfig(path) {
  const key = normalizeKey(path); // e.g. "auth/login"
  const loader = REGISTRY.get(key);
  if (!loader) throw new Error(`Config not found: ${path}`);
  const mod = await loader();
  return mod?.default ?? mod;
}

// Optional: named helpers
export const loadLogin = () => loadConfig("auth/login");
export const loadRegister = () => loadConfig("auth/register");
export const loadLanding = () => loadConfig("landing/landing");
