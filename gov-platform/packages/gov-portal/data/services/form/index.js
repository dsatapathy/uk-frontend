// packages/gov-portal/data/services/form/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../bootstrap";

// 1. Fetch dropdown/autocomplete options
export function useOptions(endpointKey, { query, page = 1, deps = {} } = {}) {
  return useQuery({
    queryKey: ["options", endpointKey, query, page, deps],
    queryFn: async () => {
      const { data } = await http().get(`/options/${endpointKey}`, {
        params: { q: query, page, ...deps },
      });
      return data || [];
    },
    enabled: !!endpointKey,
    staleTime: 5 * 60 * 1000,
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
