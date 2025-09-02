// components/form/molecules/CheckboxGroup.jsx
import * as React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import s from "@gov/styles/library/form/CheckboxGroup.module.scss";

/**
 * CheckboxGroup — Multi-select checkboxes (controlled). RHF lives in parent.
 *
 * Props:
 * - rhf?                       : { name, value (array), onChange, onBlur, ref }
 * - id, name
 * - value: string[]            : selected values
 * - onChange(next: string[])
 * - onBlur, inputRef
 * - options: Array<{ value, label, disabled?: boolean }>
 * - disabled, readOnly, error
 * - ariaDescribedBy
 * - config: {
 *     size: "sm"|"md",
 *     color: "primary"|"secondary"|"default"|"success"|"error"|"warning"|"info",
 *     marginY: "none"|"xs"|"sm"|"md",
 *     orientation: "vertical"|"horizontal",   // layout direction
 *     gap: "xs"|"sm"|"md"|"lg",
 *     columns: { xs?: number, sm?: number, md?: number, lg?: number, xl?: number } // grid mode if provided
 *     labelPlacement: "end"|"start"|"top"|"bottom",
 *     showSelectAll: boolean,
 *     selectAllLabel: string,
 *   }
 */
const DEFAULT_CFG = {
  size: "md",
  color: "primary",
  marginY: "sm",
  orientation: "vertical",
  gap: "sm",
  columns: null,
  labelPlacement: "end",
  showSelectAll: false,
  selectAllLabel: "Select all",
};

export default function CheckboxGroup({
  rhf,
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  options = [],
  disabled,
  readOnly,
  error,
  ariaDescribedBy,
  config,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  const controlled = rhf
    ? { name: rhf.name, value: rhf.value || [], onChange: rhf.onChange, onBlur: rhf.onBlur, inputRef: rhf.ref }
    : { name, value: value || [], onChange, onBlur, inputRef };

  const selected = Array.isArray(controlled.value) ? controlled.value : [];
  const enabledOpts = options.filter((o) => !o.disabled);
  const allValues = enabledOpts.map((o) => o.value);
  const allChecked = allValues.length > 0 && allValues.every((v) => selected.includes(v));
  const someChecked = allValues.some((v) => selected.includes(v));

  const toggle = (val) => {
    if (readOnly) return;
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    controlled.onChange?.(next);
  };

  const toggleAll = () => {
    if (readOnly) return;
    const next = allChecked ? selected.filter((v) => !allValues.includes(v)) : [...new Set([...selected, ...allValues])];
    controlled.onChange?.(next);
  };

  const rootClass = [
    s.root,
    s[`my--${cfg.marginY}`],
    s[`gap--${cfg.gap}`],
    cfg.columns ? s.grid : s.flex,
    cfg.orientation === "horizontal" ? s.horizontal : s.vertical,
  ].filter(Boolean).join(" ");

  const colVars = cfg.columns
    ? {
        "--cols-xs": cfg.columns.xs || 1,
        "--cols-sm": cfg.columns.sm || cfg.columns.xs || 1,
        "--cols-md": cfg.columns.md || cfg.columns.sm || cfg.columns.xs || 2,
        "--cols-lg": cfg.columns.lg || cfg.columns.md || cfg.columns.sm || 2,
        "--cols-xl": cfg.columns.xl || cfg.columns.lg || cfg.columns.md || 3,
      }
    : undefined;

  return (
    <FormControl
      component="fieldset"
      className={rootClass}
      style={colVars}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error ? "true" : undefined}
      disabled={disabled || readOnly}
    >
      <FormGroup className={s.group}>
        {cfg.showSelectAll ? (
          <FormControlLabel
            className={s.item}
            label={cfg.selectAllLabel}
            labelPlacement={cfg.labelPlacement}
            control={
              <MuiCheckbox
                id={id ? `${id}-all` : undefined}
                name={controlled.name}
                checked={allChecked}
                indeterminate={!allChecked && someChecked}
                onChange={toggleAll}
                onBlur={controlled.onBlur}
                inputRef={controlled.inputRef}
                size={muiSize}
                color={cfg.color}
              />
            }
          />
        ) : null}

        {options.map((opt) => (
          <FormControlLabel
            key={String(opt.value)}
            className={s.item}
            label={opt.label}
            labelPlacement={cfg.labelPlacement}
            control={
              <MuiCheckbox
                id={id ? `${id}-${opt.value}` : undefined}
                name={controlled.name}
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                onBlur={controlled.onBlur}
                inputRef={controlled.inputRef}
                size={muiSize}
                color={cfg.color}
                disabled={disabled || readOnly || opt.disabled}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
