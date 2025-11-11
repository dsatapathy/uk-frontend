// widgets/index.js
import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./Landing.jsx"),
  "LandingPage"
);
export const loadUltraPoorPackageClfLevelActivity = asDefault(
  () => import("./UltraPoorPackageClfLevelActivity.jsx"),
  "UltraPoorPackageClfLevelActivity"
);
export const loadUltraPoorPackageLcLevelActivity = asDefault(
  () => import("./UltraPoorPackageLcLevelActivity.jsx"),
  "UltraPoorPackageLcLevelActivity"
);
export const loadDrudgeryReductionTool = asDefault(
  () => import("./DrudgeryReductionTool.jsx"),
  "DrudgeryReductionTool"
);
export const loadPashuSakhiTraining = asDefault(
  () => import("./PashuSakhiTraining.jsx"),
  "PashuSakhiTraining"
);
export const loadPashuSakhiKit = asDefault(
  () => import("./PashuSakhiKit.jsx"),
  "PashuSakhiKit"
);
export const loadPashuSakhiOutcome = asDefault(
  () => import("./PashuSakhiOutcome.jsx"),
  "PashuSakhiOutcome"
);
export const loadCsaSeedDataOrder = asDefault(
  () => import("./CsaSeedDataOrder.jsx"),
  "CsaSeedDataOrder"
);
export const loadUltraPoorPackageOutcomeClfLevel = asDefault(
  () => import("./UltrapoorPackageOutcomeClfLevel.jsx"),
  "UltraPoorPackageOutcomeClfLevelActivity"
);
export const loadUltraPoorPackageOutcomeLcLevel = asDefault(
  () => import("./UltrapoorPackageOutcomeLcLevel.jsx"),
  "UltraPoorPackageOutcomeLcLevelActivity"
);
export const loadLivelihoodLanding = asDefault(
  () => import("./LivelihoodLanding.jsx"),
  "LivelihoodLanding"
);