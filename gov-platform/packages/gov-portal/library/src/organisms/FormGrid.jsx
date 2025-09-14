import * as React from "react";
import Grid from "@mui/material/Grid";
import InlineCondition from "../form/InlineCondition";

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const GAP_MAP = { s0: 0, s1: 1, s2: 2, s3: 3, s4: 4 };
const mapTokenToNumber = (v) => (typeof v === "string" ? (GAP_MAP[v] ?? null) : typeof v === "number" ? v : null);
const eachBP = (obj, fn) => {
  const bps = ["xs", "sm", "md", "lg", "xl"];
  const out = {};
  for (const bp of bps) if (obj?.[bp] != null) out[bp] = fn(obj[bp]);
  return out;
};

function normalizeGaps({ gap, rowGap, columnGap }) {
  const row = rowGap ?? gap ?? 0;
  const col = columnGap ?? gap ?? 0;
  const toNum = (v) => (isObj(v) ? eachBP(v, mapTokenToNumber) : mapTokenToNumber(v));
  const rowNum = toNum(row);
  const colNum = toNum(col);

  const hasString =
    (isObj(row) && Object.values(row).some((v) => typeof v === "string")) ||
    (isObj(col) && Object.values(col).some((v) => typeof v === "string")) ||
    typeof row === "string" || typeof col === "string";

  const hasNull =
    (isObj(rowNum) && Object.values(rowNum).some((v) => v == null)) ||
    (isObj(colNum) && Object.values(colNum).some((v) => v == null)) ||
    rowNum == null || colNum == null;

  return { rowNum, colNum, hasString, hasNull };
}

/* ---- Item ---- */
export function Item({ span = 12, children, ...rest }) {
  const s = typeof span === "number" || span === "all" ? { xs: span } : (span || {});
  const conv = (v) => (v === "all" ? 12 : typeof v === "number" ? v : undefined);
  return (
    <Grid
      item
      xs={conv(s.xs ?? 12)}
      sm={conv(s.sm ?? s.xs ?? 12)}
      md={conv(s.md ?? s.sm ?? s.xs ?? 12)}
      lg={conv(s.lg ?? s.md ?? s.sm ?? s.xs ?? 12)}
      xl={conv(s.xl ?? s.lg ?? s.md ?? s.sm ?? s.xs ?? 12)}
      {...rest}
    >
      {children}
    </Grid>
  );
}
Item.displayName = "FormGridItem";

/* ---- FormGrid ---- */
export default function FormGrid({
  columns: columnsProp,    // support both
  cols,                    // alias
  gap, rowGap, columnGap, spacing,
  children, className, style, sx, ...rest
}) {
  const columns = columnsProp ?? cols ?? { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };

  const primary = { gap: gap ?? spacing, rowGap: rowGap ?? spacing, columnGap: columnGap ?? spacing };
  const { rowNum, colNum, hasString, hasNull } = normalizeGaps(primary);
  const usePropsGaps = !hasString && !hasNull;

  const gridProps = usePropsGaps
    ? {
        rowSpacing: isObj(rowNum) ? rowNum : (rowNum ?? 0),
        columnSpacing: isObj(colNum) ? colNum : (colNum ?? 0),
        sx,
      }
    : {
        rowSpacing: 0,
        columnSpacing: 0,
        sx: { ...sx, rowGap: isObj(primary.rowGap) ? primary.rowGap : (primary.rowGap ?? 0), columnGap: isObj(primary.columnGap) ? primary.columnGap : (primary.columnGap ?? 0) },
      };

  return (
    <Grid container columns={columns} className={className} style={style} {...gridProps} {...rest}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;

        // InlineCondition → let it render <Item> directly (no wrapper) or null
        if (child.type?.displayName === "InlineCondition") {
          const span = child.props?.span ?? 12;
          return (
            <InlineCondition
              {...child.props}
              noWrapper
              config={{ ...(child.props.config || {}), keepMountedWhenHidden: false }}
            >
              {({ active }) => (active ? <Item key={child.key ?? idx} span={span}>{child.props.children}</Item> : null)}
            </InlineCondition>
          );
        }

        // Already an Item → keep as-is (ensure key)
        if (child.type === Item || child.type?.displayName === "FormGridItem") {
          return React.cloneElement(child, { key: child.key ?? idx });
        }

        // Any other node → wrap in Item
        const span = child.props?.span ?? 12;
        return <Item key={child.key ?? idx} span={span}>{child}</Item>;
      })}
    </Grid>
  );
}

FormGrid.Item = Item;
