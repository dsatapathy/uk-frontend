import * as React from "react";

export function AuthLayout({ children, className = "", styleVars = {}, place = "center", classes }) {
  const s = classes || {};                       // ← overrideable styles
  const style = {};
  for (const k in styleVars) style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];
  const pos = s[`pos-${place}`] || "";

  return (
    <div className={`${s.authLayout} ${pos} ${className}`} style={style}>
      {children}
    </div>
  );
}
