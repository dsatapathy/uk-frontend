// components/form/atoms/Radio.jsx
import * as React from "react";
import MuiRadio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import s from "@gov/styles/library/form/Radio.module.scss";

/**
 * Radio — Single choice item (usually used inside RadioGroup).
 *
 * Props:
 * - rhf?                    : { name, value (selected), onChange, onBlur, ref }
 * - id, name                : group name
 * - value                   : this radio's option value
 * - label                   : string | node
 * - selected, onSelect      : controlled (if not using rhf)
 * - onBlur, inputRef
 * - disabled, readOnly, error
 * - ariaDescribedBy
 * - config: {
 *     size: "sm"|"md",
 *     color: "primary"|"secondary"|"default"|"success"|"error"|"warning"|"info",
 *     marginY: "none"|"xs"|"sm"|"md",
 *     labelPlacement: "end"|"start"|"top"|"bottom",
 *   }
 */
const DEFAULT_CFG = {
  size: "md",
  color: "primary",
  marginY: "sm",
  labelPlacement: "end",
};

export default function Radio({
  rhf,
  id,
  name,
  value,
  label,
  selected,
  onSelect,
  onBlur,
  inputRef,
  disabled,
  readOnly,
  error,
  ariaDescribedBy,
  config,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  // Determine current selection + change handler
  const isChecked = rhf ? rhf.value === value : selected === value;
  const handleChange = (nextVal) => {
    if (readOnly) return;
    if (rhf) rhf.onChange(nextVal);
    else onSelect?.(nextVal);
  };

  const resolvedName = rhf ? rhf.name : name;
  const resolvedBlur  = rhf ? rhf.onBlur : onBlur;
  const resolvedRef   = rhf ? rhf.ref : inputRef;

  const rootClass = [s.root, s[`my--${cfg.marginY}`]].join(" ");

  return (
    <div className={rootClass} aria-invalid={error ? "true" : undefined}>
      <FormControlLabel
        label={label}
        labelPlacement={cfg.labelPlacement}
        control={
          <MuiRadio
            id={id}
            name={resolvedName}
            checked={!!isChecked}
            onChange={() => handleChange(value)}
            onBlur={resolvedBlur}
            inputRef={resolvedRef}
            value={value}
            size={muiSize}
            color={cfg.color}
            disabled={disabled || readOnly}
            inputProps={{ "aria-describedby": ariaDescribedBy }}
          />
        }
      />
    </div>
  );
}
