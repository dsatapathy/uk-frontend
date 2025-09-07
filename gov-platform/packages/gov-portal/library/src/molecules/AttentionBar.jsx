// molecules/AttentionBar.jsx (DS version)
import React from "react";
import { Stack, IconButton } from "@mui/material";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import AppButton from "../atoms/AppButton";
import DSBox from "../atoms/DSBox";

/**
 * Maps legacy config.variant -> DS surface props
 * legacy: "elevated" | "outlined" | "flat"
 * DS:     variant="solid|soft|outline|ghost", elevation=0..6
 */
function mapSurface(legacyVariant) {
  switch (legacyVariant) {
    case "outlined":
      return { dsVariant: "outline", elevation: 0, intent: "neutral" };
    case "flat":
      return { dsVariant: "soft", elevation: 0, intent: "neutral" };
    case "elevated":
      return { dsVariant: "ghost", elevation: 2, intent: "neutral" };
    default:
      return { dsVariant: "ghost", elevation: 0, intent: "neutral" };
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

  return (
    <DSBox
      intent={intent}
      variant={dsVariant}
      elevation={elevation}
      radius="lg"
      p={{ xs: 2, sm: 3 }}
      grid
      gridCols={{ xs: "1fr", md: "1fr auto" }}
      gridGap={16}
      align="center"
    >
      {/* Left: Title + subtitle */}
      <Stack spacing={0.5} direction="row" alignItems="center">
        {getIcon("campaign", { fontSize: "large", color: "primary" })}
        <div>
          <TypographyX variant="h6" weight={700} sx={{ lineHeight: 1.2 }}>
            {left?.title}
          </TypographyX>
          {left?.subtitle && (
            <TypographyX variant="body2" color="text.secondary">
              {left.subtitle}
            </TypographyX>
          )}
        </div>
      </Stack>

      {/* Right: Edit (admin) + CTA */}
      <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
        {isAdmin && config?.right?.showEditForAdmin && (
          <IconButton aria-label="Edit notifications" onClick={onOpenEditor} size="small">
          </IconButton>
        )}
        <AppButton
          intent="primary"
          variant="solid"
          endIcon={getIcon("notifications")}
          onClick={onOpenNotifications}
        >
          {right?.ctaLabel || "Notifications"}
        </AppButton>
      </Stack>
    </DSBox>
  );
});
