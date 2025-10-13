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

  return (
    <DSCard
      intent="neutral"
      variant="elevated"
      elevation={4}
      radius={2.5}
      hoverRaise
      // headerIcon={getIcon(module?.icon || "Widgets")}
      floatingIcon={getIcon(module?.icon || "Widgets")}
      floatingSide="left"              // "left" or "right"
      floatingSize={44}
      floatingOffset={{ top: 14, side: 14 }}
      headerTitle={module?.title}
      headerAction={getIcon(navIcon)}
      to={module?.path}
      onClick={go}

      /* Put the gradient ON THE HEADER (not as an absolute overlay) */
      headerSx={{
        background: module?.gradient || "linear-gradient(90deg,#22c55e,#16a34a)",
      }}

      /* Solid white header title, responsive */
      headerTitleSx={{
        color: "#fff !important",
        opacity: 1,
        fontWeight: 700,
        lineHeight: 1.25,
        fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
      }}
      headerIconSx={{ color: "#000" }}

      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(145deg, #ffffff, #f9fafc)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,0.12)" },
        minHeight: { xs: 180, sm: 220, md: 260 },
        ...cardSx,
      }}
      contentSx={{
        display: "grid",
        p: 0,
        gridTemplateColumns: {
          xs: "1fr",
          sm: hasMedia ? "1.3fr 0.7fr" : "1fr",
          md: hasMedia ? "1.4fr 0.6fr" : "1fr",
        },
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
          gap: 1.5,
          minWidth: 0,
        }}
      >
        {/* floating circular icon */}
        {/* <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: "#000", // icon black
          }}
        >
          {getIcon(module?.icon || "Widgets")}
        </Box> */}

        {/* card title (white, inside header gradient) */}
        <TypographyX
          variant="h6"
          sx={{
            color: "#000",
            fontWeight: 700,
            lineHeight: { xs: 1.3, md: 1.4 },
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          {module?.title}
        </TypographyX>

        {/* content title (black) */}
        {module?.contentTitle && (
          <TypographyX
            variant="subtitle1"
            sx={{
              color: "#000",
              fontSize: "1rem",    // ~16px
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {module.contentTitle}
          </TypographyX>
        )}

        {/* description (black, lighter weight) */}
        {module?.description && (
          <TypographyX
            variant="body2"
            sx={{
              color: "#000",
              opacity: 0.9,
              fontWeight: 400,
              lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
              fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
            }}
          >
            <DSEllipsis lines={3}>{module.description}</DSEllipsis>
          </TypographyX>
        )}

        {/* action button */}
        {module?.primaryActionLabel && (
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
        )}
      </Stack>

      {/* RIGHT media (optional) */}
      {hasMedia && (
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 150, sm: "100%" },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${mediaSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.95) saturate(1.1)",
              transition: "transform 300ms ease",
            },
            "&:hover::after": { transform: "scale(1.05)" },
          }}
        />
      )}

      {/* whole card click */}
      {module?.path && (
        <Tooltip title="Open module">
          <Box sx={{ position: "absolute", inset: 0 }} />
        </Tooltip>
      )}
    </DSCard>
  );
});

export default ModuleCard;
