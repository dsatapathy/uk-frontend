import * as React from "react";
export function Brand({ logo, title, subtitle, className = "" }) {
  return (
    <div className={`brand ${className}`}>
      {logo ? <img className="brand-logo" src={logo} alt={title || "logo"} /> : null}
      {title ? <div className="brand-title">{title}</div> : null}
      {subtitle ? <div className="brand-subtitle">{subtitle}</div> : null}
    </div>
  );
}
