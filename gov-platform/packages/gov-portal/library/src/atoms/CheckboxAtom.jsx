import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function CheckboxAtom({ rhf, label, error, disabled, hidden }) {
  if (hidden) return null;
  return (
    <FormControlLabel
      control={<Checkbox checked={!!rhf.value} onChange={(e) => rhf.onChange(e.target.checked)} disabled={disabled} />}
      label={label}
    />
  );
}