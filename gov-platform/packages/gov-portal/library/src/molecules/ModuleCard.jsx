// molecules/ModuleCard.jsx
import React from "react";
import DSCard from "../atoms/DSCard";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

export const ModuleCard = React.memo(function ModuleCard({
  module,
  onNavigate,
  cardSx,
}) {
  const theme = useTheme();
  const go = (e) => { e?.preventDefault?.(); onNavigate?.(module); };

  // default icon color similar to screenshot
  const iconColor = module?.iconColor || "#239460"; // warm orange
  const IconEl = getIcon(module?.icon || "Widgets");

  return (
    <DSCard
      // make DSCard act like a plain tile (no header/float)
      elevation={0}
      hoverRaise={false}
      radius={2}
      onClick={go}
      to={module?.path}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
        backgroundColor: "#fff",
        transition: "box-shadow 160ms ease, transform 160ms ease",
        boxShadow: "0 1px 0 rgba(40, 219, 4, 0.02)",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(20, 108, 0, 0.08)",
          transform: "translateY(-2px)",
        },
        ...cardSx,
      }}
      contentSx={{
        p: { xs: 1.5, sm: 2 },
        display: "grid",
        justifyItems: "center",
        alignContent: "center",
        gap: 1,
        minHeight: 50,
      }}
    >
      {/* icon */}
      <Box
        sx={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          // keep it flat like screenshot (no gradient/puck)
          color: iconColor,       // <-- icon color here
          opacity: 1,             // full opacity
        }}
      >
        {React.isValidElement(IconEl)
          ? React.cloneElement(IconEl, { sx: { fontSize: 32, color: iconColor, opacity: 1 } })
          : IconEl}
      </Box>

      {/* label: wrap, no ellipsis */}
      <TypographyX
        variant="body1"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          color: theme.palette.text.primary,
          lineHeight: 1.25,
          // IMPORTANT: allow full wrapping, no "..."
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          // compact font sizes that match tiles
          fontSize: { xs: ".95rem", sm: "1rem" },
          maxWidth: "100%",
        }}
      >
        {module?.title}
      </TypographyX>
    </DSCard>
  );
});

export default ModuleCard;
