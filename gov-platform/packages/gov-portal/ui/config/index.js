// Lazy map of loaders; no configs are imported until asked
const LOADERS = import.meta.glob("./**/*.config.js"); // vite creates code-split chunks

export async function loadConfig(path) {
  const key = `./${path}.config.js`;          // e.g. "auth/login"
  const loader = LOADERS[key];
  if (!loader) throw new Error(`Config not found: ${path}`);
  const mod = await loader();
  return mod.default ?? mod;
}

// Optional: named helpers
export const loadLogin    = () => loadConfig("auth/login");
export const loadRegister = () => loadConfig("auth/register");
export const loadLanding  = () => loadConfig("landing/landing");