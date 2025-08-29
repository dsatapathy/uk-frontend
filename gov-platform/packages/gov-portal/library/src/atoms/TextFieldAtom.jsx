import React from 'react';
import { TextField } from '@mui/material';

export default function TextFieldAtom({ rhf, label, error, disabled, hidden, props }) {
  if (hidden) return null;
  return (
    <TextField
      {...rhf}
      label={label}
      error={!!error}
      helperText={error?.message}
      disabled={disabled}
      fullWidth
      margin="normal"
      {...(props || {})}
    />
  );
}