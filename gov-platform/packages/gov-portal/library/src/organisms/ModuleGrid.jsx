// organisms/ModuleGrid.jsx
import React from "react";
import { Grid, Skeleton } from "@mui/material";
import ModuleCard from "../molecules/ModuleCard";
import DSBox from "../atoms/DSBox";

function spanFromCols(n) {
  const v = Number(n) || 1;
  return Math.max(1, Math.min(12, Math.round(12 / v)));
}

export const ModuleGrid = React.memo(function ModuleGrid({
  modules,
  loading,
  onNavigate,
  config,
}) {
  const maxCols = config?.layout?.maxGridColumns || { xs: 1, sm: 2, md: 3, lg: 4 };

  const xsSpan = spanFromCols(maxCols.xs ?? 1);
  const smSpan = spanFromCols(maxCols.sm ?? 2);
  const mdSpan = spanFromCols(maxCols.md ?? 3);
  const lgSpan = spanFromCols(maxCols.lg ?? 4);

  const items = loading
    ? Array.from({ length: 10 }).map((_, i) => (
        <Grid key={i} item xs={12} sm={smSpan} md={mdSpan} lg={lgSpan} sx={{ display: "flex" }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, width: "100%" }} />
        </Grid>
      ))
    : modules?.map((m) => (
        <Grid key={m.code} item xs={12} sm={smSpan} md={mdSpan} lg={lgSpan} sx={{ display: "flex" }}>
          <DSBox className="fadeUpIn" sx={{ flexGrow: 1, display: "flex" }}>
            <ModuleCard
              module={m}
              onNavigate={onNavigate}
              navIcon={config?.modules?.navIcon}
              cardSx={{ height: "100%" }}   // ← ensure card fills cell
            />
          </DSBox>
        </Grid>
      ));

  return (
    <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} alignItems="stretch">
      {items}
      <style>{`
        .fadeUpIn{opacity:0; transform:translateY(8px); animation:fadeUp .28s ease forwards}
        @keyframes fadeUp{to{opacity:1; transform:translateY(0)}}
      `}</style>
    </Grid>
  );
});
