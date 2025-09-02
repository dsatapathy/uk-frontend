// components/form/atoms/Checkbox.jsx
import * as React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import s from "@gov/styles/library/form/Checkbox.module.scss";

/**
 * Checkbox — Boolean toggle (controlled). RHF lives in parent (pass `rhf`).
 *
 * Props:
 * - rhf?                       : { name, value, onChange, onBlur, ref }
 * - id, name
 * - checked, onChange(next: boolean), onBlur, inputRef
 * - label                      : string | node
 * - indeterminate              : boolean
 * - disabled, readOnly, error  : booleans
 * - ariaDescribedBy            : string
 * - config                     : {
 *      size: "sm"|"md",          // maps to MUI size
 *      color: "primary"|"secondary"|"default"|"success"|"error"|"warning"|"info",
 *      marginY: "none"|"xs"|"sm"|"md",
 *      labelPlacement: "end"|"start"|"top"|"bottom",
 *   }
 */
const DEFAULT_CFG = {
  size: "md",
  color: "primary",
  marginY: "sm",
  labelPlacement: "end",
};

export default function Checkbox({
  rhf,
  id,
  name,
  checked: checkedProp = false,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  inputRef,
  label,
  indeterminate,
  disabled,
  readOnly,
  error,
  ariaDescribedBy,
  config,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  // Unify RHF → controlled
  const controlled = rhf
    ? {
        name: rhf.name,
        checked: !!rhf.value,
        onChange: (_, v) => rhf.onChange(v),
        onBlur: rhf.onBlur,
        inputRef: rhf.ref,
      }
    : {
        name,
        checked: !!checkedProp,
        onChange: (_, v) => onChangeProp?.(v),
        onBlur: onBlurProp,
        inputRef,
      };

  const rootClass = [s.root, s[`my--${cfg.marginY}`]].join(" ");

  return (
    <div className={rootClass} aria-invalid={error ? "true" : undefined}>
      <FormControlLabel
        className={s.item}
        label={label}
        labelPlacement={cfg.labelPlacement}
        control={
          <MuiCheckbox
            id={id}
            name={controlled.name}
            checked={controlled.checked}
            onChange={(e, v) => {
              if (readOnly) return;
              controlled.onChange?.(e, v);
            }}
            onBlur={controlled.onBlur}
            inputRef={controlled.inputRef}
            indeterminate={!!indeterminate}
            size={muiSize}
            color={cfg.color}
            disabled={disabled || readOnly}
            inputProps={{
              "aria-describedby": ariaDescribedBy,
            }}
          />
        }
      />
    </div>
  );
}
