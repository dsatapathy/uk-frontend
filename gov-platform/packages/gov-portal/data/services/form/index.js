// packages/gov-portal/data/services/form/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../bootstrap";

// deps must be present (non-empty strings ok; allow 0/false if valid)
function depsReady(deps = {}) {
  const ks = Object.keys(deps || {});
  if (ks.length === 0) return true;
  return ks.every((k) => {
    const v = deps[k];
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    return true;
  });
}

export function useOptions(
  endpointKey,
  { query, page = 1, deps = {}, endpoint, enabled = true, staleTime = 10 * 60 * 1000 } = {}
) {
  const url = endpoint || (endpointKey ? `/api/options/${endpointKey}` : undefined);
  const ready = depsReady(deps);
  const isEnabled = enabled && !!url && ready;

  return useQuery({
    queryKey: ["options", endpointKey, query ?? "", page, JSON.stringify(deps || {})],
    queryFn: async () => {
      const { data } = await http().get(url, { params: { q: query, page, ...deps } });
      return data || [];
    },
    enabled: isEnabled,
    // 👇 prevent refetch “just because” when revisiting/ focusing
    staleTime,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
  });
}

// 2. File upload
export function useFileUpload() {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await http().post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
}

// 3. Save draft
export function useSaveDraft(formId, entityId) {
  return useMutation({
    mutationFn: async (values) => {
      const { data } = await http().post(`/forms/${formId}/${entityId}/draft`, values);
      return data;
    },
  });
}

// 4. Submit form
export function useSubmitForm(formId, entityId) {
  return useMutation({
    mutationFn: async (values) => {
      const { data } = await http().post(`/forms/${formId}/${entityId}/submit`, values);
      return data;
    },
  });
}
