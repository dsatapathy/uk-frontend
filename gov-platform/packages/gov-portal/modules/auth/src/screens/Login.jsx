// packages/gov-portal/modules/auth/Login.jsx
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { loginConfig } from "@gov/ui";           // if your package exports default, change to: import loginConfig from "@gov/ui/login.config";
import { getComponent } from "@gov/core";
import { useAppSelector } from "@gov/store";
import { useLoginFlow } from "../hooks/useLoginFlow"; // adjust path if needed

export default function Login() {
  const LoginForm = getComponent("LoginForm");
  const history = useHistory();
  const location = useLocation();

  // Redux auth status
  const isAuthed = useAppSelector((s) => s.auth?.status === "authenticated");

  // Login flow (config-driven)
  const { submit, isLoading, error } = useLoginFlow(loginConfig);

  // Raw target from config (may or may not include the base)
  const rawTarget = loginConfig?.onSuccessRoute || "/uk-portal/bpa";

  // ---- BASENAME DETECTION + NORMALIZATION ----
  // Guess the app base from globals or from the current /login path, e.g. "/uk-portal"
  const baseGuessFromGlobals =
    (typeof window !== "undefined" &&
      (window.__ROUTER_BASENAME__ || window.__ENGINE_BASE__ || window.__APP_BASE__)) ||
    "";

  const baseGuessFromPath =
    location.pathname.match(/^(.*)\/login\/?$/)?.[1] || ""; // if on "/uk-portal/login" => "/uk-portal"

  // pick the non-empty one; strip trailing slash
  const base =
    (baseGuessFromGlobals || baseGuessFromPath).replace(/\/$/, "");

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Always return a path WITHOUT the base (Router basename will add it)
  const stripBase = React.useCallback(
    (path) => {
      if (!path) return "/";
      let p = path;

      if (base) {
        const re = new RegExp(`^(?:${escapeRe(base)})(?=/|$)`, "i");
        // strip the base repeatedly if duplicated, e.g. "/uk-portal/uk-portal/bpa"
        // do 2 passes to cover common double-prefix cases
        p = p.replace(re, "");
        p = p.replace(re, "");
      }

      if (!p.startsWith("/")) p = "/" + p;
      return p;
    },
    [base]
  );

  const target = stripBase(rawTarget);

  // Track mount so we never navigate after unmount
  const mountedRef = React.useRef(true);
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  // Defer navigation to avoid "state update on unmounted component"
  const deferReplace = React.useCallback(
    (to) => {
      const normalized = stripBase(to);
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (mountedRef.current && location.pathname !== normalized) {
            history.replace(normalized);
          }
        }, 0);
      });
    },
    [history, location.pathname, stripBase]
  );

  // If user hits the login URL while authed, kick them out to target
  React.useEffect(() => {
    const onLoginPage = /\/login\/?$/.test(location.pathname);
    if (isAuthed && onLoginPage) {
      deferReplace(target);
    }
  }, [isAuthed, location.pathname, target, deferReplace]);

  if (!LoginForm) return <div>LoginForm is not registered</div>;

  // Submit → login → then defer redirect to base-aware target
  const handleSubmit = async (payload) => {
    const { username, password, remember } = payload || {};
    await submit(username, password, { remember });
    deferReplace(target);
  };

  return (
    <LoginForm
      config={loginConfig}
      onSubmit={handleSubmit}
      submitting={isLoading}
      errorMessage={error ? "Login failed" : undefined}
    />
  );
}
