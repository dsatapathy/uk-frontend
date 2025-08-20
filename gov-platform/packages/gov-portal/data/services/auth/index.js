import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../../cache-keys";
import { http } from "../bootstrap";

export function useMe() {
  return useQuery({
    queryKey: keys.me(),
    queryFn: async () => {
      const res = await http().get("/auth/me");
      return res.data;
    },
    retry: 0,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await http().post("/auth/login", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.me() });
    },
  });
}
