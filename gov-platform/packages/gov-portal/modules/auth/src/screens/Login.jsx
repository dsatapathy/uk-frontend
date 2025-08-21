import * as React from "react";
import { LoginForm } from "@gov/library";
import {loginConfig} from "@gov/ui";
import s from "@gov/styles/modules/auth/Auth.module.scss";
export default function Login() {
  return (
    <div className={s.page}>
      <LoginForm config={loginConfig} />
    </div>
  );
}
