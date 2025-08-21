import * as React from "react";
import {registerConfig} from "@gov/ui";
import { getComponent } from "@gov/core";
import s from "@gov/styles/modules/auth/Auth.module.scss";
export default function Register() {
  const LoginForm = getComponent("LoginForm");          // resolve from registry
  if (!LoginForm) return <div>LoginForm is not registered</div>;
  return <LoginForm config={registerConfig} />; 
}
