// components/form/molecules/RadioGroup.jsx
import * as React from "react";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import s from "@gov/styles/library/form/RadioGroup.module.scss";

/**
 * RadioGroup — Single-selection group.
 *
 * Props:
 * - rhf?                 : { name, value, onChange, onBlur, ref }
 * - id, name
 * - value, onChange(nextValue: string), onBlur, inputRef
 * - options              : Array<{ value, label, disabled?: boolean }>
 * - disabled, readOnly, error
 * - ariaDescribedBy
 * - config: {
 *     size: "sm"|"md",
 *     color: "primary"|"secondary"|"default"|"success"|"error"|"warning"|"info",
 *     marginY: "none"|"xs"|"sm"|"md",
 *     orientation: "vertical"|"horizontal",
 *     gap: "xs"|"sm"|"md"|"lg",
 *     columns?: { xs?:number, sm?:number, md?:number, lg?:number, xl?:number }, // grid layout
 *     labelPlacement: "end"|"start"|"top"|"bottom",
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
};

export default function RadioGroup({
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
    ? { name: rhf.name, value: rhf.value ?? "", onChange: rhf.onChange, onBlur: rhf.onBlur, inputRef: rhf.ref }
    : { name, value: value ?? "", onChange, onBlur, inputRef };

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
      <MuiRadioGroup
        name={controlled.name}
        value={controlled.value}
        onChange={(_, v) => !readOnly && controlled.onChange?.(v)}
        onBlur={controlled.onBlur}
        // MUI's RadioGroup doesn't accept ref for input; pass to individual if needed
      >
        <div className={s.group}>
          {options.map((opt) => (
            <FormControlLabel
              key={String(opt.value)}
              className={s.item}
              label={opt.label}
              labelPlacement={cfg.labelPlacement}
              control={
                <MuiRadio
                  id={id ? `${id}-${opt.value}` : undefined}
                  value={opt.value}
                  size={muiSize}
                  color={cfg.color}
                  disabled={disabled || readOnly || opt.disabled}
                  inputProps={{
                    "aria-describedby": ariaDescribedBy,
                  }}
                />
              }
            />
          ))}
        </div>
      </MuiRadioGroup>
    </FormControl>
  );
}
