import React from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { loadCommonHome } from "@gov/mod-common";


const CommonHome = React.lazy(loadCommonHome);

const Landing = React.lazy(() =>
  import("./Landing.jsx")
);

const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: "40vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress size={32} />
  </Box>
);

export default function FinanceLanding() {
  const location = useLocation();
  const moduleId = React.useMemo(() => {
    if (!location?.search) return "";
    const params = new URLSearchParams(location.search);
    return params.get("id") || "";
  }, [location?.search]);

  const shouldRenderCommonHome = Boolean(moduleId);

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      {shouldRenderCommonHome ? (
        <CommonHome moduleId={moduleId} />
      ) : (
        <Landing />
      )}
    </React.Suspense>
  );
}
