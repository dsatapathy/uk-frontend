import { useQuery } from "@tanstack/react-query";
import { keys } from "../../cache-keys";
import { http } from "../bootstrap";

// The sidebar and modules services fire HTTP requests. When required
// parameters like tenant/role/locale are not yet available, React Query
// would otherwise repeatedly attempt to run the query leading to
// unnecessary or even infinite network calls. Guard the queries with an
// `enabled` flag so they execute only when the required params are
// present. Additionally, normalise potentially complex objects (e.g.
// `{ code: "pb" }`) to primitive identifiers so that the query keys remain
// stable across renders and don't trigger refetches due to reference
// changes.

export function useSidebar({ tenant, role, locale } = {}) {
  const tenantId = typeof tenant === "object" ? tenant?.code || tenant?.id : tenant;
  const roleCode = typeof role === "object" ? role?.code || role?.id : role;
  const localeCode = typeof locale === "object" ? locale?.code || locale?.id : locale;
  const enabled = Boolean(tenantId && roleCode && localeCode);

  return useQuery({
    queryKey: keys.sidebar(tenantId, roleCode, localeCode),
    queryFn: async () => {
      const res = await http().get("/masters/sidebar", {
        params: { tenant: tenantId, role: roleCode, locale: localeCode },
      });
      return res.data; // { items: [...] }
    },
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useModules(tenant) {
  const tenantId = typeof tenant === "object" ? tenant?.code || tenant?.id : tenant;

  return useQuery({
    queryKey: keys.modules(tenantId),
    queryFn: async () => {
      const res = await http().get("/masters/modules", {
        params: { tenant: tenantId },
      });
      return res.data; // { modules: [...] }
    },
    enabled: Boolean(tenantId),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}