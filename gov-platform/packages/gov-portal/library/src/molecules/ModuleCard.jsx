// molecules/ModuleCard.jsx
import React from "react";
import DSCard from "../atoms/DSCard";
import DSEllipsis from "../atoms/DSEllipsis";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import { Box, Stack, Button, Tooltip } from "@mui/material";
import { textAlign } from "@mui/system";

const HEADER_H = 64;

export const ModuleCard = React.memo(function ModuleCard({
  module,
  onNavigate,
  navIcon = "Launch",
  cardSx,
}) {
  const go = (evt) => { evt?.preventDefault?.(); onNavigate?.(module); };

  const hasMedia = Boolean(module?.imageUrl || module?.illustration);
  const mediaSrc = module?.imageUrl || module?.illustration;
  // Only reserve a second column if we will actually render media
  const showMedia = Boolean(mediaSrc);
  return (
    <DSCard
      intent="neutral"
      variant="elevated"
      elevation={4}
      radius={2.5}
      hoverRaise
      floatingIcon={getIcon(module?.icon || "Widgets")}
      floatingSide="left"
      floatingSize={44}
      floatingOffset={{ top: 14, side: 14 }}
      headerTitle={module?.title}
      headerAction={getIcon(navIcon)}
      to={module?.path}
      onClick={go}
      headerSx={{
        background: module?.gradient || "linear-gradient(90deg,#22c55e,#16a34a)",
      }}
      headerTitleSx={{
        color: "#fff !important",
        opacity: 1,
        fontWeight: 700,
        lineHeight: 1.25,
        fontSize: { xs: "0.95rem", sm: "1rem", md: "1rem" },
      }}
      headerIconSx={{ color: "#000" }}

      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(145deg, #ffffff, #f9fafc)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,0.12)" },
        // ↙︎ allow grid to control height responsively
        ...cardSx,
      }}

      contentSx={{
        display: "grid",
        p: 0,
        // gridTemplateColumns: {
        //   xs: "1fr",
        //   sm: showMedia ? "1.2fr 0.8fr" : "1fr",
        //   md: showMedia ? "1.5fr 0.7fr" : "1fr",
        //   lg: showMedia ? "1.6fr 0.8fr" : "1fr",
        // },
        gap: { xs: 2, sm: 2.5, md: 3 },
        alignItems: "stretch",
      }}
    >
      {/* gradient strip aligned to header */}
      {module?.gradient && (
        <Box
          sx={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: HEADER_H,
            background: module.gradient,
            opacity: 0.95,
          }}
        />
      )}
      {/* LEFT content */}
      <Stack
        sx={{
          zIndex: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          gap: 1.25,
          minWidth: 0,
        }}
      >
        <TypographyX
          variant="h6"
          sx={{
            color: "#000",
            fontWeight: 700,
            lineHeight: { xs: 1.25, sm: 1.3, md: 1.35 },
            fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.2rem" },
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {module?.title}
        </TypographyX>

        {module?.contentTitle && (
          <TypographyX
            variant="subtitle1"
            sx={{
              color: "#000",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              fontWeight: 600,
              lineHeight: 1.35,
              overflowWrap: "anywhere",
            }}
          >
            {module.contentTitle}
          </TypographyX>
        )}

        {module?.description && (
          <TypographyX
            component="div"
            variant="body2"
            sx={{
              color: "#000",
              opacity: 0.9,
              fontWeight: 400,
              lineHeight: { xs: 1.45, sm: 1.55, md: 1.6 },
              fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
              overflow: "hidden",
              // display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 2, sm: 3, md: 4 }, // responsive clamp
            }}
          >
            {module.description}
          </TypographyX>
        )}

        {/* {module?.primaryActionLabel && (
          <Button
            size="small"
            variant="contained"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onNavigate?.(module); }}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 999,
              px: 2.2,
              py: 0.6,
              textTransform: "none",
              fontWeight: 600,
              mt: 1,
            }}
            startIcon={getIcon(navIcon)}
          >
            {module.primaryActionLabel}
          </Button>
        )} */}
      </Stack>
    </DSCard>
  );
});

export default ModuleCard;
