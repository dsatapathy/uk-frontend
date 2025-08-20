import React from "react";

export function ensureAuthGuard(routes, auth, { loginPath = "/login" } = {}) {
  if (!auth || auth.strategy === "none") return routes;

  // public routes (login, or anything with meta.public)
  const configuredPublic = new Set([loginPath, ...(auth.publicPaths || [])]);
  const isPublic = (r) => r?.meta?.public || (r?.path && configuredPublic.has(r.path));
  // build the full storage key correctly
  const prefix = auth.tokens?.prefix ?? "";
  const key    = auth.tokens?.accessKey ?? "";
  const accessKey = `${prefix}${key}`;

  const getStoredToken = () => {
    const storage = (auth.tokens?.storage || "localStorage").toLowerCase();
    try {
      const store = storage === "sessionstorage" ? sessionStorage : localStorage;
      return accessKey ? store.getItem(accessKey) : null;
    } catch {
      return null;
    }
  };

  const defaultIsAuthed = () => !!getStoredToken();

  const isAuthed = auth.guards?.isAuthenticated
    ? () => !!auth.guards.isAuthenticated({ tokens: { access: getStoredToken() } })
    : defaultIsAuthed;

  const redirectTo = auth.onAuthFail || loginPath;

  return routes.map((r) =>
    isPublic(r)
      ? r
      : { ...r, guard: () => isAuthed(), redirectTo }
  );
}
