import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import s from "@gov/styles/library/form/TextArea.module.scss";

/**
 * Dropdown — Select input (controlled). RHF lives in parent (pass `rhf`).
 *
 * Props:
 * - rhf?                 : RHF field: { name, value, onChange, onBlur, ref }
 * - id, name
 * - value, onChange(next: string), onBlur
 * - placeholder
 * - options              : array of { label, value }
 * - error                : boolean
 * - disabled, readOnly
 * - ariaDescribedBy      : string (ids to append; wrapper can pass helper/error)
 * - inputRef             : React ref to native select
 * - config               : {
 *      variant: "outlined"|"filled"|"standard",
 *      size: "sm"|"md",
 *      fullWidth: boolean,
 *      marginY: "none"|"xs"|"sm"|"md",
 *      autoComplete: string,
 *    }
 * - textFieldProps, inputProps
 */
const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",
  fullWidth: true,
  marginY: "sm",
  autoComplete: "off",
};

const OPTION_SX = { fontSize: "var(--g-font-size-md, 0.875rem)" };
const PLACEHOLDER_STYLE = {
  color: "var(--field-placeholder, var(--g-fg-muted, rgba(100, 116, 139, 0.85)))",
};

export default function Dropdown({
  rhf,

  id,
  name,
  value: valueProp = "",
  onChange: onChangeProp,
  onBlur: onBlurProp,
  inputRef,

  placeholder,
  options = [],

  error,
  disabled,
  readOnly,
  ariaDescribedBy,

  config,
  textFieldProps,
  inputProps,
}) {
  // unify RHF → controlled
  const controlled = rhf
    ? { name: rhf.name, value: rhf.value ?? "", onChange: rhf.onChange, onBlur: rhf.onBlur, inputRef: rhf.ref }
    : { name, value: valueProp, onChange: onChangeProp, onBlur: onBlurProp, inputRef };

  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  const rootClass = [s.root, s[`my--${cfg.marginY}`]].join(" ");
  const describedBy = [ariaDescribedBy].filter(Boolean).join(" ");
  const isEmpty = controlled.value === undefined || controlled.value === null || controlled.value === "";

  const tfProps = { ...(textFieldProps || {}) };
  const selectProps = { ...(tfProps.SelectProps || {}) };
  delete tfProps.SelectProps;

  if (placeholder) {
    if (selectProps.displayEmpty === undefined) selectProps.displayEmpty = true;
    if (!selectProps.renderValue) {
      selectProps.renderValue = (selected) => {
        if (isEmpty || selected === "" || selected === undefined || selected === null) {
          return <span style={PLACEHOLDER_STYLE}>{placeholder}</span>;
        }

        if (Array.isArray(selected)) {
          if (!selected.length) return <span style={PLACEHOLDER_STYLE}>{placeholder}</span>;
          return selected
            .map((val) => options.find((opt) => opt.value === val)?.label ?? val)
            .join(", ");
        }

        const match = options.find((opt) => opt.value === selected);
        return match ? match.label : selected;
      };
    }
  }

  return (
    <div className={rootClass}>
      <TextField
        select
        id={id}
        name={controlled.name}
        value={controlled.value}
        onChange={(e) => {
          const next = e.target.value;
          controlled.onChange?.(next);
        }}
        onBlur={controlled.onBlur}
        inputRef={controlled.inputRef}
        placeholder={placeholder}
        variant={cfg.variant}
        size={muiSize}
        fullWidth={cfg.fullWidth}
        disabled={disabled}
        error={!!error}
        InputProps={{
          readOnly,
        }}
        SelectProps={selectProps}
        inputProps={{
          autoComplete: cfg.autoComplete,
          ...(inputProps || {}),
          "aria-describedby": describedBy || undefined,
        }}
        {...tfProps}
      >
        {placeholder && (
          <MenuItem value="" disabled sx={{ ...OPTION_SX, ...PLACEHOLDER_STYLE }}>
            {placeholder}
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={OPTION_SX}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
