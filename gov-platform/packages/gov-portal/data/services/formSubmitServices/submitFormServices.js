import { http } from "../bootstrap";
import { useMutation } from "@tanstack/react-query";

/**
 * Generic service to submit data to any endpoint.
 * @param {string} method - HTTP method (e.g., "post", "put").
 * @param {string} url - API endpoint.
 * @param {object} payload - Data to send.
 * @returns {Promise<any>}
 */
export async function submitDataService(method = "post", url, payload) {
  try {
    const resp = await http().request({
      url,
      method,
      data: payload,
    });
    return resp.data;
  } catch (error) {
    console.error("Submit error:", error);
    throw error;
  }
}

/**
 * React Query mutation hook for generic form submission.
 * Usage:
 *   const mutation = useSubmitData();
 *   mutation.mutate({ method: "post", url: "v1/reap/operations", payload: {...} });
 */
export function useSubmitData() {
  return useMutation({
    mutationFn: async ({ method = "post", url, payload }) => {
      return submitDataService(method, url, payload);
    },
  });
}