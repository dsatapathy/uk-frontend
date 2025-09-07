// molecules/ModuleCard.jsx (DS version)
import React from "react";
import DSCard from "../atoms/DSCard";
import DSEllipsis from "../atoms/DSEllipsis";
import { getIcon } from "../utils/icons";
import TypographyX from "../atoms/TypographyX";

export const ModuleCard = React.memo(function ModuleCard({
  module,
  onNavigate,
  navIcon = "Launch",
  cardSx,               // ← new: allow external style overrides (height:100%)
}) {
  const go = (evt) => {
    evt?.preventDefault?.();
    onNavigate?.(module);
  };

  return (
    <DSCard
      intent="neutral"
      variant="ghost"
      elevation={2}
      radius={1}            // ← fixed px radius to avoid soft “pill” look
      hoverRaise
      headerIcon={getIcon(module.icon || "Widgets")}
      headerTitle={module.title}
      headerAction={getIcon(navIcon)}
      imageUrl={module.imageUrl}
      aspect="16/9"
      to={module.path}
      onClick={go}
      sx={{
        height: "100%",      // ← fill grid cell
        borderRadius: 1,    // ← ensure not too round even if theme radius is big
        ...cardSx,
      }}
      // inside DSCard, CardActionArea should be display:flex + column so content stretches
      contentSx={{ flexGrow: 1 }} // if your DSCard supports forwarding to CardContent
    >
      <TypographyX variant="body2" color="text.secondary">
        <DSEllipsis lines={3}>{module.description}</DSEllipsis>
      </TypographyX>
    </DSCard>
  );
});

export default ModuleCard;
