import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Expects: http (Axios instance) and cfg (your app config)
export function makeAuthApi(http, cfg) {
  const url = (p) => new URL(p, cfg.auth.endpoints.baseURL).toString();

  async function login(payload) {
    const { data } = await http.post(url(cfg.auth.endpoints.login), payload);
    return data;
  }

  async function getMe() {
    const { data } = await http.get(url(cfg.auth.endpoints.me));
    return data;
  }

  async function logout() {
    await http.post(url(cfg.auth.endpoints.logout), {});
  }

  return { login, getMe, logout };
}

export function useMe(api) {
  return useQuery({ queryKey: ["me"], queryFn: () => api.getMe(), staleTime: 5 * 60 * 1000 });
}

export function useLogin(api) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p) => api.login(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
