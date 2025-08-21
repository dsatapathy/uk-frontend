import * as React from "react";
import { Card, CardContent, Paper } from "@mui/material";

export function AuthCard({ children, variant="card", className="", elevation=2, classes }) {
  const s = classes || {};
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
