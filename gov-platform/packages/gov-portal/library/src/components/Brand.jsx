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
  titleSx,
  subtitleSx,
  labelSx,
  titleVariant = "h6",
  subtitleVariant = "body2",
  sx,
  logoSx,
  
  // NEW: visibility controls
  showLogo = true,
  showTitle = true,
  showSubtitle = true,

  // (optional) legacy/shortcut: hide={['logo','title','subtitle']}
  hide = [],
}) {
  const s = classes || {};
  const _titleSx = titleSx ?? labelSx;

  // normalize visibility (hide[] wins if passed)
  const _showLogo = showLogo && !hide.includes("logo");
  const _showTitle = showTitle && !hide.includes("title");
  const _showSubtitle = showSubtitle && !hide.includes("subtitle");

  return (
    <div className={`${s.brand} ${className}`} style={sx}>
      {_showLogo && logo && (
        <img
          className={s.brandLogo}
          src={logo}
          alt={title || "logo"}
          width={logoWidth}
          height={logoHeight}
          loading="eager"
          decoding="async"
          style={logoSx}
        />
      )}

      {_showTitle && title && (
        <TypographyX variant={titleVariant} sx={_titleSx}>
          {title}
        </TypographyX>
      )}

      {_showSubtitle && subtitle && (
        <TypographyX
          className={s.brandSubtitle}
          variant={subtitleVariant}
          sx={subtitleSx}
        >
          {subtitle}
        </TypographyX>
      )}
    </div>
  );
}
