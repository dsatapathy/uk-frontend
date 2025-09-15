// molecules/ModuleCard.jsx (same style, fixed alignment)
import React from "react";
import DSCard from "../atoms/DSCard";
import DSEllipsis from "../atoms/DSEllipsis";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import { Box, Stack, Button, Divider, Chip, Tooltip } from "@mui/material";

const HEADER_H = 64; // match DSCard's header area closely

const fmtDate = (iso) => {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).format(d);
  } catch { return null; }
};

export const ModuleCard = React.memo(function ModuleCard({
  module,
  onNavigate,
  onQuickAction,              // (actionObj, module) => void
  navIcon = "Launch",
  cardSx,
  showCounts = true,
  showLastUpdated = true,
  showQuickActions = true,
}) {
  const go = (evt) => { evt?.preventDefault?.(); onNavigate?.(module); };

  const lastUpdatedText = fmtDate(module?.lastUpdated);

  const CountBadge = () =>
    showCounts && typeof module?.count === "number" ? (
      <Chip
        size="small"
        color="success"
        variant="filled"
        label={`${module.count.toLocaleString()} records`}
        sx={{ fontWeight: 600 }}
      />
    ) : null;

  const LastUpdated = () =>
    showLastUpdated && lastUpdatedText ? (
      <TypographyX variant="caption" color="text.secondary">
        Last updated: {lastUpdatedText}
      </TypographyX>
    ) : null;

  const Actions = () =>
    showQuickActions && Array.isArray(module?.quickActions) && module.quickActions.length ? (
      <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1 }}>
        {module.quickActions.map((qa, i) => {
          const Icon = getIcon(qa.icon || "Bolt");
          const onClick = (e) => {
            e.stopPropagation(); e.preventDefault();
            if (typeof onQuickAction === "function") onQuickAction(qa, module);
            else if (qa.action) onNavigate?.({ ...module, path: qa.action });
          };
          return (
            <Button
              key={`${qa.label}-${i}`}
              size="small"
              variant="contained"
              startIcon={Icon}
              onClick={onClick}
              sx={{ textTransform: "none", borderRadius: 20, px: 1.25, py: 0.4, lineHeight: 1.4 }}
            >
              {qa.label}
            </Button>
          );
        })}
      </Stack>
    ) : null;

  return (
    <DSCard
      intent="neutral"
      variant="ghost"
      elevation={2}
      radius={1}                     // compact radius
      hoverRaise
      headerIcon={getIcon(module?.icon || "Widgets")}
      headerTitle={module?.title}
      headerAction={getIcon(navIcon)}
      to={module?.path}
      onClick={go}
      sx={{
        height: "100%",
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",
        // keep your gradient strip — but limit exactly to header area height
        ...(module?.gradient
          ? {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: HEADER_H,            // was 88 — now matches header region
                background: module.gradient,
                opacity: 0.9,
                pointerEvents: "none",
              },
            }
          : {}),
        ...cardSx,
      }}
      // make header text/icons readable on gradient
      headerSx={module?.gradient ? { color: "#fff" } : undefined}
      // content fills remaining space; spacing unified
      contentSx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: 2,           // consistent padding
        gap: 1,         // consistent vertical rhythm
      }}
    >
      {/* floating icon bubble (stays in header visually) */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(255,255,255,0.25)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      >
        {getIcon(module?.icon || "Widgets")}
      </Box>

      {/* CONTENT */}
      <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
        {/* description */}
        {module?.description && (
          <TypographyX variant="body2" color="text.secondary" sx={{ lineHeight: 1.55, mt: 0.5 }}>
            <DSEllipsis lines={3}>{module.description}</DSEllipsis>
          </TypographyX>
        )}

        {/* KPIs row (single line, wraps nicely if needed) */}
        {(showCounts || showLastUpdated) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 0.5, gap: 1, flexWrap: "wrap" }}
          >
            <CountBadge />
            <LastUpdated />
          </Stack>
        )}

        {/* actions anchored to the bottom so all cards align */}
        {showQuickActions && Array.isArray(module?.quickActions) && module.quickActions.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mt: "auto" }}>
              <Actions />
            </Box>
          </>
        )}
      </Stack>

      {/* keep whole-card click accessible */}
      {module?.path ? (
        <Tooltip title="Open module">
          <Box sx={{ position: "absolute", inset: 0 }} />
        </Tooltip>
      ) : null}
    </DSCard>
  );
});

export default ModuleCard;
