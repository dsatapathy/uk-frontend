/**
 * Full map of lazy modules (each stays its own chunk).
 *
 * @type {Record<string, () => Promise<any>>}
 */
const all = {
  landing: () => import("@gov/mod-landing"),
  auth: () => import("@gov/mod-auth"),
  bpa: () => import("@gov/mod-bpa"),
};

// Allow selection with VITE_ENABLED_MODULES="landing,auth,tl"
// If missing, default to *all* in dev; lock it in prod via .env.production
const list = (import.meta.env.VITE_ENABLED_MODULES ||
  (import.meta.env.DEV ? Object.keys(all).join(",") : ""))
  .split(",").map(s => s.trim()).filter(Boolean);

/**
* Map of enabled modules and their lazy importers.
*
* @type {Record<string, () => Promise<any>>}
*/

export const moduleMap = Object.fromEntries(
  (list.length ? list : Object.keys(all)).map(k => [k, all[k]]).filter(([k]) => !!all[k])
);

/**
* Placeholder component rendered for unknown modules in production.
*
* @returns {null}
*/
const UnknownModule = () => null;

/**
* Resolve a module's lazy loader by key.
*
* @param {string} key - Module identifier.
* @returns {() => Promise<{default: any}>} The module loader.
*/
export function resolveModule(key) {
  const loader = moduleMap[key];
  if (!loader) {
    if (import.meta.env.PROD) {
      return () => Promise.resolve({ default: UnknownModule });
    }
    throw new Error(`Unknown/disabled module: ${key}`);
  }
  return loader;
}
