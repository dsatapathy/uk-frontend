import React from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { loadCommonHome } from "@gov/mod-common";


const CommonHome = React.lazy(loadCommonHome);
const BeneficiaryMemberProfile = React.lazy(() =>
  import("./BeneficiaryMemberProfile.jsx")
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

export default function MemberLanding() {
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
        <BeneficiaryMemberProfile />
      )}
    </React.Suspense>
  );
}
