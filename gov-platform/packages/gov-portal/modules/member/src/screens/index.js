// widgets/index.js
import { asDefault } from "@gov/core";

export const loadBeneficiaryMemberProfile = asDefault(
  () => import("./BeneficiaryMemberProfile.jsx"),
  "BeneficiaryMemberProfile"
);

export const loadSHGProfileUpdate = asDefault(
  () => import("./SHGProfileUpdate.jsx"),
  "SHGProfileUpdate"
);

export const loadVOProfileUpdate = asDefault(
  () => import("./VOProfileUpdate.jsx"),
  "VOProfileUpdate"
);

export const loadCLFLCProfileUpdate = asDefault(
  () => import("./CLFLCProfileUpdate.jsx"),
  "CLFLCProfileUpdate"
);

export const loadLeaderProfileUpdate = asDefault(
  () => import("./LeaderProfileUpdate.jsx"),
  "LeaderProfileUpdate"
);

export const loadShareholderProfileUpdate = asDefault(
  () => import("./ShareholderProfileUpdate.jsx"),
  "ShareholderProfileUpdate"
);

export const loadFPOProfileUpdate = asDefault(
  () => import("./FPOProfileUpdate.jsx"),
  "FPOProfileUpdate"
);

export const loadPGProfileUpdate = asDefault(
  () => import("./PGProfileUpdate.jsx"),
  "PGProfileUpdate"
);

export const loadLCToCLFConversion = asDefault(
  () => import("./LCToCLFConversion.jsx"),
  "LCToCLFConversion"
);

export const loadMemberLanding = asDefault(
  () => import("./MemberLanding.jsx"),
  "MemberLanding"
);
export const loadLcProfileUpdate = asDefault(
  () => import("./LcProfileUpdate.jsx"),
  "LcProfileUpdate"
);

export const loadSearchDevPage = asDefault(
  () => import("./SearchDevPage.jsx"),
  "SearchDevPage"
);

export const loadReportDevPage = asDefault(
  () => import("./ReportDevPage.jsx"),
  "ReportDevPage"
);