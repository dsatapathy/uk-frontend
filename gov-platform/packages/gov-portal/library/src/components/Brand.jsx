import * as React from "react";
import s from "@gov/styles/modules/auth/Auth.module.scss";
export function Brand({ logo, title, subtitle, className = "" }) {
  return (
    <div className={`${s.brand} ${className}`}>
      {logo && <img className={s.brandLogo} src={logo} alt={title || "logo"} />}
      {title && <div className={s.brandTitle}>{title}</div>}
      {subtitle && <div className={s.brandSubtitle}>{subtitle}</div>}
    </div>
  );
}

