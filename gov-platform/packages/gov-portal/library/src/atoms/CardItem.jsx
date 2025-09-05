// CardItem.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function CardItem({ title, description, icon, path }) {
  return (
      <Card onClick={() => (window.location.href = path)}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </Card>
  );
}
