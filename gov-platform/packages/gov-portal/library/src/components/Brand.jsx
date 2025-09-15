// components/Brand.jsx
import * as React from "react";
import TypographyX from "../atoms/TypographyX";

export function Brand({
  logo,
  title,
  subtitle,
  className = "",
  logoWidth = 160,
  logoHeight = 64,
  classes,
  titleSx,          // <— preferred prop name
  subtitleSx,
  labelSx,          // <— optional alias to support "labelSx"
  titleVariant = "h6",
  subtitleVariant = "body2",
}) {
  const s = classes || {};
  const _titleSx = titleSx ?? labelSx;  // alias if you pass "labelSx"

  return (
    <div className={`${s.brand} ${className}`}>
      {logo && (
        <img
          className={s.brandLogo}
          src={logo}
          alt={title || "logo"}
          width={logoWidth}
          height={logoHeight}
          loading="eager"
          decoding="async"
        />
      )}
      {title && (
        <TypographyX variant={titleVariant} sx={_titleSx}>
          {title}
        </TypographyX>
      )}
      {subtitle && (
        <TypographyX className={s.brandSubtitle} variant={subtitleVariant} sx={subtitleSx}>
          {subtitle}
        </TypographyX>
      )}
    </div>
  );
}
