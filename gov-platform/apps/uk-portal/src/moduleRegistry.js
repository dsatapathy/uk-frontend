import { createModuleRegistry } from "@gov/ui-engine";

/**
 * Map of every available module (left side of workspace alias -> lazy import).
 * Add new entries here when additional feature modules are published.
 *
 * @type {Record<string, () => Promise<any>>}
 */
const availableModules = {
  landing: () => import("@gov/mod-landing"),
  auth: () => import("@gov/mod-auth"),
  bpa: () => import("@gov/mod-bpa"),
  member: () => import("@gov/mod-member"),
};

const { moduleMap, enabledKeys, resolveModule } = createModuleRegistry({
  availableModules,
  env: import.meta.env,
  logger: console,
  requireExplicitInProd: true,
});

if (import.meta.env.DEV) {
  console.log("[moduleRegistry] enabled modules =", enabledKeys.join(", "));
}

export { moduleMap, resolveModule, enabledKeys };
