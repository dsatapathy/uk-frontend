// components/form/InputNumber.jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import s from "@gov/styles/library/form/InputNumber.module.scss";

/**
 * InputNumber — Controlled numeric input with min/max/step + formatting.
 *
 * Parent owns value/onChange (RHF Controller lives outside).
 *
 * Props:
 * - id, name
 * - value: number | null | undefined
 * - onChange(nextNumberOrNull)
 * - onBlur
 * - min, max, step
 * - format:  function(n:number|null) => string
 *            | { locale?: string, options?: Intl.NumberFormatOptions }
 *            | "integer" | "decimal" (convenience presets)
 * - error: boolean
 * - disabled, readOnly
 * - ariaDescribedBy: string (ids appended)
 * - inputRef: React ref to native input
 * - config: (final merged) {
 *      variant: "outlined"|"filled"|"standard",
 *      size: "sm"|"md",
 *      fullWidth: boolean,
 *      marginY: "none"|"xs"|"sm"|"md",
 *      autoComplete: string,
 *      inputMode: "decimal"|"numeric",
 *      preventWheel: boolean,
 *      clampOnBlur: boolean,
 *      roundToStepOnBlur: boolean,
 *      showSteppers: boolean,
 *      steppersPlacement: "end"|"none",
 *      adornmentGap: "xs"|"sm"|"md"|"lg",
 *      unitPrefix?: ReactNode,
 *      unitSuffix?: ReactNode
 *   }
 * - inputProps, textFieldProps
 */
const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",
  fullWidth: true,
  marginY: "sm",
  autoComplete: "off",
  inputMode: "decimal",          // mobile keyboard
  preventWheel: true,            // stop scroll from changing value
  clampOnBlur: true,
  roundToStepOnBlur: true,
  showSteppers: true,
  steppersPlacement: "end",
  adornmentGap: "sm",
  unitPrefix: null,
  unitSuffix: null,
};

function clamp(n, min, max) {
  if (n == null || Number.isNaN(n)) return n;
  if (typeof min === "number" && n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
}
function roundToStep(n, step = 1, anchor = 0) {
  if (n == null || Number.isNaN(n) || !step) return n;
  return Math.round((n - anchor) / step) * step + anchor;
}
function coerceNumberFromInput(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === "" || s === "-" || s === "+" || s === "." || s === ",") return null; // partials allowed while typing
  // common sanitization: allow one decimal separator; treat comma as decimal if present
  const normalized = s
    .replace(/[^0-9,.\-+]/g, "")  // strip grouping chars/spaces
    .replace(",", ".");           // prefer dot
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
function makeFormatter(format) {
  if (typeof format === "function") return format;
  if (format === "integer") {
    const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
    return (n) => (n == null ? "" : nf.format(n));
  }
  if (format === "decimal") {
    const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 });
    return (n) => (n == null ? "" : nf.format(n));
  }
  if (format && typeof format === "object") {
    const { locale, options } = format;
    const nf = new Intl.NumberFormat(locale, options || {});
    return (n) => (n == null ? "" : nf.format(n));
  }
  // default: raw toString without grouping
  return (n) => (n == null ? "" : String(n));
}

export default function InputNumber({
  id,
  name,
  value,
  onChange,
  onBlur,
  min,
  max,
  step = 1,
  format = "decimal",
  error,
  disabled,
  readOnly,
  ariaDescribedBy,
  inputRef,
  config,
  inputProps,
  textFieldProps,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";
  const rootClass = [s.root, s[`my--${cfg.marginY}`], s[`gap--${cfg.adornmentGap}`]].join(" ");
  const fmt = React.useMemo(() => makeFormatter(format), [format]);

  // Manage a display buffer so we can show partial user input during edit
  const [display, setDisplay] = React.useState(() => fmt(value ?? null));
  const [focused, setFocused] = React.useState(false);

  // keep display in sync if value changes externally and input not focused
  React.useEffect(() => {
    if (!focused) setDisplay(fmt(value ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fmt, focused]);

  // event handlers
  const handleChange = (e) => {
    const raw = e.target.value;
    setDisplay(raw);
    const parsed = coerceNumberFromInput(raw);
    // propagate parsed (or null if partial/empty)
    onChange?.(parsed);
  };

  const commitFormat = (currentValue) => {
    let n = currentValue;
    if (cfg.clampOnBlur) n = clamp(n, min, max);
    if (cfg.roundToStepOnBlur && typeof step === "number") n = roundToStep(n, step, typeof min === "number" ? min : 0);
    setDisplay(fmt(n ?? null));
    // also push back any clamped/rounded change
    if (n !== currentValue) onChange?.(n ?? null);
  };

  const handleBlur = (e) => {
    setFocused(false);
    commitFormat(value ?? coerceNumberFromInput(display));
    onBlur?.(e);
  };

  const handleFocus = () => setFocused(true);

  const bump = (dir = 1) => {
    if (disabled || readOnly) return;
    const current = (value ?? coerceNumberFromInput(display) ?? 0);
    const nextRaw = current + dir * (step || 1);
    const next = clamp(nextRaw, min, max);
    onChange?.(next);
    setDisplay(fmt(next));
  };

  // prevent mouse wheel from altering value (common annoyance)
  const onWheel = (e) => {
    if (!cfg.preventWheel) return;
    e.currentTarget.blur();
  };

  const startAdornment = cfg.unitPrefix ? (
    <InputAdornment position="start">{cfg.unitPrefix}</InputAdornment>
  ) : null;

  const endAdornment =
    cfg.steppersPlacement === "end" && cfg.showSteppers && !readOnly ? (
      <InputAdornment position="end">
        <IconButton
          aria-label="Increase value"
          className={s.stepBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => bump(+1)}
          edge="end"
          size="small"
          disabled={disabled || (typeof max === "number" && value != null && value >= max)}
        >
          <KeyboardArrowUpIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          aria-label="Decrease value"
          className={s.stepBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => bump(-1)}
          edge="end"
          size="small"
          disabled={disabled || (typeof min === "number" && value != null && value <= min)}
        >
          <KeyboardArrowDownIcon fontSize="inherit" />
        </IconButton>
        {cfg.unitSuffix ? <span className={s.unitSuffix}>{cfg.unitSuffix}</span> : null}
      </InputAdornment>
    ) : cfg.unitSuffix ? (
      <InputAdornment position="end">
        <span className={s.unitSuffix}>{cfg.unitSuffix}</span>
      </InputAdornment>
    ) : null;

  // accessibility: expose spinbutton semantics even if type="text"
  const ariaValueNow = value ?? coerceNumberFromInput(display);
  return (
    <div className={rootClass} onWheel={onWheel}>
      <div className={s.inline}>
        <TextField
          id={id}
          name={name}
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          variant={cfg.variant}
          size={muiSize}
          type="text" // keep text to allow formatted strings & partials
          placeholder={textFieldProps?.placeholder}
          disabled={disabled}
          InputProps={{
            readOnly,
            startAdornment,
            endAdornment,
            inputProps: {
              inputMode: cfg.inputMode, // "decimal"| "numeric"
              min,
              max,
              step,
              role: "spinbutton",
              "aria-valuemin": typeof min === "number" ? min : undefined,
              "aria-valuemax": typeof max === "number" ? max : undefined,
              "aria-valuenow": typeof ariaValueNow === "number" ? ariaValueNow : undefined,
            },
          }}
          inputRef={inputRef}
          inputProps={{
            autoComplete: cfg.autoComplete,
            ...(inputProps || {}),
            "aria-describedby": [ariaDescribedBy].filter(Boolean).join(" ") || undefined,
          }}
          fullWidth={cfg.fullWidth}
          error={!!error}
          {...(textFieldProps || {})}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              bump(+1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              bump(-1);
            }
          }}
        />
      </div>
    </div>
  );
}
