import React from 'react';
import { Alert, List, ListItem, Typography } from '@mui/material';
import TypographyX from "../atoms/TypographyX";
export default function ErrorSummary({ errors }) {
  const keys = Object.keys(errors || {});
  if (!keys.length) return null;
  return (
    <Alert severity="error" variant="outlined" sx={{ my: 2 }}>
      <TypographyX variant="subtitle2" gutterBottom>Fix the following:</TypographyX>
      <List dense>
        {keys.map((k) => (
          <ListItem key={k} sx={{ py: 0 }}>{errors[k]?.message || String(errors[k])}</ListItem>
        ))}
      </List>
    </Alert>
  );
}