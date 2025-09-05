// CardItemSkeleton.jsx
import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

export default function CardItemSkeleton() {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Box sx={{ height: 140, position: "relative" }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
      <CardContent>
        <Skeleton width="60%" />
        <Skeleton width="90%" />
        <Skeleton width="70%" />
      </CardContent>
    </Card>
  );
}
