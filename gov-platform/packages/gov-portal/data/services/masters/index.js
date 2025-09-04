// src/services/sidebar.js
import { useRQQuery, idOf } from "./rq";
import { keys } from "../../cache-keys";

export function useSidebar({ tenant, role, locale } = {}) {
  const tenantId = idOf(tenant);
  const roleCode = idOf(role);
  const localeCode = idOf(locale);

  return useRQQuery({
    key: keys.sidebar(tenantId, roleCode, localeCode),
    url: "/masters/sidebar",
    params: { tenant: tenantId, role: roleCode, locale: localeCode },
    enabled: Boolean(tenantId && roleCode && localeCode),
    selectPath: "items",
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,        // 🔽
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

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
    refetchOnMount: false,        // 🔽
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
