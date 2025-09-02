import * as React from "react";
import TextField from "@mui/material/TextField";
import s from "@gov/styles/library/form/TextArea.module.scss";

/**
 * TextArea — Multiline input (controlled). RHF lives in parent (pass `rhf`).
 *
 * Props:
 * - rhf?                 : RHF field: { name, value, onChange, onBlur, ref }
 * - id, name
 * - value, onChange(next: string), onBlur
 * - placeholder
 * - rows                 : number (used when autoResize=false)
 * - maxLength            : number
 * - autoResize           : boolean (if true uses minRows/maxRows)
 * - error                : boolean
 * - disabled, readOnly
 * - ariaDescribedBy      : string (ids to append; wrapper can pass helper/error)
 * - inputRef             : React ref to native textarea
 * - config               : {
 *      variant: "outlined"|"filled"|"standard",
 *      size: "sm"|"md",
 *      fullWidth: boolean,
 *      marginY: "none"|"xs"|"sm"|"md",
 *      autoComplete: string,
 *      showCharCount: boolean,
 *      charCountAlign: "start"|"end",
 *      allowResize: "none"|"vertical"|"horizontal"|"both",
 *      minRows: number,        // used when autoResize=true
 *      maxRows: number|null,   // used when autoResize=true
 *    }
 * - textFieldProps, inputProps
 */
const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",
  fullWidth: true,
  marginY: "sm",
  autoComplete: "off",
  showCharCount: true,
  charCountAlign: "end",
  allowResize: "vertical", // CSS resize
  minRows: 3,
  maxRows: 10,
};

export default function TextArea({
  rhf,

  id,
  name,
  value: valueProp = "",
  onChange: onChangeProp,
  onBlur: onBlurProp,
  inputRef,

  placeholder,
  rows,            // only when autoResize = false
  maxLength,
  autoResize,

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
  const counterId = id ? `${id}-counter` : undefined;
  const describedBy = [ariaDescribedBy, cfg.showCharCount && maxLength ? counterId : null].filter(Boolean).join(" ");

  // textarea resize style class
  const resizeClass =
    cfg.allowResize === "none" ? s.resizeNone :
    cfg.allowResize === "horizontal" ? s.resizeX :
    cfg.allowResize === "both" ? s.resizeBoth :
    s.resizeY; // "vertical" default

  // build multiline props based on autoResize
  const multilineProps = autoResize
    ? { multiline: true, minRows: cfg.minRows, maxRows: cfg.maxRows ?? undefined }
    : { multiline: true, rows: rows || cfg.minRows };

  return (
    <div className={rootClass}>
      <div className={`${s.inline} ${resizeClass}`}>
        <TextField
          id={id}
          name={controlled.name}
          value={controlled.value}
          onChange={(e) => {
            const raw = e.target.value;
            const next = maxLength ? raw.slice(0, maxLength) : raw;
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
          inputProps={{
            autoComplete: cfg.autoComplete,
            maxLength,
            ...(inputProps || {}),
            "aria-describedby": describedBy || undefined,
          }}
          {...multilineProps}
          {...(textFieldProps || {})}
        />

        {cfg.showCharCount && maxLength ? (
          <div className={s.footer}>
            <span id={counterId} className={`${s.counter} ${s[`align--${cfg.charCountAlign}`]}`}>
              {String(controlled.value || "").length} / {maxLength}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
