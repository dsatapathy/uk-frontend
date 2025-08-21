import * as React from "react";
import defaultS from "@gov/styles/modules/auth/Auth.module.scss";

export function AuthLayout({ children, className = "", styleVars = {}, place = "center", classes }) {
  const s = classes || defaultS;                       // ← overrideable styles
  const style = {};
  for (const k in styleVars) style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];
  const pos = s[`pos-${place}`] || "";

  return (
    <div className={`${s.authLayout} ${pos} ${className}`} style={style}>
      {children}
    </div>
  );
}
