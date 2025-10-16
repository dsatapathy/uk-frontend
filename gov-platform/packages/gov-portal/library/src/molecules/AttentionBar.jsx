// molecules/AttentionBar.jsx (responsive, fixed gaps & radius)
import React from "react";
import { Stack, IconButton, useMediaQuery, useTheme } from "@mui/material";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import AppButton from "../atoms/AppButton";
import DSBox from "../atoms/DSBox";

/** Map legacy -> DS surface */
function mapSurface(legacyVariant) {
  switch (legacyVariant) {
    case "outlined": return { dsVariant: "outline", elevation: 0, intent: "neutral" };
    case "flat":     return { dsVariant: "soft",    elevation: 0, intent: "neutral" };
    case "elevated": return { dsVariant: "ghost",   elevation: 2, intent: "neutral" };
    default:         return { dsVariant: "ghost",   elevation: 0, intent: "neutral" };
  }
}

export const AttentionBar = React.memo(function AttentionBar({
  config,
  onOpenNotifications,
  isAdmin,
  onOpenEditor,
}) {
  const { left, right, variant } = config || {};
  const { dsVariant, elevation, intent } = mapSurface(variant);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  return (
    <DSBox
      intent={intent}
      variant={dsVariant}
      elevation={{ xs: elevation, md: elevation }}              
      radius={{ xs: 2, md: 2 }}                         
      p={{ xs: 3, sm: 2, md: 3 }}                     
      grid
      gridCols={{ xs: "1fr", md: "1fr max-content" }}
      gridGap={{ xs: 1, md: 16 }}                        
      align="center"
      sx={{ 
        position: "relative", 
        overflow: "hidden", 
        minWidth: 0, 
        background: "var(--attention-gradient, linear-gradient(to right, #239460 0%, #6fc926 100%))",
        color: "#fff"
       }}
    >
      {/* Left: Icon + title/subtitle */}
      <Stack
        spacing={0.75}
        direction="row"
        alignItems="flex-start"
        sx={{ minWidth: 0 }}
      >
        {getIcon("campaign", { fontSize: "medium", color: "#fff" })}
        <div style={{ minWidth: 0 }}>
          <TypographyX
            variant="h6"
            weight={700}
            sx={{
              color: "#fff",
              lineHeight: 1.2,
              wordBreak: "break-word",
              fontSize: { xs: 15, sm: 17, md: 20 },
              mb: 0.25,
            }}
          >
            {left?.title}
          </TypographyX>
          {left?.subtitle && (
            <TypographyX
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: "break-word",color: "#fff", }}
            >
              {left.subtitle}
            </TypographyX>
          )}
        </div>
      </Stack>

      {/* Right: admin edit + CTA */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 0.75, md: 1 }}
        justifyContent={{ xs: "flex-start", md: "flex-end" }}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ width: "100%", minWidth: 0 }}
      >
        {isAdmin && config?.right?.showEditForAdmin && (
          <IconButton
            aria-label="Edit notifications"
            onClick={onOpenEditor}
            size="small"
            sx={{
              position: { xs: "absolute", md: "static" }, // no layout gap on phones
              top: { xs: 6, md: "auto" },
              right: { xs: 6, md: "auto" },
              alignSelf: { md: "auto" },
            }}
          >
            {getIcon("edit")}
          </IconButton>
        )}
        <AppButton
          intent="primary"
          variant="solid"
          endIcon={getIcon("notifications")}
          onClick={onOpenNotifications}
          fullWidth={isXs}                               // button spans width on phones
          size={isXs ? "small" : "medium"}
        >
          {right?.ctaLabel || "Notifications"}
        </AppButton>
      </Stack>
    </DSBox>
  );
});
