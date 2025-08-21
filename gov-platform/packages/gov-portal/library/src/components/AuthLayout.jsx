import * as React from "react";

import s from "@gov/styles/modules/auth/Auth.module.scss";
export function AuthLayout({ children, className = "", styleVars = {}, place = "center" }) {
  const style = {};
  for (const k in styleVars) style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];
  return (
    <div className={`${s.authLayout} ${s[`pos-${place}`] || ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

