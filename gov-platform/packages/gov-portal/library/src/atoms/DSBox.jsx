// atoms/DSBox.jsx  (fully responsive)
import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { surfaceSx } from "../utils/variants";

/** token sizes for radius */
const RADIUS_TOKENS = { sm: 8, md: 12, lg: 16, xl: 20 };

/** helpers */
const isObj = (v) => v != null && typeof v === "object" && !Array.isArray(v);

/** radius can be number | token | responsive object of those */
function resolveRadius(radius) {
  if (isObj(radius)) {
    const out = {};
    for (const bp in radius) {
      const v = radius[bp];
      out[bp] = typeof v === "number" ? v : (RADIUS_TOKENS[v] ?? 12);
    }
    return out;
  }
  return typeof radius === "number" ? radius : (RADIUS_TOKENS[radius] ?? 12);
}

/** elevation can be number | responsive map of numbers */
function resolveShadow(elevation, theme) {
  if (isObj(elevation)) {
    const out = {};
    for (const bp in elevation) {
      const v = elevation[bp] ?? 0;
      out[bp] = theme.shadows[Math.max(0, Math.min(theme.shadows.length - 1, v))];
    }
    return out;
  }
  const v = elevation ?? 0;
  return theme.shadows[Math.max(0, Math.min(theme.shadows.length - 1, v))];
}

/** grid helpers: number -> repeat(n, minmax(0,1fr)) */
function toTemplate(val) {
  if (typeof val === "number") return `repeat(${val}, minmax(0,1fr))`;
  if (isObj(val)) {
    const out = {};
    for (const bp in val) {
      const v = val[bp];
      out[bp] = typeof v === "number" ? `repeat(${v}, minmax(0,1fr))` : v;
    }
    return out;
  }
  return val; // string or undefined
}

/**
 * DSBox — responsive, prop-driven container.
 */
const DSBox = React.memo(function DSBox({
  as,                                 // component override
  intent = "neutral",                 // primary|neutral|success|warning|danger
  variant = "ghost",                  // solid|soft|outline|ghost
  radius = "md",                      // sm|md|lg|xl|number|{xs:number|token,...}
  elevation = 0,                      // number|{xs:number,...}
  p, px, py, pt, pr, pb, pl, gap,     // spacing
  display, direction, align, justify, wrap,
  grid, gridCols, gridRows, gridGap,  // grid
  clickable = false,
  hoverRaise = false,
  sx,
  children,
  ...rest
}) {
  const theme = useTheme();

  const br = resolveRadius(radius);
  const shadow = elevation ? resolveShadow(elevation, theme) : undefined;

  const baseSx = {
    minWidth: 0,                      // prevents overflow on small screens
    borderRadius: br,
    ...(elevation ? { boxShadow: shadow } : {}),
    ...surfaceSx(theme, { intent, variant }),
    ...(clickable ? { cursor: "pointer", userSelect: "none" } : {}),
    ...(hoverRaise
      ? {
          transition: "transform .18s ease, box-shadow .18s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              typeof elevation === "number"
                ? theme.shadows[Math.min(6, (elevation || 2) + 2)]
                : undefined, // if responsive elevation, let it be
          },
        }
      : {}),
    ...(display ? { display } : {}),
    ...(direction ? { flexDirection: direction } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyContent: justify } : {}),
    ...(wrap ? { flexWrap: wrap } : {}),
    ...(grid ? { display: "grid" } : {}),
    ...(gridCols ? { gridTemplateColumns: toTemplate(gridCols) } : {}),
    ...(gridRows ? { gridTemplateRows: toTemplate(gridRows) } : {}),
    ...(gridGap ? { gap: gridGap } : {}),
    ...(p  !== undefined ? { p }  : {}),
    ...(px !== undefined ? { px } : {}),
    ...(py !== undefined ? { py } : {}),
    ...(pt !== undefined ? { pt } : {}),
    ...(pr !== undefined ? { pr } : {}),
    ...(pb !== undefined ? { pb } : {}),
    ...(pl !== undefined ? { pl } : {}),
    ...(gap !== undefined ? { gap } : {}),
    ...sx,
  };

  return (
    <Box component={as} sx={baseSx} {...rest}>
      {children}
    </Box>
  );
});

export default DSBox;
