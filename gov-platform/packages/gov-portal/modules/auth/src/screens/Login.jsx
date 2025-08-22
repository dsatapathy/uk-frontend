import * as React from "react";
import { loginConfig } from "@gov/ui";
import { getComponent } from "@gov/core";
import { useAuth } from "@gov/ui-engine";
import { useLogin } from "@gov/data";

export default function Login() {
  const LoginForm = getComponent("LoginForm");
  const { tokens, setAuth } = useAuth();
  const login = useLogin();

  React.useEffect(() => {
    const stored = tokens?.access ||
      localStorage.getItem("uk-portal::uk.access") ||
      sessionStorage.getItem("uk-portal::uk.access");
    if (stored) window.location.replace("/uk-portal/bpa");
  }, [tokens]);

  if (!LoginForm) return <div>LoginForm is not registered</div>;

  const handleSubmit = (payload) => {
    const { remember, ...body } = payload;
    return login.mutateAsync(body);
  };

  const handleSuccess = (res, payload) => {
    const remember = payload?.remember;
    setAuth(
      { user: res.user, tokens: { access: res.accessToken, refresh: res.refreshToken } },
      { remember }
    );
    window.location.replace("/uk-portal/bpa");
  };

  return <LoginForm config={loginConfig} onSubmit={handleSubmit} onSuccess={handleSuccess} />;
}