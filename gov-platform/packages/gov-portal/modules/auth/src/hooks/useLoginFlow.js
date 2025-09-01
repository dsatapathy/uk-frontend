import { useMemo } from "react";
import { useAppDispatch } from "@gov/store";
import { setAuth } from "@gov/store";
import { http, makeAuthApi } from "@gov/data";

/**
 * loginCfg shape (same as your current config):
 * {
 *   api: { baseURL: "http://localhost:3001" },
 *   submit: {
 *     endpoint: "/api/auth/login",
 *     method: "POST",
 *     headers?: {...},                 // optional extra headers
 *     mapVars?: (vars) => ({...})      // optional payload mapper
 *   },
 *   onSuccessRoute?: "/uk-portal/landing",
 *   responseAdapter?: (raw) => ({ tokens, user }),   // optional
 *   rememberSelector?: (vars) => boolean,            // optional
 *   storage?: { namespace?: string, ttlSeconds?: number, mirrorToSession?: boolean } // optional (if using global storage, you can ignore)
 * }
 */

export function useLoginFlow(loginCfg) {
  const dispatch = useAppDispatch();

  const baseURL = loginCfg?.api?.baseURL || "";
  const endpoint = loginCfg?.submit?.endpoint || "/api/auth/login";
  const method = (loginCfg?.submit?.method || "POST").toUpperCase();
  const extraHeaders = loginCfg?.submit?.headers || {};
  const mapVars =
    typeof loginCfg?.submit?.mapVars === "function"
      ? loginCfg.submit.mapVars
      : (v) => ({ username: v.username, password: v.password, remember: v.remember });

  // Build the auth service once for this config
  const auth = useMemo(() => {
    // If you set window.__auth_storage__ at app bootstrap, the service will auto-use it
    return makeAuthApi(http(), {
      auth: {
        baseURL,
        installInterceptors: true,
        // Endpoints used by the service (we only need login here; others are defaults you can change later)
        endpoints: {
          login: endpoint,
          me: "/api/auth/me",
          logout: "/api/auth/logout",
          refresh: "/api/auth/refresh",
        },
        // Decide local vs session from the payload (remember checkbox)
        rememberSelector:
          typeof loginCfg?.rememberSelector === "function"
            ? loginCfg.rememberSelector
            : (vars) => !!vars?.remember,
        // Normalize raw backend → { tokens, user }
        responseAdapter:
          typeof loginCfg?.responseAdapter === "function"
            ? loginCfg.responseAdapter
            : (data) => ({
                tokens: {
                  accessToken: data?.accessToken || data?.token,
                  refreshToken: data?.refreshToken,
                  tokenType: data?.tokenType || "Bearer",
                },
                user: data?.user,
              }),
        // Optional storage overrides if you are NOT using a global window.__auth_storage__
        storage: loginCfg?.storage, // can be omitted to use global
        // Optional: add headers to login call via client interceptor? We'll pass per-call below instead.
      },
    });
  }, [
    baseURL,
    endpoint,
    loginCfg?.rememberSelector,
    loginCfg?.responseAdapter,
    loginCfg?.storage,
  ]);

  // Pull the generated hook from the service
  const { useLogin } = auth;

  // Wrap service’s useLogin so we keep your old return shape
  const login = useLogin({
    // onSuccess receives the mapped { tokens, user }
    onSuccess: (mapped, vars) => {
      // Keep Redux in sync if your app still reads auth from store
      dispatch(setAuth(mapped));
      // Optional route redirect if you use it in config
      if (loginCfg?.onSuccessRoute) {
        window.location.href = loginCfg.onSuccessRoute;
      }
    },
  });

  return {
    submit: (username, password, opts) =>
      // mapVars lets you rename/request different payload keys if needed
      login.mutateAsync({
        ...mapVars({ username, password, remember: !!opts?.remember }),
        // If you want extra headers for just the login call:
        // The service uses axios under the hood; pass a hint the core can read:
        __headers: extraHeaders,
        __method: method, // core defaults to POST; include if you need to vary
      }),
    isLoading: login.isPending,
    error: login.error,
  };
}
