// CardItem.jsx
import React from "react";
import { Card, CardContent } from "@mui/material";
import { TypographyX } from "../registry/atoms";

export default function CardItem({ title, description, icon, path }) {
  return (
      <Card onClick={() => (window.location.href = path)}>
        <CardContent>
          <TypographyX variant="h6">{title}</TypographyX>
          <TypographyX variant="body2">{description}</TypographyX>
        </CardContent>
      </Card>
  );
}
