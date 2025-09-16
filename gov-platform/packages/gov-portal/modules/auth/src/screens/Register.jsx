// packages/gov-portal/modules/auth/Login.jsx
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { loadLogin } from "@gov/ui";           // returns Promise<config>
import { getComponent } from "@gov/core";
import { useAppSelector } from "@gov/store";
import { useLoginFlow } from "../hooks/useLoginFlow";
import { useConfig } from "@gov/library";

// --- Base helpers ---
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function useBase(locationPathname) {
  const baseGuessFromGlobals =
    (typeof window !== "undefined" &&
      (window.__ROUTER_BASENAME__ || window.__ENGINE_BASE__ || window.__APP_BASE__)) ||
    "";
  const baseGuessFromPath = locationPathname.match(/^(.*)\/login\/?$/)?.[1] || "";
  return (baseGuessFromGlobals || baseGuessFromPath).replace(/\/$/, "");
}
function useStripBase(base) {
  return React.useCallback(
    (path) => {
      if (!path) return "/";
      let p = String(path);
      if (base) {
        const re = new RegExp(`^(?:${escapeRe(base)})(?=/|$)`, "i");
        p = p.replace(re, "").replace(re, ""); // two passes to remove accidental double prefix
      }
      if (!p.startsWith("/")) p = "/" + p;
      return p;
    },
    [base]
  );
}

// --- Outer: fetch config once, then render Inner ---
export default function Register() {
  const { config: loginConfig, loading: cfgLoading } = useConfig(loadLogin, "login");
  const config = loginConfig || {};
  if (cfgLoading) {
    return null;
  }
  return <LoginInner loginConfig={config} />;
}

// --- Inner: uses hooks that need the config ready ---
function LoginInner({ loginConfig }) {
  const history = useHistory();
  const location = useLocation();
  const isAuthed = useAppSelector((s) => s.auth?.status === "authenticated");

  const LoginForm = getComponent("LoginForm");
  if (!LoginForm) return <div>LoginForm is not registered</div>;

  const base = useBase(location.pathname);
  const stripBase = useStripBase(base);

  const rawTarget = loginConfig?.onSuccessRoute || "/uk-portal/bpa";
  const target = stripBase(rawTarget);

  const mountedRef = React.useRef(true);
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  const deferReplace = React.useCallback(
    (to) => {
      const normalized = stripBase(to);
      // microtask/next-tick to avoid replace during render
      setTimeout(() => {
        if (mountedRef.current && location.pathname !== normalized) {
          history.replace(normalized);
        }
      }, 0);
    },
    [history, location.pathname, stripBase]
  );

  // Kick authed users away from /login once config is known
  React.useEffect(() => {
    const onLoginPage = /\/login\/?$/.test(location.pathname);
    if (isAuthed && onLoginPage) {
      deferReplace(target);
    }
  }, [isAuthed, location.pathname, target, deferReplace]);

  const { submit, isLoading, error } = useLoginFlow(loginConfig);

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
      errorMessage={error ? "Register failed" : undefined}
    />
  );
}
