import React, { useEffect, useMemo, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import { Provider as ReduxProvider } from "react-redux";
import { appStore, FormEngineProvider } from "@gov/store"; // make sure your store package exports this singleton
import { VersionedStorage, QueryProvider } from "@gov/data";
import { createHttp } from "@gov/data";
import { setAuth, setUser, clearAuth } from "@gov/store";
import ThemeBridge from "../ThemeBridge";
import { DEFAULT_THEME } from "./constants";

export function AppProviders({ cfg, children }) {
  // Expose the singleton store for guards/utilities
  if (typeof window !== "undefined") {
    // don't overwrite if someone already set it
    // eslint-disable-next-line no-underscore-dangle
    window.__redux_store__ = window.__redux_store__ || appStore;
  }

  // MUI theme (config-driven)
  const theme = useMemo(
    () => createTheme({ ...DEFAULT_THEME, ...(cfg?.theme || {}) }),
    [cfg?.theme]
  );

  // React Query client
  const qc = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
      }),
    []
  );

  // Versioned storage (tenant-based namespace)
  const storage = useMemo(
    () =>
      new VersionedStorage({
        version: cfg.auth.storage.version,
        namespace: "uk-portal",
        mirrorToSession: cfg.auth.storage.mirrorToSession,
        ttlSeconds: cfg.auth.storage.ttlSeconds,
      }),
    [cfg]
  );

  // HTTP client with auth header from VersionedStorage
  const http = useMemo(() => {
    const inst = createHttp(cfg, storage);
    // Ensure Authorization header uses the NEW token shape
    if (inst?.interceptors?.request?.use) {
      inst.interceptors.request.use((req) => {
        const saved = storage.get("auth");
        const token = saved?.tokens?.accessToken;
        if (token) {
          req.headers = { ...(req.headers || {}), Authorization: `Bearer ${token}` };
        }
        return req;
      });
    }
    return inst;
  }, [cfg, storage]);

  // Minimal auth API (avoid relying on makeAuthApi export)
  const authApi = useMemo(() => {
    const base = cfg.auth.endpoints.baseURL;
    const url = (p) => new URL(p, base).toString();
    return {
      getMe: async () => (await http.get(url(cfg.auth.endpoints.me))).data,
      login: async (payload) => (await http.post(url(cfg.auth.endpoints.login), payload)).data,
      logout: async () => { await http.post(url(cfg.auth.endpoints.logout), {}); },
    };
  }, [http, cfg]);

  // Hydrator: read storage once on mount, seed Redux, optionally fetch "me"
  function AuthHydrator({ children }) {
    const mountedRef = useRef(true);
    useEffect(() => () => { mountedRef.current = false; }, []);

    useEffect(() => {
      const saved = storage.get("auth");
      if (saved?.tokens?.accessToken) {
        // seed redux from storage
        appStore.dispatch(setAuth({ tokens: saved.tokens, user: saved.user }));

        // try to fetch profile; only clear on real 401
        (async () => {
          try {
            const u = await authApi.getMe();
            if (mountedRef.current) {
              appStore.dispatch(setUser(u));
              storage.set("auth", { ...saved, user: u });
            }
          } catch (err) {
            const status = err?.response?.status || err?.status;
            // only clear on definite unauthorized; otherwise keep the session
            if (status === 401) {
              if (mountedRef.current) {
                appStore.dispatch(clearAuth());
                storage.remove("auth");
              }
            }
            // else ignore transient/network errors to avoid desync
          }
        })();
      } else {
        // no tokens in storage ⇒ ensure redux is marked unauthenticated
        appStore.dispatch(clearAuth());
      }
      // run once on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeBridge />
      <ReduxProvider store={appStore}>
        <QueryProvider client={qc}>
          <FormEngineProvider>
            <AuthHydrator>{children}</AuthHydrator>
          </FormEngineProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
