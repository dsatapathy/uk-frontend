import * as React from "react";
import { Card, CardContent, Paper } from "@mui/material";

import s from "@gov/styles/modules/auth/Auth.module.scss";
export function AuthCard({ children, variant="card", className="", elevation=2 }) {
  if (variant === "paper") {
    return (
      <Paper elevation={elevation} className={`${s.authCard} ${className}`}>
        <div className={s.authCardContent}>{children}</div>
      </Paper>
    );
  }
  return (
    <Card elevation={elevation} className={`${s.authCard} ${className}`}>
      <CardContent className={s.authCardContent}>{children}</CardContent>
    </Card>
  );
}

