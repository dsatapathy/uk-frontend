import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./Landing.jsx"),
  "LandingPage"
);
export const loadFarmerClimateSmartAgricultureTraining = asDefault(
  () => import("./FarmerClimateSmartAgricultureTraining.jsx"),
  "FarmerClimateSmartAgricultureTraining"
);
export const loadStaffPerformanceRecord = asDefault(
  () => import("./StaffPerformanceRecord.jsx"),
  "StaffPerformanceRecord"
);
export const loadCaseStudyUpload = asDefault(
  () => import("./CaseStudyUpload.jsx"),
  "CaseStudyUpload"
);
export const loadReapCapacityBuildingRecord = asDefault(
  () => import("./ReapCapacityBuildingRecord.jsx"),
  "ReapCapacityBuildingRecord"
);
export const loadTrainingLandingPage = asDefault(
  () => import("./TrainingLanding.jsx"),
  "TrainingLanding"
);