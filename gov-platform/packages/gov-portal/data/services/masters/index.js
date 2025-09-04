// src/services/sidebar.js
import { useRQQuery, idOf } from "../rq";
import { keys } from "../../cache-keys";

/**
 * Sidebar: GET /masters/sidebar
 * Server shape: { items: [...] }
 */
export function useSidebar({ tenant, role, locale } = {}) {
  const tenantId = idOf(tenant);
  const roleCode = idOf(role);
  const localeCode = idOf(locale);
  const enabled = Boolean(tenantId && roleCode && localeCode);

  return useRQQuery({
    key: keys.sidebar(tenantId, roleCode, localeCode),
    url: "/masters/sidebar",
    params: { tenant: tenantId, role: roleCode, locale: localeCode },
    enabled,
    selectPath: "items",
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Modules: GET /masters/modules
 * Server shape: { modules: [...] }
 */
export function useModules(tenant) {
  const tenantId = idOf(tenant);

  return useRQQuery({
    key: keys.modules(tenantId),
    url: "/masters/modules",
    params: { tenant: tenantId },
    enabled: Boolean(tenantId),
    selectPath: "modules",
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
