import * as React from "react";

export function Brand({ logo, title, subtitle, className = "", logoWidth=160, logoHeight=64, classes }) {
  const s = classes || {};
  return (
    <div className={`${s.brand} ${className}`}>
      {logo && <img
          className={s.brandLogo}
          src={logo}
          alt={title || "logo"}
          width={logoWidth}
          height={logoHeight}
          loading="eager"
          decoding="async"
        />}
      {title && <div className={s.brandTitle}>{title}</div>}
      {subtitle && <div className={s.brandSubtitle}>{subtitle}</div>}
    </div>
  );
}
