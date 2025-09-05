// CardGrid.jsx
import React from "react";
import { Grid, Box } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import CardItemSkeleton from "../atoms/CardItemSkeleton";
import CardItem from "../atoms/CardItem";

export default function CardGrid() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery(
    ["cards"],
    async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/cards?page=${pageParam}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json(); // { items:[], nextPage: number|null }
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
      staleTime: 60_000,
      keepPreviousData: true,
    }
  );

  const cards = data?.pages.flatMap((p) => p.items) ?? [];

  // IntersectionObserver sentinel
  const sentinelRef = React.useRef(null);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasNextPage) return;

    let ticking = false;
    const onIntersect = (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      if (isFetchingNextPage) return;
      if (ticking) return;
      ticking = true;
      Promise.resolve(fetchNextPage()).finally(() => {
        // small micro-throttle to avoid quick re-triggers
        setTimeout(() => (ticking = false), 150);
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,           // viewport
      rootMargin: "800px",  // start preloading before reaching bottom
      threshold: 0,
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // initial loading skeleton grid
  if (status === "loading" || isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <CardItemSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <CardItem {...card} />
          </Grid>
        ))}

        {/* Loading placeholders while fetching next page (prevents CLS) */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`sk-${i}`}>
              <CardItemSkeleton />
            </Grid>
          ))}
      </Grid>

      {/* The sentinel that triggers fetching more */}
      <Box
        ref={sentinelRef}
        sx={{
          height: 1, // tiny but visible to the observer
        }}
      />
    </>
  );
}
