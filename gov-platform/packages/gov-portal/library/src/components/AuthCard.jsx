import * as React from "react";
import { Card, CardContent, Paper } from "@mui/material";

export function AuthCard({ children, variant = "card", className = "", elevation = 2 }) {
  if (variant === "paper") {
    return <Paper elevation={elevation} className={`auth-card ${className}`}><div className="auth-card-content">{children}</div></Paper>;
  }
  return (
    <Card elevation={elevation} className={`auth-card ${className}`}>
      <CardContent className="auth-card-content">{children}</CardContent>
    </Card>
  );
}
