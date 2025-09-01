// packages/gov-portal/features/auth/useLoginFlow.js
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@gov/store";
import { setAuth } from "@gov/store";
import { VersionedStorage, http  } from "@gov/data";

export function useLoginFlow(loginCfg, storagePolicyOverride) {
    const dispatch = useAppDispatch();

    const storage = useMemo(() => {
        // prefer provided storage, else the shared one, else fallback (rarely used)
        // if (storageOverride) return storageOverride;
        if (typeof window !== "undefined" && window.__auth_storage__) return window.__auth_storage__;
        // Fallback ONLY if absolutely needed (best to avoid this branch)
        return new VersionedStorage({
            version: "v1",
            namespace: "uk-portal",
            mirrorToSession: true,
            ttlSeconds: 60 * 60 * 8,
        });
    }, [storagePolicyOverride]);

    const endpoint = loginCfg?.submit?.endpoint || "/api/auth/login";
    const baseURL = loginCfg?.api?.baseURL || "";   // <-- read from config
    const url = baseURL ? new URL(endpoint, baseURL).toString() : endpoint;

    const method = (loginCfg?.submit?.method || "POST").toUpperCase();

    const mutation = useMutation({
        mutationFn: async (vars) => {
            const { data } = await http().request({
                url,
                method,
                headers: { "Content-Type": "application/json" },
                data: { username: vars.username, password: vars.password },
                withCredentials: true,
            });
            return data;
        },
        onSuccess: (data, vars) => {
            const tokens = {
                accessToken: data.accessToken || data.token,
                refreshToken: data.refreshToken,
                tokenType: data.tokenType,
            };
            const user = data.user;
            const scope = vars?.remember ? "local" : "session";
            storage.set("auth", { tokens, user }, { scope });
            dispatch(setAuth({ tokens, user }));
        },
    });

    return {
        submit: (username, password, opts) => mutation.mutateAsync({ username, password, remember: !!opts?.remember }),
        isLoading: mutation.isPending,
        error: mutation.error,
    };
}
