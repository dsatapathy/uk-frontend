import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import s from "@gov/styles/library/organism/Repeater.module.scss";

/**
 * Repeater — Repeatable group (RHF useFieldArray).
 *
 * Requirements:
 * - Must be rendered inside <FormProvider> / useFormContext
 *
 * Props:
 * - name: string (required) — field array name (e.g., "owners")
 * - renderItem: ({ index, path, item, remove, copy, move, fields, methods }) => ReactNode
 * - min: number = 0
 * - max: number = Infinity
 * - addLabel: string = "Add"
 * - removeLabel: string = "Remove"
 * - itemDefault: object | (index)=>object (default {}) — used by Add/Copy
 * - header: { title?, description?, actionsRight? } — optional header
 * - config: {
 *     variant: "outlined"|"elevated"|"plain",
 *     elevation: 0|1|2|...,
 *     radius: 12,
 *     border: "1px solid var(--g-border)",
 *     gap: { xs:"var(--g-s2)", md:"var(--g-s3)" },
 *     paddingX: { xs:"var(--g-s2)", md:"var(--g-s3)" },
 *     paddingY: { xs:"var(--g-s2)", md:"var(--g-s3)" },
 *     dense: false,
 *     showIndexBadge: true,
 *     showItemToolbar: true,
 *     toolbarPosition: "top"|"bottom",
 *     confirmRemove: false | ((index)=>boolean|Promise<boolean>)
 *   }
 * - onAdd?(index, value), onRemove?(index), onMove?(from, to), onCopy?(index, value)
 */
const DEFAULT_CFG = {
  variant: "outlined",
  elevation: 0,
  radius: 12,
  border: "1px solid var(--g-border, #e5e7eb)",
  gap: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  paddingX: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  paddingY: { xs: "var(--g-s2)", md: "var(--g-s3)" },
  dense: false,
  showIndexBadge: true,
  showItemToolbar: true,
  toolbarPosition: "top",
  confirmRemove: false,
};

const BPS = ["xs", "md"];

function pickR(value, bp) {
  if (!value || typeof value !== "object") return value;
  return value[bp] ?? value.xs ?? value;
}

export default function Repeater({
  name,
  renderItem,
  min = 0,
  max = Infinity,
  addLabel = "Add",
  removeLabel = "Remove",
  itemDefault = {},
  header,
  config,
  onAdd,
  onRemove,
  onMove,
  onCopy,
  className,
  style,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);

  const { control, getValues } = useFormContext();
  const methods = useFieldArray({ control, name });

  const { fields, append, remove, insert, move, update } = methods;

  // Ensure at least `min` items exist
  React.useEffect(() => {
    if (min > 0 && fields.length < min) {
      const needed = min - fields.length;
      const maker = (i) =>
        typeof itemDefault === "function" ? itemDefault(fields.length + i) : { ...(itemDefault || {}) };
      const toAdd = Array.from({ length: needed }, (_, i) => maker(i));
      append(toAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min]); // run once on mount or when min changes intentionally

  const canAdd = fields.length < max;
  const canRemove = fields.length > min;

  const handleAdd = () => {
    if (!canAdd) return;
    const base = typeof itemDefault === "function" ? itemDefault(fields.length) : { ...(itemDefault || {}) };
    append(base);
    onAdd?.(fields.length, base);
  };

  const handleRemove = async (idx) => {
    if (!canRemove) return;
    if (cfg.confirmRemove) {
      const ok =
        typeof cfg.confirmRemove === "function" ? await cfg.confirmRemove(idx) : window.confirm("Remove this item?");
      if (!ok) return;
    }
    remove(idx);
    onRemove?.(idx);
  };

  const handleMove = (from, to) => {
    if (to < 0 || to >= fields.length) return;
    move(from, to);
    onMove?.(from, to);
  };

  const handleCopy = (idx) => {
    if (!canAdd) return;
    const current = getValues(`${name}.${idx}`) || fields[idx] || {};
    const cloned =
      typeof itemDefault === "function" ? { ...itemDefault(idx), ...current } : JSON.parse(JSON.stringify(current));
    insert(idx + 1, cloned);
    onCopy?.(idx, cloned);
  };

  const rootCls = [
    s.root,
    s[`variant--${cfg.variant}`],
    cfg.dense ? s.dense : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Box
      className={rootCls}
      style={{
        "--rp-radius": `${cfg.radius}px`,
        "--rp-border": cfg.border,
        "--rp-gap-xs": pickR(cfg.gap, "xs"),
        "--rp-gap-md": pickR(cfg.gap, "md"),
        "--rp-px-xs": pickR(cfg.paddingX, "xs"),
        "--rp-px-md": pickR(cfg.paddingX, "md"),
        "--rp-py-xs": pickR(cfg.paddingY, "xs"),
        "--rp-py-md": pickR(cfg.paddingY, "md"),
        ...style,
      }}
    >
      {/* Header (optional) */}
      {(header?.title || header?.description || header?.actionsRight) && (
        <div className={s.header}>
          <div className={s.titles}>
            {header?.title ? (
              <Typography variant={cfg.dense ? "subtitle1" : "h6"} className={s.title}>
                {header.title}
              </Typography>
            ) : null}
            {header?.description ? (
              <Typography variant="body2" color="text.secondary" className={s.description}>
                {header.description}
              </Typography>
            ) : null}
          </div>

          <div className={s.headerActions}>
            {header?.actionsRight}
            <Button
              onClick={handleAdd}
              size={cfg.dense ? "small" : "medium"}
              startIcon={<AddIcon />}
              disabled={!canAdd}
              variant="contained"
            >
              {addLabel}
            </Button>
          </div>
        </div>
      )}

      {/* Items */}
      <div className={s.items}>
        {fields.map((item, index) => {
          const path = `${name}.${index}`;

          const toolbar = (
            <div className={s.itemToolbar}>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleMove(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUpwardIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleMove(index, index + 1)}
                    disabled={index === fields.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDownwardIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Copy">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(index)}
                    disabled={!canAdd}
                    aria-label="Copy"
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={removeLabel}>
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(index)}
                    disabled={!canRemove}
                    aria-label={removeLabel}
                  >
                    <DeleteOutlineIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          );

          return (
            <div key={item.id} className={s.item} aria-label={`repeater-item-${index}`}>
              {/* Item header */}
              <div className={s.itemHeader}>
                {cfg.showIndexBadge ? <div className={s.indexBadge}>{index + 1}</div> : <span />}
                {cfg.showItemToolbar && cfg.toolbarPosition === "top" ? toolbar : <span />}
              </div>

              {/* Item body (your fields) */}
              <div className={s.itemBody}>
                {renderItem?.({
                  index,
                  path,
                  item,
                  fields,
                  methods: { append, remove, insert, move, update },
                  remove: () => handleRemove(index),
                  copy: () => handleCopy(index),
                  moveUp: () => handleMove(index, index - 1),
                  moveDown: () => handleMove(index, index + 1),
                })}
              </div>

              {/* Bottom toolbar (optional position) */}
              {cfg.showItemToolbar && cfg.toolbarPosition === "bottom" ? (
                <div className={s.itemFooter}>{toolbar}</div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Footer add (if no header provided) */}
      {!header?.title && !header?.actionsRight ? (
        <div className={s.footer}>
          <Button
            onClick={handleAdd}
            size={cfg.dense ? "small" : "medium"}
            startIcon={<AddIcon />}
            disabled={!canAdd}
            variant="contained"
          >
            {addLabel}
          </Button>
        </div>
      ) : null}
    </Box>
  );
}
