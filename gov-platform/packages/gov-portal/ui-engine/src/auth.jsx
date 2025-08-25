// Do NOT import React here
import {VersionedStorage} from "@gov/data"; // or the path where VersionedStorage lives

/**
 * Make protected routes require auth.
 * Strategy:
 *   1) Prefer Redux auth.status === 'authenticated'
 *   2) Fallback to VersionedStorage `{ tokens.accessToken }` under "auth"
 *   3) Legacy fallback: old local/session accessKey
 *
 * Options:
 *   - loginPath: path to the login page (should be base-aware, e.g. "/uk-portal/login")
 *   - base: app base (e.g. "/uk-portal") to normalize public paths
 */
export function ensureAuthGuard(routes, auth, { loginPath = "/login", base = "" } = {}) {
  if (!auth || auth.strategy === "none") return routes;

  const normalize = (p) => {
    if (!p) return p;
    // if already base-prefixed or is absolute http(s) path, keep as-is
    if (base && p.startsWith(base)) return p;
    // return base && p.startsWith("/") ? base + p : p;
    return base && p.startsWith("/") ? p : p;
  };

  // Build public set (login + declared public paths), normalized with base
  const configuredPublic = new Set([
    normalize(loginPath),
    ...(auth.publicPaths || []).map(normalize),
  ]);

  const isPublic = (r) =>
    r?.meta?.public ||
    (typeof r?.path === "string" && configuredPublic.has(r.path));

  // 1) Redux first
  const isAuthedByRedux = () => {
    try {
      const store = typeof window !== "undefined" ? window.__redux_store__ : null;
      return !!store?.getState?.().auth && store.getState().auth.status === "authenticated";
    } catch {
      return false;
    }
  };

  // 2) VersionedStorage (new)
  const isAuthedByStorage = () => {
    try {
      // Use config-driven storage if provided
      const storageCfg = auth.storage || {
        version: "v1",
        namespace: "uk-portal",
        mirrorToSession: true,
      };
      const ns =
        (auth.tenant ? `${auth.tenant}-` : "") + (storageCfg.namespace || "uk-portal");

      const vs = new VersionedStorage({
        version: storageCfg.version || "v1",
        namespace: ns,
        mirrorToSession: storageCfg.mirrorToSession ?? true,
        ttlSeconds: storageCfg.ttlSeconds,
      });

      const saved = vs.get("auth");
      if (saved?.tokens?.accessToken) return true;
    } catch {
      /* ignore */
    }

    // 3) Legacy fallback: old accessKey in (local|session)Storage
    try {
      const prefix = auth.tokens?.prefix ?? "";
      const key = auth.tokens?.accessKey ?? "";
      const accessKey = key ? `${prefix}${key}` : "";
      if (!accessKey) return false;

      const v =
        (typeof localStorage !== "undefined" ? localStorage.getItem(accessKey) : null) ||
        (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(accessKey) : null);
      return !!v;
    } catch {
      return false;
    }
  };

  const isAuthed = () => isAuthedByRedux() || isAuthedByStorage();
  const redirectTo = normalize(auth.onAuthFail || loginPath);

  return routes.map((r) => (isPublic(r) ? r : { ...r, guard: () => isAuthed(), redirectTo }));
}
