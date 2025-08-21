import * as React from "react";

import s from "@gov/styles/modules/auth/Auth.module.scss";
export function AuthLayout({ children, className = "", styleVars = {}, place = "center" }) {
  const style = {};
  for (const k in styleVars) style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];

  // maps "center" -> s["pos-center"], etc.
  const pos = s[`pos-${place}`] || "";

  return (
    <div className={`${s.authLayout} ${pos} ${className}`} style={style}>
      {children}
    </div>
  );
}

