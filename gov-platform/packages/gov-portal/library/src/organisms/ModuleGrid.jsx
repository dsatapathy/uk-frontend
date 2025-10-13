// organisms/ModuleGrid.jsx
import React from "react";
import { Grid, Skeleton, Box, Typography, Button } from "@mui/material";
import ModuleCard from "../molecules/ModuleCard";
import DSBox from "../atoms/DSBox";

export const ModuleGrid = React.memo(function ModuleGrid({
  modules = [],
  loading = false,
  onNavigate,
  onQuickAction,
  config,
}) {
  const cardHeight = config?.layout?.cardHeight ?? 240;
  const skeletonCount = config?.skeletonCount ?? 9;

  // No span calculation — plain Grid breakpoints
  // Default: 1 per row on phones, 2 on small screens, 3 on md+, 3 on lg
  const itemProps = config?.layout?.itemProps || { xs: 12, sm: 6, md: 3, lg: 3 };

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
              cardSx={{ width: "100%", height: "100%" }}
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
