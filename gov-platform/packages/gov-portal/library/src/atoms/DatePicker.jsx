// components/form/atoms/DatePicker.jsx
import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import s from "@gov/styles/library/form/DatePicker.module.scss";

const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",
  fullWidth: true,
  marginY: "sm",

  valueKind: "iso",          // "iso" | "date" | "dayjs"
  outputFormat: "YYYY-MM-DD",

  disablePast: false,
  disableFuture: false,
  openTo: "day",
  views: ["year", "month", "day"],
  reduceAnimations: true,

  allowClear: true,
  clearLabel: "Clear",

  useInternalProvider: true,
  adapterLocale: undefined,
};

function toDay(value) {
  if (value == null || value === "") return null;
  if (dayjs.isDayjs(value)) return value;
  if (value instanceof Date) return dayjs(value);
  return dayjs(String(value));
}

function fromDay(d, kind, outFmt) {
  if (!d || !d.isValid()) return null;
  if (kind === "dayjs") return d;
  if (kind === "date") return d.toDate();
  return d.format(outFmt || "YYYY-MM-DD"); // iso
}

export default function DatePicker({
  rhf,

  id,
  name,
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  inputRef,

  minDate,
  maxDate,
  format,                 // v6 display format; for v5 we also pass inputFormat

  error,
  disabled,
  readOnly,
  ariaDescribedBy,

  config,
  textFieldProps,
  slotProps,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  // RHF → controlled
  const controlled = rhf
    ? { name: rhf.name, value: rhf.value, onChange: rhf.onChange, onBlur: rhf.onBlur, inputRef: rhf.ref }
    : { name, value: valueProp, onChange: onChangeProp, onBlur: onBlurProp, inputRef };

  const dayValue = toDay(controlled.value);
  const dayMin   = minDate != null ? toDay(minDate) : undefined;
  const dayMax   = maxDate != null ? toDay(maxDate) : undefined;

  const rootClass = [s.root, s[`my--${cfg.marginY}`]].join(" ");
  const actionBar = cfg.allowClear ? { actions: ["clear"] } : undefined;

  // Common TextField renderer (for v5’s renderInput)
  const renderInput = (params) => (
    <TextField
      {...params}
      id={id}
      name={controlled.name}
      inputRef={controlled.inputRef}
      variant={cfg.variant}
      size={muiSize}
      error={!!error}
      fullWidth={cfg.fullWidth}
      disabled={disabled}
      InputProps={{ ...params.InputProps, readOnly }}
      inputProps={{
        ...params.inputProps,
        "aria-describedby": ariaDescribedBy,
        ...(textFieldProps?.inputProps || {}),
      }}
      {...textFieldProps}
    />
  );

  const pickerEl = (
    <MuiDatePicker
      value={dayValue}
      onChange={(newVal) => {
        const next = fromDay(newVal, cfg.valueKind, cfg.outputFormat);
        controlled.onChange?.(next);
      }}
      onAccept={(newVal) => {
        if (newVal == null) return;
        const next = fromDay(newVal, cfg.valueKind, cfg.outputFormat);
        controlled.onChange?.(next);
      }}
      onClose={controlled.onBlur}
      // v6
      format={format || "DD/MM/YYYY"}
      // v5
      inputFormat={format || "DD/MM/YYYY"}
      minDate={dayMin}
      maxDate={dayMax}
      disabled={disabled}
      readOnly={readOnly}
      disablePast={cfg.disablePast}
      disableFuture={cfg.disableFuture}
      openTo={cfg.openTo}
      views={cfg.views}
      reduceAnimations={cfg.reduceAnimations}
      // v5 expects this:
      renderInput={renderInput}
      // v6 expects this:
      slotProps={{
        ...slotProps,
        actionBar,
        textField: {
          id,
          name: controlled.name,
          inputRef: controlled.inputRef,
          variant: cfg.variant,
          size: muiSize,
          error: !!error,
          fullWidth: cfg.fullWidth,
          inputProps: {
            "aria-describedby": ariaDescribedBy,
            ...(textFieldProps?.inputProps || {}),
          },
          ...textFieldProps,
        },
      }}
    />
  );

  return (
    <div className={rootClass}>
      {cfg.useInternalProvider ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={cfg.adapterLocale}>
          {pickerEl}
        </LocalizationProvider>
      ) : (
        pickerEl
      )}
    </div>
  );
}
