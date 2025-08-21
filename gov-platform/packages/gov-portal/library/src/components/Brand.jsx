import * as React from "react";

export function Brand({ logo, title, subtitle, className = "", classes }) {
  const s = classes || {};
  return (
    <div className={`${s.brand} ${className}`}>
      {logo && <img className={s.brandLogo} src={logo} alt={title || "logo"} />}
      {title && <div className={s.brandTitle}>{title}</div>}
      {subtitle && <div className={s.brandSubtitle}>{subtitle}</div>}
    </div>
  );
}
