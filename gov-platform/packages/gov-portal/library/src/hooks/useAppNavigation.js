import * as React from "react";
import { useHistory } from "react-router-dom";
import { normalizeRoutePath, isExternalRoute } from "../utils/routing";

function describePath(path) {
  if (path === undefined || path === null) {
    return { normalized: "", external: false };
  }
  const raw = String(path).trim();
  if (!raw) {
    return { normalized: "", external: false };
  }
  const external = isExternalRoute(raw);
  return {
    normalized: external ? raw : normalizeRoutePath(raw),
    external,
  };
}

export function useAppNavigation() {
  const history = useHistory();

  const createHref = React.useCallback(
    (path, locationLike) => {
      const { normalized, external } = describePath(path);
      if (!normalized) return undefined;
      if (external || typeof history?.createHref !== "function") return normalized;
      const base = typeof normalized === "string" ? { pathname: normalized } : normalized;
      return history.createHref({ ...base, ...(locationLike || {}) });
    },
    [history]
  );

  const navigate = React.useCallback(
    (path, { replace = false } = {}) => {
      const { normalized, external } = describePath(path);
      if (!normalized) return;
      if (external) {
        if (typeof window !== "undefined") window.location.assign(normalized);
        return;
      }
      if (replace) {
        history?.replace?.(normalized);
      } else {
        history?.push?.(normalized);
      }
    },
    [history]
  );

  const resolvePath = React.useCallback((path) => describePath(path).normalized, []);
  const isExternal = React.useCallback((path) => describePath(path).external, []);

  return {
    history,
    navigate,
    createHref,
    resolvePath,
    isExternal,
  };
}
