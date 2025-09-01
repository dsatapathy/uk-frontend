import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function createAuthHooks(core) {
  function useMe(options) {
    return useQuery({
      queryKey: ["me"],
      queryFn: () => core.getMe(),
      staleTime: 5 * 60 * 1000,
      ...(options || {}),
    });
  }

  function useLogin(options) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload) => core.login(payload),
      onSuccess: (data, vars, ctx) => {
        qc.invalidateQueries({ queryKey: ["me"] });
        if (options && typeof options.onSuccess === "function") options.onSuccess(data, vars, ctx);
      },
      ...(options || {}),
    });
  }

  function useLogout(options) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () => core.logout(),
      onSuccess: (...args) => {
        qc.removeQueries({ queryKey: ["me"], exact: false });
        if (options && typeof options.onSuccess === "function") options.onSuccess(...args);
      },
      ...(options || {}),
    });
  }

  function useRefresh(options) {
    return useMutation({
      mutationFn: () => core.refresh(),
      ...(options || {}),
    });
  }

  return { useMe, useLogin, useLogout, useRefresh };
}