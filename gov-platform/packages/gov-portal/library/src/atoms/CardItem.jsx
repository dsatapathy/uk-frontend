// CardItem.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function CardItem({ title, description, icon, path }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card onClick={() => (window.location.href = path)}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
