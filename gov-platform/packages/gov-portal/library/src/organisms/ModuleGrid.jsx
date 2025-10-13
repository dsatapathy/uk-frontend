// organisms/ModuleGrid.jsx
import React from "react";
import { Grid, Skeleton, Box, Typography, Button } from "@mui/material";
import ModuleCard from "../molecules/ModuleCard";
import DSBox from "../atoms/DSBox";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const ModuleGrid = React.memo(function ModuleGrid({
  modules = [],
  loading = false,
  onNavigate,
  onQuickAction,
  config,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));   // <600
  const isSm = useMediaQuery(theme.breakpoints.between("sm","md")); // 600–899
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));   // >=900
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));   // >=1200

  // Default grid: xs=1 col, sm=2, md=4, lg=4 (you set md:3/ lg:3 -> 4 cards/row)
  const itemProps = config?.layout?.itemProps || { xs: 12, sm: 6, md: 3, lg: 3 };

  // Responsive card height (can be overridden via config.layout.cardHeights)
  const defaultHeights = { xs: 184, sm: 210, md: 240, lg: 260 };
  const cfgHeights = config?.layout?.cardHeights || defaultHeights;

  const cardHeight = React.useMemo(() => {
    if (isXs) return cfgHeights.xs;
    if (isSm) return cfgHeights.sm;
    if (isLgUp) return cfgHeights.lg;
    if (isMdUp) return cfgHeights.md;
    return defaultHeights.md;
  }, [isXs, isSm, isMdUp, isLgUp, cfgHeights]);

  const skeletonCount = config?.skeletonCount ?? 9;

  const list = React.useMemo(() => {
    const arr = Array.isArray(modules) ? [...modules] : [];
    arr.sort(
      (a, b) =>
        (b?.pinned === true) - (a?.pinned === true) ||
        String(a?.title).localeCompare(String(b?.title))
    );
    return arr;
  }, [modules]);

  const items = loading
    ? Array.from({ length: skeletonCount }).map((_, i) => (
        <Grid key={i} item {...itemProps} sx={{ display: "flex" }}>
          <Skeleton
            variant="rectangular"
            height={cardHeight}
            sx={{ borderRadius: 3, width: "100%" }}
          />
        </Grid>
      ))
    : list.map((m) => (
        <Grid key={m.code || m.title} item {...itemProps} sx={{ display: "flex" }}>
          <DSBox className="fadeUpIn" sx={{ flexGrow: 1, display: "flex" }}>
            <ModuleCard
              module={m}
              onNavigate={onNavigate}
              onQuickAction={onQuickAction}
              navIcon={config?.modules?.navIcon}
              // ↙︎ make height responsive
              cardSx={{ width: "100%", minHeight: cardHeight }}
              showCounts
              showLastUpdated
              showQuickActions
            />
          </DSBox>
        </Grid>
      ));

  return (
    <Grid
      container
      spacing={2.5}
      columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
      alignItems="stretch"
    >
      {!loading && (!list || list.length === 0) ? (
        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px dashed rgba(0,0,0,0.15)",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No modules to display
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your role or filters may be hiding modules, or they are not configured yet.
            </Typography>
            {config?.emptyCta && (
              <Button
                onClick={config.emptyCta.onClick}
                variant="contained"
                startIcon={config.emptyCta.icon || null}
                sx={{ mt: 1 }}
              >
                {config.emptyCta.label || "Configure Modules"}
              </Button>
            )}
          </Box>
        </Grid>
      ) : (
        items
      )}

      <style>{`
        .fadeUpIn{opacity:0; transform:translateY(8px); animation:fadeUp .28s ease forwards}
        @keyframes fadeUp{to{opacity:1; transform:translateY(0)}}
      `}</style>
    </Grid>
  );
});
