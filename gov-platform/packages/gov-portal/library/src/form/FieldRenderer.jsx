import * as React from "react";
import {
  TextField, InputAdornment, IconButton, Checkbox, FormControlLabel, MenuItem
} from "@mui/material";
import { Controller } from "react-hook-form";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ICONS = { person: <PersonIcon fontSize="small" />, lock: <LockIcon fontSize="small" /> };

/** Renders all fields by config; layout spans are applied via CSS vars only. */
export function FieldRenderer({ control, field, errors }) {
  const { type = "text", name, label, placeholder, icon, required, selectOptions, grid = {}, textFieldProps } = field;
  const adornment = icon ? ICONS[icon] : null;

  const itemStyle = {
    "--span-xs": (grid.span?.xs ?? 12),
    "--span-sm": (grid.span?.sm ?? 12),
    "--span-md": (grid.span?.md ?? 12),
  };

  if (type === "checkbox") {
    return (
      <div className="grid-item" style={itemStyle}>
        <Controller
          name={name}
          control={control}
          render={({ field: rhf }) => (
            <FormControlLabel control={<Checkbox {...rhf} checked={!!rhf.value} />} label={label} />
          )}
        />
        {errors?.[name]?.message ? <div className="field-error">{errors[name].message}</div> : null}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="grid-item" style={itemStyle}>
        <Controller
          name={name}
          control={control}
          render={({ field: rhf }) => (
            <TextField
              select fullWidth margin="normal" required={!!required}
              label={label} placeholder={placeholder} {...rhf}
              error={!!errors?.[name]} helperText={errors?.[name]?.message || ""}
              InputProps={{
                startAdornment: adornment ? <InputAdornment position="start">{adornment}</InputAdornment> : null,
              }}
              {...(textFieldProps || {})}
            >
              {(selectOptions || []).map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          )}
        />
      </div>
    );
  }

  return (
    <div className="grid-item" style={itemStyle}>
      <Controller
        name={name}
        control={control}
        render={({ field: rhf }) => {
          const [show, setShow] = React.useState(false);
          const isPwd = type === "password";
          return (
            <TextField
              fullWidth margin="normal" required={!!required}
              type={isPwd ? (show ? "text" : "password") : type}
              label={label} placeholder={placeholder} {...rhf}
              error={!!errors?.[name]} helperText={errors?.[name]?.message || ""}
              InputProps={{
                startAdornment: adornment ? <InputAdornment position="start">{adornment}</InputAdornment> : null,
                endAdornment: isPwd ? (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label="toggle password">
                      {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              {...(textFieldProps || {})}
            />
          );
        }}
      />
    </div>
  );
}
