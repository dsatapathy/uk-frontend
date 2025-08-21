import * as React from "react";

/** Positions the auth card using CSS vars + classes only (styling lives in styles/modules/auth/_login.scss).
 *  `styleVars` is a flat object: { "--login-card-w":"480px", ... } or { "login-card-w":"480px" }
 */
export function AuthLayout({ children, className = "", styleVars = {}, place = "center" }) {
  const style = {};
  for (const k in styleVars) {
    style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];
  }
  return (
    <div className={`auth-layout pos-${place} ${className}`} style={style}>
      {children}
    </div>
  );
}
