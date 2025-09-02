import * as React from "react";
import s from "@gov/styles/library/organism/FormGrid.module.scss";

const BPS = ["xs", "sm", "md", "lg", "xl"];

const DEFAULT_CFG = {
  cols: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
  gap:  { xs: "s2", sm: "s2", md: "s3", lg: "s3", xl: "s3" }, // token or CSS length
  rowGap: null,             // override gap rows
  columnGap: null,          // override gap columns
  flow: "row dense",        // grid-auto-flow
  autoRows: "minmax(3rem, auto)",  // fallback height for rows auto-created
  autoCols: "auto",
  areas: null,              // responsive template: string | string[] rows | { xs, sm, ... }
  // example areas value:
  // areas: {
  //   xs: [["applicant","applicant"],["location","location"]],
  //   md: [["applicant","location"], ["building","attachments"]],
  // }
};

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function toResponsive(input, fallback) {
  if (input == null) return fallback;
  if (!isObj(input)) {
    const all = {};
    for (const bp of BPS) all[bp] = input;
    return all;
  }
  const out = { ...fallback };
  for (const bp of BPS) if (input[bp] != null) out[bp] = input[bp];
  return out;
}

function gapToCss(v) {
  if (v == null) return null;
  if (typeof v === "number") return `${v}px`;
  if (/^\d/.test(v) || /rem|px|em|%$/.test(String(v))) return String(v);
  // treat as token name: s1/s2/s3 -> var(--g-s2)
  return `var(--g-${v})`;
}

function rowsToTemplate(val) {
  // accepts string | string[] rows | matrix string[][]
  if (val == null) return null;
  if (typeof val === "string") return val; // assume already like `"a a" "b b"`
  if (Array.isArray(val)) {
    if (Array.isArray(val[0])) {
      // matrix rows: [["a","a"],["b","c"]] -> `"a a" "b c"`
      return val.map(row => `"${row.join(" ")}"`).join(" ");
    }
    // array of row strings: ['"a a"','"b b"'] OR ['a a','b b']
    return val.map(r => (r.includes('"') ? r : `"${r}"`)).join(" ");
  }
  return null;
}

/** Item wrapper: assign grid area / spans responsively */
export function Item({ area, span = 1, rowSpan, children, style, className }) {
  // span & rowSpan can be number | "all" | { xs, sm, ... }
  const spanMap =
    typeof span === "number" || span === "all"
      ? Object.fromEntries(BPS.map((bp) => [bp, span]))
      : (span || {});
  const rowSpanMap =
    typeof rowSpan === "number" || rowSpan === "all"
      ? Object.fromEntries(BPS.map((bp) => [bp, rowSpan]))
      : (rowSpan || {});
  const areaMap = isObj(area)
    ? area
    : Object.fromEntries(BPS.map((bp) => [bp, area || ""]));

  const styleVars = {
    "--fgd-area": areaMap.xs || "",
    "--fgd-area-sm": areaMap.sm ?? areaMap.xs ?? "",
    "--fgd-area-md": areaMap.md ?? areaMap.sm ?? areaMap.xs ?? "",
    "--fgd-area-lg": areaMap.lg ?? areaMap.md ?? areaMap.sm ?? areaMap.xs ?? "",
    "--fgd-area-xl": areaMap.xl ?? areaMap.lg ?? areaMap.md ?? areaMap.sm ?? areaMap.xs ?? "",

    "--fgd-span": spanMap.xs === "all" ? "all" : (spanMap.xs || 1),
    "--fgd-span-sm": spanMap.sm === "all" ? "all" : (spanMap.sm ?? spanMap.xs ?? 1),
    "--fgd-span-md": spanMap.md === "all" ? "all" : (spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1),
    "--fgd-span-lg": spanMap.lg === "all" ? "all" : (spanMap.lg ?? spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1),
    "--fgd-span-xl": spanMap.xl === "all" ? "all" : (spanMap.xl ?? spanMap.lg ?? spanMap.md ?? spanMap.sm ?? spanMap.xs ?? 1),

    "--fgd-row-span": rowSpanMap.xs === "all" ? "all" : (rowSpanMap.xs || 1),
    "--fgd-row-span-sm": rowSpanMap.sm === "all" ? "all" : (rowSpanMap.sm ?? rowSpanMap.xs ?? 1),
    "--fgd-row-span-md": rowSpanMap.md === "all" ? "all" : (rowSpanMap.md ?? rowSpanMap.sm ?? rowSpanMap.xs ?? 1),
    "--fgd-row-span-lg": rowSpanMap.lg === "all" ? "all" : (rowSpanMap.lg ?? rowSpanMap.md ?? rowSpanMap.sm ?? rowSpanMap.xs ?? 1),
    "--fgd-row-span-xl": rowSpanMap.xl === "all" ? "all" : (rowSpanMap.xl ?? rowSpanMap.lg ?? rowSpanMap.md ?? rowSpanMap.sm ?? rowSpanMap.xs ?? 1),
    ...style,
  };

  const cls = [s.item, className].filter(Boolean).join(" ");
  return <div className={cls} style={styleVars}>{children}</div>;
}

/**
 * FormGrid — responsive CSS Grid for full form layout.
 *
 * Props:
 * - as         : string | component (container tag), default "div"
 * - cols       : number | { xs, sm, md, lg, xl }
 * - gap        : token|"8px" | { xs, sm, md, lg, xl }
 * - rowGap     : same as gap (overrides row gap)
 * - columnGap  : same as gap (overrides column gap)
 * - flow       : grid-auto-flow (e.g. "row dense")
 * - autoRows   : string (e.g. "minmax(3rem,auto)")
 * - autoCols   : string
 * - areas      : string | string[] | string[][] | { xs, sm, md, lg, xl }
 * - children   : nodes; may be auto-wrapped when child.props.area / gridSpan present
 *
 * Auto-wrap rules:
 * - If a child has props.area OR props.grid?.area → wrap in <FormGrid.Item area=...>
 * - If a child has props.gridSpan OR props.grid?.span → wrap in <FormGrid.Item span=...>
 */
export default function FormGrid({
  as: As = "div",
  cols,
  gap,
  rowGap,
  columnGap,
  flow,
  autoRows,
  autoCols,
  areas,
  children,
  className,
  style,
  config,
  ...rest
}) {
  const cfg = React.useMemo(() => {
    const base = { ...DEFAULT_CFG, ...(config || {}) };
    const colsR = toResponsive(cols ?? base.cols, base.cols);
    const gapR  = toResponsive(gap ?? base.gap, base.gap);
    const rowGR = rowGap != null ? toResponsive(rowGap, base.rowGap) : null;
    const colGR = columnGap != null ? toResponsive(columnGap, base.columnGap) : null;

    // normalize areas responsive
    const ar = areas ?? base.areas;
    const areasR = isObj(ar)
      ? Object.fromEntries(BPS.map(bp => [bp, rowsToTemplate(ar[bp])]))
      : Object.fromEntries(BPS.map((bp, i) => [bp, rowsToTemplate(i === 0 ? ar : null)]));

    return {
      cols: colsR,
      gap: gapR,
      rowGap: rowGR,
      columnGap: colGR,
      flow: flow ?? base.flow,
      autoRows: autoRows ?? base.autoRows,
      autoCols: autoCols ?? base.autoCols,
      areas: areasR,
    };
  }, [cols, gap, rowGap, columnGap, flow, autoRows, autoCols, areas, config]);

  const vars = {
    "--fgd-cols": String(cfg.cols.xs),
    "--fgd-cols-sm": String(cfg.cols.sm),
    "--fgd-cols-md": String(cfg.cols.md),
    "--fgd-cols-lg": String(cfg.cols.lg),
    "--fgd-cols-xl": String(cfg.cols.xl),

    "--fgd-gap": gapToCss(cfg.gap.xs),
    "--fgd-gap-sm": gapToCss(cfg.gap.sm),
    "--fgd-gap-md": gapToCss(cfg.gap.md),
    "--fgd-gap-lg": gapToCss(cfg.gap.lg),
    "--fgd-gap-xl": gapToCss(cfg.gap.xl),

    "--fgd-row-gap": cfg.rowGap ? gapToCss(cfg.rowGap.xs) : undefined,
    "--fgd-row-gap-sm": cfg.rowGap ? gapToCss(cfg.rowGap.sm) : undefined,
    "--fgd-row-gap-md": cfg.rowGap ? gapToCss(cfg.rowGap.md) : undefined,
    "--fgd-row-gap-lg": cfg.rowGap ? gapToCss(cfg.rowGap.lg) : undefined,
    "--fgd-row-gap-xl": cfg.rowGap ? gapToCss(cfg.rowGap.xl) : undefined,

    "--fgd-col-gap": cfg.columnGap ? gapToCss(cfg.columnGap.xs) : undefined,
    "--fgd-col-gap-sm": cfg.columnGap ? gapToCss(cfg.columnGap.sm) : undefined,
    "--fgd-col-gap-md": cfg.columnGap ? gapToCss(cfg.columnGap.md) : undefined,
    "--fgd-col-gap-lg": cfg.columnGap ? gapToCss(cfg.columnGap.lg) : undefined,
    "--fgd-col-gap-xl": cfg.columnGap ? gapToCss(cfg.columnGap.xl) : undefined,

    "--fgd-areas": cfg.areas?.xs || "none",
    "--fgd-areas-sm": cfg.areas?.sm || "none",
    "--fgd-areas-md": cfg.areas?.md || "none",
    "--fgd-areas-lg": cfg.areas?.lg || "none",
    "--fgd-areas-xl": cfg.areas?.xl || "none",

    "--fgd-auto-rows": cfg.autoRows,
    "--fgd-auto-cols": cfg.autoCols,
  };

  // Auto-wrap children advertising area/span
  const nodes = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const advertisedArea = child.props?.area || child.props?.grid?.area;
    const advertisedSpan = child.props?.gridSpan || child.props?.span || child.props?.grid?.span;
    const advertisedRowSpan = child.props?.rowSpan || child.props?.grid?.rowSpan;

    if (!advertisedArea && !advertisedSpan && !advertisedRowSpan) return child;

    return (
      <Item area={advertisedArea} span={advertisedSpan} rowSpan={advertisedRowSpan}>
        {child}
      </Item>
    );
  });

  const cls = [s.root, className].filter(Boolean).join(" ");

  return (
    <As
      className={cls}
      style={{ ...vars, gridAutoFlow: cfg.flow, ...style }}
      {...rest}
    >
      {nodes}
    </As>
  );
}

FormGrid.Item = Item;
