import { http } from "../bootstrap";
import { useMutation } from "@tanstack/react-query";

/**
 * Generic API service for data fetching or mutation.
 * @param {object} options
 *   - method: HTTP method (e.g., "get", "post", "put", "delete")
 *   - url: API endpoint
 *   - params: Query parameters (object)
 *   - payload: Request body (object)
 *   - headers: Custom headers (object)
 * @returns {Promise<any>}
 */
export async function apiService({
  method = "get",
  url,
  params,
  payload,
  headers,
  ...rest
}) {
  if (!url) throw new Error("apiService: 'url' is required");
  try {
    const resp = await http().request({
      url,
      method,
      params,
      data: payload,
      headers,
      ...rest,
    });
    return resp.data?.data || resp.data;;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API error:", error);
    throw error;
  }
}

/**
 * React Query mutation hook for generic API calls.
 * Usage:
 *   const mutation = useGetDataService();
 *   mutation.mutate({ method: "post", url: "/api/endpoint", payload: {...}, params: {...} });
 */
export function useGetDataService() {
  return useMutation({
    mutationFn: async (options) => apiService(options),
  });
}