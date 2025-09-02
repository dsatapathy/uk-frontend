// components/form/InputText.jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import s from "@gov/styles/library/form/InputText.module.scss";

/**
 * InputText — Basic text input (controlled), config-driven, responsive.
 *
 * Parent is responsible for merging config (e.g., from FormConfigContext).
 *
 * Props:
 * - id, name
 * - value, onChange(next: string), onBlur
 * - placeholder, maxLength
 * - prefix, suffix                : string | node (optional)
 * - disabled, readOnly
 * - type                          : "text" | "email" | "tel" | "password"...
 * - error                         : boolean (for red border)
 * - ariaDescribedBy               : string (ids to append; wrapper can pass error/help ids)
 * - inputRef                      : React ref forwarded to the native input
 * - config                        : FINAL merged config just for this component
 * - inputProps                    : extra native inputProps
 * - textFieldProps                : extra MUI TextField props
 */
const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",            // "sm" | "md" (maps to MUI small/medium)
  fullWidth: true,
  marginY: "sm",         // "none" | "xs" | "sm" | "md"
  autoComplete: "off",
  type: "text",
  showCharCount: true,
  charCountAlign: "end", // "start" | "end"
  showClear: true,
  clearAriaLabel: "Clear input",
  adornmentGap: "sm",    // "xs" | "sm" | "md" | "lg"
  // conditional adornments (booleans | "whenValue" | (ctx)=>boolean)
  showPrefix: true,
  showSuffix: true,
};

export default function InputText({
  id,
  name,
  value = "",
  onChange,
  onBlur,
  placeholder,
  maxLength,
  prefix,
  suffix,
  disabled,
  readOnly,
  type,
  error,
  ariaDescribedBy,
  inputRef,
  config,
  inputProps,
  textFieldProps,
}) {
  const cfg = React.useMemo(
    () => ({ ...DEFAULT_CFG, ...(config || {}) }),
    [config]
  );

  const muiSize = cfg.size === "sm" ? "small" : "medium";

  const rootClass = [
    s.root,
    s[`my--${cfg.marginY}`],
    s[`gap--${cfg.adornmentGap}`],
  ].join(" ");

  // adornment gating
  const ctx = { value, invalid: !!error, disabled: !!disabled };
  const shouldShow = (which) => {
    const flag = cfg[which];
    if (typeof flag === "function") return !!flag(ctx);
    if (flag === "whenValue") return !!value;
    return !!flag;
  };

  const showPrefix = !!prefix && shouldShow("showPrefix");
  const showSuffix = !!suffix && shouldShow("showSuffix");
  const showClear = cfg.showClear && !!value && !disabled && !readOnly;

  const startAdornment = showPrefix ? (
    <InputAdornment position="start">{prefix}</InputAdornment>
  ) : null;

  const endAdornment = showSuffix || showClear ? (
    <InputAdornment position="end">
      {showSuffix ? <span>{suffix}</span> : null}
      {showClear ? (
        <IconButton
          aria-label={cfg.clearAriaLabel}
          className={s.clearBtn}
          onClick={() => {
            onChange?.("");
            if (inputRef && "current" in inputRef && inputRef.current) {
              inputRef.current.focus();
            }
          }}
          edge="end"
          tabIndex={0}
        >
          <ClearIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    </InputAdornment>
  ) : null;

  // counter id (added to aria-describedby when visible)
  const counterId = id ? `${id}-counter` : undefined;
  const describedBy = [ariaDescribedBy, cfg.showCharCount && maxLength ? counterId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className={s.inline}>
        <TextField
          id={id}
          name={name}
          inputRef={inputRef}
          value={value}
          onChange={(e) => {
            const next = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
            onChange?.(next);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          variant={cfg.variant}
          size={muiSize}
          type={type || cfg.type}
          disabled={disabled}
          InputProps={{ readOnly, startAdornment, endAdornment }}
          inputProps={{
            maxLength,
            autoComplete: cfg.autoComplete,
            ...(inputProps || {}),
            "aria-describedby": describedBy || undefined,
          }}
          fullWidth={cfg.fullWidth}
          error={!!error}
          {...(textFieldProps || {})}
        />

        {/* character counter (config-driven) */}
        {cfg.showCharCount && maxLength ? (
          <div className={s.footer}>
            <span
              id={counterId}
              className={`${s.counter} ${s[`align--${cfg.charCountAlign}`]}`}
            >
              {String(value || "").length} / {maxLength}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
