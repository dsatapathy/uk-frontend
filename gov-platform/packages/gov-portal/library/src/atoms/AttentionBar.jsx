import React, { useState } from "react";
import { Box, Button, Dialog } from "@mui/material";
import TypographyX from "./TypographyX";
export default function AttentionBar({ isAdmin }) {
  const [open, setOpen] = useState(false);
  const notifications = [
    "System maintenance on Friday",
    "New Trade License module launched",
  ];

  return (
    <Box
      sx={{
        bgcolor: "warning.main",
        p: 1,
        mb: 2,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ticker text */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          cursor: "pointer",
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "scroll-left 12s linear infinite",
          "@keyframes scroll-left": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        <TypographyX variant="body2" sx={{ fontWeight: 500 }}>
          {notifications.join(" | ")}
        </TypographyX>
      </Box>

      {isAdmin && (
        <Button size="small" sx={{ ml: 1, flexShrink: 0 }}>
          Edit
        </Button>
      )}

      {/* Popup dialog for full list */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2 }}>
          {notifications.map((n, i) => (
            <TypographyX key={i} sx={{ mb: 1 }}>
              {n}
            </TypographyX>
          ))}
        </Box>
      </Dialog>
    </Box>
  );
}
