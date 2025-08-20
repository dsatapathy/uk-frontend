import { useQuery } from "@tanstack/react-query";
import { keys } from "../../cache-keys";
import { http } from "../bootstrap";


export function useSidebar(params) {
  // params = { tenant, role, locale }
  return useQuery({
    queryKey: keys.sidebar(params.tenant, params.role, params.locale),
    queryFn: async () => {
      const res = await http().get("/masters/sidebar", { params });
      return res.data; // { items: [...] }
    },
  });
}

export function useModules(tenant) {
  return useQuery({
    queryKey: keys.modules(tenant),
    queryFn: async () => {
      const res = await http().get("/masters/modules", { params: { tenant } });
      return res.data; // { modules: [...] }
    },
  });
}
