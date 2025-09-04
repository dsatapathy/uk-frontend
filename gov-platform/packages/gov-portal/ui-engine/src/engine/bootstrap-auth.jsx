// src/engine/bootstrap-auth.js
import React, { useEffect, useMemo, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";
import { appStore, FormEngineProvider } from "@gov/store";
import { QueryProvider } from "@gov/data";
import { setAuth, setUser, clearAuth } from "@gov/store";
import ThemeBridge from "../ThemeBridge";
import { DEFAULT_THEME } from "./constants";

export function AppProviders({ cfg, http, storage, children }) {
  // expose store for guards/utilities
  if (typeof window !== "undefined") {
    window.__redux_store__ = window.__redux_store__ || appStore;
  }

  // MUI theme
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

  // Minimal auth API using the single http instance
  const authApi = useMemo(() => {
    // const base = (cfg?.auth?.endpoints?.baseURL || cfg?.http?.baseURL || "").replace(/\/+$/, "");
    const build = (p) => new URL(String(p || ""), cfg?.http?.baseURL).toString();
    return {
      getMe: async () => (await http.get(build(cfg.auth.endpoints.me))).data,
      login: async (payload) => (await http.post(build(cfg.auth.endpoints.login), payload)).data,
      logout: async () => { await http.post(build(cfg.auth.endpoints.logout), {}); },
    };
  }, [http, cfg]);

  // Hydrator: read storage once on mount, seed Redux, optionally fetch "me"
  function AuthHydrator({ children }) {
    const mountedRef = useRef(true);
    useEffect(() => () => { mountedRef.current = false; }, []);

    useEffect(() => {
      const saved = storage.get("auth");
      if (saved?.tokens?.accessToken) {
        appStore.dispatch(setAuth({ tokens: saved.tokens, user: saved.user }));

        (async () => {
          try {
            const u = await authApi.getMe();
            if (mountedRef.current) {
              appStore.dispatch(setUser(u));
              storage.set("auth", { ...saved, user: u });
            }
          } catch (err) {
            const status = err?.response?.status || err?.status;
            if (status === 401) {
              if (mountedRef.current) {
                appStore.dispatch(clearAuth());
                storage.remove("auth");
              }
            }
          }
        })();
      } else {
        appStore.dispatch(clearAuth());
      }
    }, []); // run once

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
