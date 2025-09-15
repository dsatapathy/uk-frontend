import { http } from "../bootstrap";
import { useRQQuery, useRQMutation } from "../rq";

export function useOptions(
  endpointKey,
  { query, page = 1, deps = {}, endpoint, enabled = true, staleTime = 10 * 60 * 1000 } = {}
) {
  const url = endpoint || (endpointKey ? `/options/${endpointKey}` : undefined);
  return useRQQuery({
    key: ["options", endpointKey || "custom"],
    url,
    method: "get",
    params: { q: query, page, ...deps },
    deps,
    enabled: enabled && !!url,
    staleTime,
  });
}

export function useFileUpload() {
  return useRQMutation({
    url: "/files/upload",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    buildFormData: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      return fd;
    },
  });
}

export function useSaveDraft(formId, entityId) {
  return useRQMutation({
    url: `/forms/${formId}/${entityId}/draft`,
    method: "post",
  });
}

export function useSubmitForm(formId, entityId) {
  return useRQMutation({
    url: `/forms/${formId}/${entityId}/submit`,
    method: "post",
  });
}
const accept304 = (s) => (s >= 200 && s < 300) || s === 304;
export async function getMemberProfile(memberId, { signal } = {}) {
  if (memberId == null || String(memberId).trim() === "") return null; // soft guard
  const resp = await http().request({
    url: `/members/${memberId}`,
    method: "get",
    signal,                 // allows React Query (or AbortController) to cancel
    validateStatus: accept304,
  });
  return resp.data;
}

