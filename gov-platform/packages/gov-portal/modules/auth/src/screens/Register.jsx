import * as React from "react";
import { registerConfig } from "@gov/ui";
import { getComponent } from "@gov/core";
// import { useAuth } from "@gov/ui-engine";

export default function Register() {
  const LoginForm = getComponent("LoginForm");
  // const { tokens } = useAuth();

  // React.useEffect(() => {
  //   const stored = tokens?.access ||
  //     localStorage.getItem("uk-portal::uk.access") ||
  //     sessionStorage.getItem("uk-portal::uk.access");
  //   if (stored) window.location.replace("/uk-portal/bpa");
  // }, [tokens]);

  if (!LoginForm) return <div>LoginForm is not registered</div>;
  return <LoginForm config={registerConfig} />;
}