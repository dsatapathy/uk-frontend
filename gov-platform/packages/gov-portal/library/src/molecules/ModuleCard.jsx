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

  const primaryFallback = theme.palette.primary?.main || "#1b5e20";
  const primaryToken = `var(--g-primary, ${primaryFallback})`;
  const iconColor = module?.iconColor || primaryToken;
  const IconEl = getIcon(module?.icon || "Widgets");

  return (
    <DSCard
      elevation={0}
      hoverRaise={false}
      radius={2}
      onClick={go}
      to={module?.path}
      sx={{
        '&&': {
          borderRadius: 2,
          border: 'none',
          background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
          transition:
            'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `
        0 8px 22px -16px ${alpha(theme.palette.common.black, 0.35)},
        0 0 16px -10px ${primaryToken}
      `,

          '&:hover': {
            boxShadow: `
                    0 12px 32px -14px ${alpha(theme.palette.common.black, 0.28)},
                    0 0 22px -6px ${primaryToken}`,
            transform: 'translateY(-4px) scale(1.03)',
          },          
          '&:hover .module-card-icon': {
            transform: 'rotate(25deg) scale(1.08)',
            background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
            borderRadius: '50%',
            boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.18)}`,
            filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary?.main || '#1b5e20', 0.3)})`,
          },

          '&:hover .module-card-icon svg': { color: primaryToken },
          ...cardSx,
        },
      }}
      contentSx={{
        p: { xs: 1.5, sm: 2 },
        display: 'grid',
        justifyItems: 'center',
        alignContent: 'center',
        gap: 1,
        minHeight: 50,
      }}
    >
      {/* icon */}
      <Box
        className="module-card-icon"
        sx={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          // keep it flat like screenshot (no gradient/puck)
          color: iconColor,       // <-- icon color here
          opacity: 1,             // full opacity
          transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), filter 220ms cubic-bezier(0.4, 0, 0.2, 1)",
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
          color: primaryToken,
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
