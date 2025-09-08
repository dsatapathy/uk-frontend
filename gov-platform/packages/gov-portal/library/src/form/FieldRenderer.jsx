// components/form/FieldRenderer.jsx
import * as React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  MenuItem,
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

  const errMsg = errors?.[name]?.message || "";

  // ---------- Checkbox ----------
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

  // ---------- Select ----------
  if (type === "select") {
    return (
      <div className={s.gridItem} style={itemStyle}>
        <Controller
          name={name}
          control={control}
          render={({ field: rhf }) => (
            <TextField
              select
              fullWidth
              margin="normal"
              required={!!required}
              label={label}
              placeholder={placeholder}
              {...rhf}
              error={!!errors?.[name]}
              helperText={errMsg}
              InputProps={{
                startAdornment: adornment ? (
                  <InputAdornment position="start">{adornment}</InputAdornment>
                ) : null,
              }}
              {...(textFieldProps || {})}
            >
              {(selectOptions || []).map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </div>
    );
  }

  // ---------- Text / Password (InputText) ----------
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
            // global size from loginConfig.style.field.size -> "small" | "medium"
            size:
              globalStyle?.field?.size === "small"
                ? "sm"
                : globalStyle?.field?.size === "medium"
                ? "md"
                : undefined, // default "md" inside InputText
            fullWidth: globalStyle?.field?.fullWidth ?? true,
            // sensible defaults + per-field UI overrides
            showClear: ui?.showClear ?? true,
            showPrefix: ui?.showPrefix ?? true,
            showSuffix: ui?.showSuffix ?? true,
            ...ui, // allow any InputText config overrides
          };

          return (
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
              error={!!errors?.[name]}
              inputRef={rhf.ref}
              ariaDescribedBy={undefined}
              config={mergedCfg}
              // Pass label/helper to the internal TextField
              textFieldProps={{
                label,
                required: !!required,
                margin: "normal",
                helperText: errMsg,
                // spread any extra field-level textFieldProps
                ...(textFieldProps || {}),
              }}
            />
          );
        }}
      />
    </div>
  );
}
