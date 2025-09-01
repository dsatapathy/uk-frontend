import { defaultAuthConfig, mergeAuthConfig } from "./config";
import { adapters } from "./adapters";
import { buildAuthClient } from "./client";
import { makeAuthCore } from "./core";
import { createAuthHooks } from "./hooks";
import VersionedStorage from "../../storage";

/**
 * makeAuthApi(http, cfg)
 * http  : axios instance
 * cfg   : { auth: { ...overrides } }
 */
export function makeAuthApi(http, cfg) {
  const userCfg = (cfg && cfg.auth) || {};
  const merged = mergeAuthConfig(defaultAuthConfig, {
    ...userCfg,
    // allow selecting an adapter by name, else use provided function or default
    responseAdapter: typeof userCfg.responseAdapter === "string"
      ? (adapters[userCfg.responseAdapter] || defaultAuthConfig.responseAdapter)
      : (userCfg.responseAdapter || defaultAuthConfig.responseAdapter),
  });

  const storage =
    userCfg.storage ||
    (typeof window !== "undefined" && window.__auth_storage__) ||
    new VersionedStorage({
      version: "v1",
      namespace: merged.storageNamespace || "uk-portal",
      mirrorToSession:
        typeof merged.mirrorToSession === "boolean" ? merged.mirrorToSession : true,
      ttlSeconds:
        typeof merged.ttlSeconds === "number" ? merged.ttlSeconds : 60 * 60 * 8,
    });
  const client = buildAuthClient(http, merged, storage);
  const core = makeAuthCore(client, merged, storage);
  const hooks = createAuthHooks(core);

  return { ...core, ...hooks };
}

// Optional: named exports if you want to import piecemeal
export { defaultAuthConfig, mergeAuthConfig } from "./config";
export { adapters } from "./adapters";