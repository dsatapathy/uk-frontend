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
      elevation={{ xs: elevation, md: elevation }}              // no shadow on phones
      radius={{ xs: 8, md: 16 }}                         // ← smaller radius on phones
      p={{ xs: 3, sm: 2, md: 3 }}                      // tighter padding on phones
      grid
      gridCols={{ xs: "1fr", md: "1fr max-content" }}    // stack on phones
      gridGap={{ xs: 1, md: 16 }}                        // ← smaller gap on phones
      align="center"
      sx={{ position: "relative", overflow: "hidden", minWidth: 0 }}
    >
      {/* Left: Icon + title/subtitle */}
      <Stack
        spacing={0.75}
        direction="row"
        alignItems="flex-start"
        sx={{ minWidth: 0 }}
      >
        {getIcon("campaign", { fontSize: "medium", color: "primary" })}
        <div style={{ minWidth: 0 }}>
          <TypographyX
            variant="h6"
            weight={700}
            sx={{
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
              sx={{ wordBreak: "break-word" }}
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
