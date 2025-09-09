// components/form/FieldRenderer.jsx
import * as React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputText from "../atoms/InputText";

const ICONS = {
  person: <PersonIcon fontSize="small" />,
  lock: <LockIcon fontSize="small" />,
};

/** Renders all fields by config; layout spans are applied via CSS vars only. */
export function FieldRenderer({ control, field, errors, classes, globalStyle }) {
  const s = classes || {};
  const {
    type = "text",
    name,
    label,
    placeholder,
    icon,
    required,
    selectOptions,
    grid = {},
    maxLength,
    readOnly,
    disabled,
    textFieldProps,
    ui, // optional per-field UI overrides for InputText (e.g., { showClear: true })
  } = field;

  const adornment = icon ? ICONS[icon] : null;

  const itemStyle = {
    "--span-xs": grid.span?.xs ?? 12,
    "--span-sm": grid.span?.sm ?? 12,
    "--span-md": grid.span?.md ?? 12,
  };

  const errObj = errors?.[name];
  const errMsg = errObj?.message || "";

  // ---------- Checkbox (kept as-is with inline label) ----------
  if (type === "checkbox") {
    return (
      <div className={s.gridItem} style={itemStyle}>
        <Controller
          name={name}
          control={control}
          render={({ field: rhf }) => (
            <FormControlLabel control={<Checkbox {...rhf} checked={!!rhf.value} />} label={label} />
          )}
        />
        {errMsg ? <div className="field-error">{errMsg}</div> : null}
      </div>
    );
  }

  // ---------- Select (label on top) ----------
  if (type === "select") {
    return (
      <div className={s.gridItem} style={itemStyle}>
        <Controller
          name={name}
          control={control}
          render={({ field: rhf }) => (
            <FormControl
              fullWidth
              margin="normal"
              required={!!required}
              error={!!errObj}
              disabled={!!disabled}
            >
              {label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null}

              <TextField
                id={name}
                select
                fullWidth
                margin="none"                  // avoid double vertical spacing (FormControl handles it)
                placeholder={placeholder}
                {...rhf}
                error={!!errObj}
                // helper text is rendered by FormHelperText below
                InputProps={{
                  startAdornment: adornment ? (
                    <InputAdornment position="start">{adornment}</InputAdornment>
                  ) : null,
                  readOnly: readOnly || false,
                }}
                {...(textFieldProps || {})}
                // IMPORTANT: do not pass `label` here, we show label above
                label={undefined}
                helperText={undefined}
              >
                {(selectOptions || []).map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              <FormHelperText>{errMsg || textFieldProps?.helperText}</FormHelperText>
            </FormControl>
          )}
        />
      </div>
    );
  }

  // ---------- Text / Password (InputText) with top label ----------
  return (
    <div className={s.gridItem} style={itemStyle}>
      <Controller
        name={name}
        control={control}
        render={({ field: rhf }) => {
          const [show, setShow] = React.useState(false);
          const isPwd = type === "password";

          // prefix & suffix nodes for InputText (it builds MUI adornments)
          const prefixNode = adornment || null;
          const suffixNode = isPwd ? (
            <IconButton
              onClick={() => setShow((v) => !v)}
              edge="end"
              aria-label="toggle password"
              tabIndex={0}
              size="small"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ) : null;

          // merge global style for inputs (if you pass loginConfig.style.field)
          const mergedCfg = {
            size:
              globalStyle?.field?.size === "small"
                ? "sm"
                : globalStyle?.field?.size === "medium"
                ? "md"
                : undefined, // default "md" inside InputText
            fullWidth: globalStyle?.field?.fullWidth ?? true,
            // defaults + per-field UI overrides
            showClear: ui?.showClear ?? true,
            showPrefix: ui?.showPrefix ?? true,
            showSuffix: ui?.showSuffix ?? true,
            ...ui, // allow any InputText config overrides
          };

          return (
            <FormControl
              fullWidth
              margin="normal"
              required={!!required}
              error={!!errObj}
              disabled={!!disabled}
            >
              {label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null}

              <InputText
                id={name}
                name={name}
                value={rhf.value ?? ""}
                onChange={rhf.onChange}
                onBlur={rhf.onBlur}
                placeholder={placeholder}
                maxLength={maxLength}
                prefix={prefixNode}
                suffix={suffixNode}
                disabled={disabled}
                readOnly={readOnly}
                type={isPwd ? (show ? "text" : "password") : type}
                error={!!errObj}
                inputRef={rhf.ref}
                ariaDescribedBy={undefined}
                config={mergedCfg}
                // Do NOT pass `label` here; we show label via <FormLabel> above.
                textFieldProps={{
                  margin: "none",              // FormControl handles vertical spacing
                  helperText: undefined,       // use FormHelperText below
                  ...(textFieldProps || {}),
                  label: undefined,
                }}
              />

              <FormHelperText>{errMsg || textFieldProps?.helperText}</FormHelperText>
            </FormControl>
          );
        }}
      />
    </div>
  );
}
