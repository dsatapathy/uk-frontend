import * as React from "react";
import s from "@gov/styles/library/organism/FieldRow.module.scss";

const BPS = ["xs", "sm", "md", "lg", "xl"];
const DEFAULT_CFG = {
  cols: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
  gap:  { xs: "s2", sm: "s2", md: "s3", lg: "s3", xl: "s3" },
  stackOn: null, // "sm"|"md"|"lg"|"xl" or null
};

/** Normalize number|string or responsive object into full bp map */
function toResponsive(input, fallback) {
  if (input == null) return fallback;
  if (typeof input === "number" || typeof input === "string") {
    const all = {};
    for (const bp of BPS) all[bp] = input;
    return all;
  }
  // assume object of breakpoint keys
  const out = { ...fallback };
  for (const bp of BPS) if (input[bp] != null) out[bp] = input[bp];
  return out;
}

function applyStack(cols, stackOn) {
  if (!stackOn) return cols;
  const idx = BPS.indexOf(stackOn);
  if (idx < 0) return cols;
  const out = { ...cols };
  for (let i = 0; i <= idx - 1; i++) out[BPS[i]] = 1; // below stackOn → 1 col
  return out;
}

/** Convert gap token (e.g. "s2") into CSS var --g-s2; allow raw CSS length too */
function gapToCss(v) {
  if (v == null) return null;
  if (typeof v === "number") return `${v}px`;
  if (/^\d/.test(v) || v.includes("rem") || v.includes("px")) return v;
  // token name -> var(--g-sX)
  return `var(--g-${v})`;
}

/** Col wrapper for per-child spans */
export function Col({ span = 1, children }) {
  // span can be number or { xs, sm, md, lg, xl } or "all"
  const spanMap =
    typeof span === "number" || span === "all"
      ? Object.fromEntries(BPS.map((bp) => [bp, span]))
      : span || {};

  const style = {
    "--fr-col-span": spanMap.xs === "all" ? "all" : spanMap.xs || 1,
    "--fr-col-span-sm": spanMap.sm === "all" ? "all" : spanMap.sm ?? spanMap.xs ?? 1,
    "--fr-col-span-md": spanMap.md === "all" ? "all" : spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1,
    "--fr-col-span-lg": spanMap.lg === "all" ? "all" : spanMap.lg ?? spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1,
    "--fr-col-span-xl": spanMap.xl === "all" ? "all" : spanMap.xl ?? spanMap.lg ?? spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1,
  };
  return <div className={s.col} style={style}>{children}</div>;
}

/**
 * FieldRow — responsive grid row for fields.
 *
 * Props:
 * - cols     : number | { xs, sm, md, lg, xl }
 * - gap      : token|"8px" | { xs, sm, md, lg, xl }
 * - stackOn  : "sm"|"md"|"lg"|"xl"|null
 * - config   : same shape as above to set defaults; merged with component defaults
 * - children : usually <FieldWrapper/> items. You may wrap with <FieldRow.Col span={...}> for custom spans.
 *
 * Auto-span: If a child has props `gridSpan` or `grid?.span`, it will be auto-wrapped.
 */
export default function FieldRow({
  cols,
  gap,
  stackOn,
  config,
  children,
  className,
  style,
  ...rest
}) {
  const cfg = React.useMemo(() => {
    const base = { ...DEFAULT_CFG, ...(config || {}) };
    const colsR = applyStack(
      toResponsive(cols ?? base.cols, base.cols),
      stackOn ?? base.stackOn
    );
    const gapR = toResponsive(gap ?? base.gap, base.gap);

    return { cols: colsR, gap: gapR, stackOn: stackOn ?? base.stackOn };
  }, [cols, gap, stackOn, config]);

  const styleVars = {
    "--fr-cols": String(cfg.cols.xs),
    "--fr-cols-sm": String(cfg.cols.sm),
    "--fr-cols-md": String(cfg.cols.md),
    "--fr-cols-lg": String(cfg.cols.lg),
    "--fr-cols-xl": String(cfg.cols.xl),
    "--fr-gap": gapToCss(cfg.gap.xs),
    "--fr-gap-sm": gapToCss(cfg.gap.sm),
    "--fr-gap-md": gapToCss(cfg.gap.md),
    "--fr-gap-lg": gapToCss(cfg.gap.lg),
    "--fr-gap-xl": gapToCss(cfg.gap.xl),
    ...style,
  };

  // Auto-wrap children that advertise span on their props
  const nodes = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const advertised =
      child.props?.gridSpan ||
      child.props?.span ||
      child.props?.grid?.span;

    if (!advertised) return child;
    return <Col span={advertised}>{child}</Col>;
  });

  const cls = [s.root, className].filter(Boolean).join(" ");

  return (
    <div className={cls} style={styleVars} {...rest}>
      {nodes}
    </div>
  );
}

FieldRow.Col = Col;
