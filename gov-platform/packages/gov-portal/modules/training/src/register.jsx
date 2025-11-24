// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadTrainingLandingPage,
  loadFarmerClimateSmartAgricultureTraining,
  loadStaffPerformanceRecord,
  loadReapCapacityBuildingRecord,
  loadCaseStudyUpload
} from "./screens";


export function register(app) {
  registerComponent("TrainingLanding", LazyWrap(loadTrainingLandingPage, "Training Landing"));
  registerComponent("DefaultLandingPageTraining", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("FarmerClimateSmartAgricultureTraining", LazyWrap(loadFarmerClimateSmartAgricultureTraining, "Farmer Climate Smart Agriculture Training"));
  registerComponent("StaffPerformanceRecord", LazyWrap(loadStaffPerformanceRecord, "Staff Performance Record"));
  registerComponent("ReapCapacityBuildingRecord", LazyWrap(loadReapCapacityBuildingRecord, "Reap Capacity Building Record"));
  registerComponent("CaseStudyUpload", LazyWrap(loadCaseStudyUpload, "Case Study Upload"));
  app.addRoutes([
    // default member landing (kept)
    { path: "/training", exact: true, layout: "Shell", page: { type: "TrainingLanding" } },
    { path: "/training/training_report_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageTraining" } },
    { path: "/training/farmer_climate_smart_agriculture_training", exact: true, layout: "Shell", page: { type: "FarmerClimateSmartAgricultureTraining" } },
    { path: "/training/staff_performance_record", exact: true, layout: "Shell", page: { type: "StaffPerformanceRecord" } },
    { path: "/training/reap_capacity_building_record", exact: true, layout: "Shell", page: { type: "ReapCapacityBuildingRecord" } },
    { path: "/training/case_study_upload", exact: true, layout: "Shell", page: { type: "CaseStudyUpload" } },
  ]);
}


