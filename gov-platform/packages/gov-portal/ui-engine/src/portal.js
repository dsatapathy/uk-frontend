// Utilities to help apps bootstrap portal-specific configuration without copy/paste.

const noopLogger = {
  warn: () => {},
  info: () => {},
};

/**
 * Build a lazy module registry from a map of available modules and environment settings.
 *
 * @param {Object} params.availableModules - Map of module keys to lazy loader functions.
 * @param {Record<string, any>} [params.env] - Vite env bag (e.g. import.meta.env).
 * @param {string} [params.envKey="VITE_ENABLED_MODULES"] - Env var containing enabled module list.
 * @param {boolean} [params.fallbackToAllInDev=true] - Default to all modules when running in dev and env var missing.
 * @param {boolean} [params.requireExplicitInProd=true] - Throw if production build lacks explicit module list.
 * @param {React.ComponentType} [params.unknownComponent] - Component returned when a module is disabled in prod.
 * @param {Console} [params.logger] - Optional logger for warnings/info (defaults to console-like shim).
 */
export function createModuleRegistry({
  availableModules,
  env = {},
  envKey = "VITE_ENABLED_MODULES",
  fallbackToAllInDev = true,
  requireExplicitInProd = true,
  unknownComponent = () => null,
  logger = noopLogger,
} = {}) {
  if (!availableModules || typeof availableModules !== "object") {
    throw new Error("[ui-engine] createModuleRegistry requires an availableModules map");
  }

  const allKeys = Object.keys(availableModules);
  const envValue = env?.[envKey];
  const isDev = Boolean(env?.DEV);
  const isProd = Boolean(env?.PROD);

  const rawList =
    typeof envValue === "string"
      ? envValue
      : envValue != null
      ? String(envValue)
      : "";

  const requestedKeys = rawList
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (requireExplicitInProd && isProd && requestedKeys.length === 0) {
    throw new Error(
      `[ui-engine] ${envKey} must list enabled modules in production builds. Available keys: ${allKeys.join(
        ", "
      )}`
    );
  }

  const initialKeys =
    requestedKeys.length > 0
      ? requestedKeys
      : fallbackToAllInDev && isDev
      ? allKeys
      : requestedKeys;

  const enabledKeys =
    initialKeys.length > 0 ? initialKeys.filter((key) => {
      if (!availableModules[key]) {
        logger.warn?.(
          `[ui-engine] Unknown module key "${key}" listed in ${envKey}; skipping`
        );
        return false;
      }
      return true;
    }) : allKeys;

  const moduleMap = Object.fromEntries(
    enabledKeys.map((key) => [key, availableModules[key]]).filter(([, loader]) => !!loader)
  );

  function resolveModule(key) {
    const loader = moduleMap[key];
    if (!loader) {
      if (isProd) {
        logger.warn?.(
          `[ui-engine] resolveModule("${key}") requested but module is disabled. Returning unknown component.`
        );
        return () => Promise.resolve({ default: unknownComponent });
      }
      throw new Error(`Unknown/disabled module: ${key}`);
    }
    return loader;
  }

  return { moduleMap, enabledKeys, resolveModule };
}

/**
 * Build default module manifest entries from a set of keys.
 *
 * @param {string[]} keys - Enabled module identifiers.
 * @param {Record<string, string>} [basePaths={}] - Optional map overriding base paths per module.
 * @returns {{ key: string, basePath: string }[]}
 */
export function buildModuleDefaults(keys = [], basePaths = {}) {
  return keys.map((key) => ({
    key,
    basePath: basePaths[key] || `/${key}`,
  }));
}

