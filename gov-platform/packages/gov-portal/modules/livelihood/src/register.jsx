// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadUltraPoorPackageClfLevelActivity,
  loadUltraPoorPackageLcLevelActivity,
  loadDrudgeryReductionTool,
  loadPashuSakhiTraining,
  loadPashuSakhiKit,
  loadPashuSakhiOutcome,
  loadCsaSeedDataOrder,
  loadUltraPoorPackageOutcomeClfLevel,
  loadUltraPoorPackageOutcomeLcLevel,
  loadLivelihoodLanding,
} from "./screens";


export function register(app) {
  registerComponent("DefaultLandingPageLivelihood", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("LivelihoodLanding", LazyWrap(loadLivelihoodLanding, "Livelihood Landing"));
  registerComponent("UltraPoorPackageClfLevelActivity", LazyWrap(loadUltraPoorPackageClfLevelActivity, "Ultra Poor Package CLF Level Activity"));
  registerComponent("UltraPoorPackageLcLevelActivity", LazyWrap(loadUltraPoorPackageLcLevelActivity, "Ultra Poor Package LC Level Activity"));
  registerComponent("DrudgeryReductionTool", LazyWrap(loadDrudgeryReductionTool, "Drudgery Reduction Tool"));
  registerComponent("PashuSakhiTraining", LazyWrap(loadPashuSakhiTraining, "Pashu Sakhi Training"));
  registerComponent("PashuSakhiKit", LazyWrap(loadPashuSakhiKit, "Pashu Sakhi Kit"));
  registerComponent("PashuSakhiOutcome", LazyWrap(loadPashuSakhiOutcome, "Pashu Sakhi Outcome"));
  registerComponent("CsaSeedDataOrder", LazyWrap(loadCsaSeedDataOrder, "CSA Seed Data Order"));
  registerComponent("UltraPoorPackageOutcomeClfLevel", LazyWrap(loadUltraPoorPackageOutcomeClfLevel, "Ultra Poor Package Outcome CLF Level"));
  registerComponent("UltraPoorPackageOutcomeLcLevel", LazyWrap(loadUltraPoorPackageOutcomeLcLevel, "Ultra Poor Package Outcome LC Level"));
  // Add routes
  app.addRoutes([
    // default member landing (kept)
    { path: "/livelihood", exact: true, layout: "Shell", page: { type: "LivelihoodLanding" } },
    { path: "/livelihood/livelihood_repot_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageLivelihood" } },
    { path: "/livelihood/ultra_poor_package_clf_level_activity", exact: true, layout: "Shell", page: { type: "UltraPoorPackageClfLevelActivity" } },
    { path: "/livelihood/ultra_poor_package_lc_level_activity", exact: true, layout: "Shell", page: { type: "UltraPoorPackageLcLevelActivity" } },
    { path: "/livelihood/drudgery_reduction_tool", exact: true, layout: "Shell", page: { type: "DrudgeryReductionTool" } },
    { path: "/livelihood/pashu_sakhi_training", exact: true, layout: "Shell", page: { type: "PashuSakhiTraining" } },
    { path: "/livelihood/pashu_sakhi_kit", exact: true, layout: "Shell", page: { type: "PashuSakhiKit" } },
    { path: "/livelihood/pashu_sakhi_outcome", exact: true, layout: "Shell", page: { type: "PashuSakhiOutcome" } },
    { path: "/livelihood/csa_seed_data_order", exact: true, layout: "Shell", page: { type: "CsaSeedDataOrder" } },
    { path: "/livelihood/ultra_poor_package_outcome_clf_level", exact: true, layout: "Shell", page: { type: "UltraPoorPackageOutcomeClfLevel" } },
    { path: "/livelihood/ultra_poor_package_outcome_lc_level", exact: true, layout: "Shell", page: { type: "UltraPoorPackageOutcomeLcLevel" } },
  ]);
}


const data = [
  {
    "path": "/member?id=qmo91qx2",
    "lastUpdated": null,
    "code": "user-data",
    "children": [
      {
        "path": "/member/user/memberdetails",
        "lastUpdated": null,
        "code": "user-data-beneficiary",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "Beneficiary Member Profile section under User Data Updation.",
        "label": "Beneficiary Member Profile",
        "id": "user-data-1",
        "title": "Beneficiary Member Profile",
        "tenant": "uk"
      },
      {
        "path": "/member/user/shg",
        "lastUpdated": null,
        "code": "user-data-shg",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "SHG Profile Update under User Data Updation.",
        "label": "SHG Profile Update",
        "id": "user-data-2",
        "title": "SHG Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/vo",
        "lastUpdated": null,
        "code": "user-data-vo",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "VO Profile Update under section under User Data Updation.",
        "label": "VO Profile",
        "id": "user-data-3",
        "title": "VO Profile",
        "tenant": "uk"
      },
      {
        "path": "/member/user/clf-lc",
        "lastUpdated": null,
        "code": "user-data-clf-lc",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "CFL Profile Update under User Data Updation.",
        "label": "CFL Profile Update",
        "id": "user-data-4",
        "title": "CFL Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/leader",
        "lastUpdated": null,
        "code": "user-data-leader",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "Leader Profile section under User Data Updation.",
        "label": "Leader Profile",
        "id": "user-data-5",
        "title": "Leader Profile",
        "tenant": "uk"
      },
      {
        "path": "/member/user/shareholder",
        "lastUpdated": null,
        "code": "user-data-shareholder",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "Shareholder Profile Update under User Data Updation.",
        "label": "Shareholder Profile Update",
        "id": "user-data-6",
        "title": "Shareholder Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/fpo",
        "lastUpdated": null,
        "code": "user-data-fpo",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "FPO Profile Update under User Data Updation.",
        "label": "FPO Profile Update",
        "id": "user-data-7",
        "title": "FPO Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/pg",
        "lastUpdated": null,
        "code": "user-data-pg",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "PG Profile Update under User Data Updation.",
        "label": "PG Profile Update",
        "id": "user-data-8",
        "title": "PG Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/lc",
        "lastUpdated": null,
        "code": "user-data-lc",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "LC Profile Update under User Data Updation.",
        "label": "LC Profile Update",
        "id": "user-data-9",
        "title": "LC Profile Update",
        "tenant": "uk"
      },
      {
        "path": "/member/user/lc-to-clf",
        "lastUpdated": null,
        "code": "user-data-lc-to-clf",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/user-data.svg",
        "icon": "person",
        "count": 0,
        "description": "LC to CLF Profile  under User Data Updation.",
        "label": "LC to CLF Profile Update",
        "id": "user-data-10",
        "title": "LC to CLF Profile Update",
        "tenant": "uk"
      }
    ],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/user-data.svg",
    "icon": "person",
    "count": 0,
    "description": "Manage SHG Members, VO, CLF, FPO, PG profiles & LC to CLF conversion.",
    "id": "qmo91qx2",
    "title": "User Data Updation",
    "tenant": "uk"
  },
  {
    "path": "/enterprise?id=h9n5n5pi",
    "lastUpdated": null,
    "code": "enterprise",
    "children": [
      {
        "path": "/enterprise/lc_activity_addition",
        "lastUpdated": null,
        "code": "enterprise-lc-activity-addition",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "LC Activity Addition Form",
        "label": "LC Activity Addition",
        "id": "enterprise-2",
        "title": "LC Activity Addition",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/individual_enterprises_activity_update",
        "lastUpdated": null,
        "code": "enterprise-individual-activity",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "Individual Enterprise Activity Create/Update",
        "label": "Individual Enterprise Activity Create/Update",
        "id": "enterprise-1",
        "title": "Individual Enterprise Activity Create/Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/cbo_enterprise_activity_update",
        "lastUpdated": null,
        "code": "enterprise-cbo-activity",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "CBO Level Enterprise Activity Create/Update",
        "label": "CBO Level Enterprise Activity Create/Update",
        "id": "enterprise-3",
        "title": "CBO Level Enterprise Activity Create/Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/other_enterprise_activity_update",
        "lastUpdated": null,
        "code": "enterprise-other-activity",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "Other Enterprise Activity Create/Update",
        "label": "Other Enterprise Activity Create/Update",
        "id": "enterprise-4",
        "title": "Other Enterprise Activity Create/Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/individual_enterprise_outcome",
        "lastUpdated": null,
        "code": "enterprise-individual-outcome",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "Individual Enterprise Outcome Update",
        "label": "Individual Enterprise Outcome Update",
        "id": "enterprise-5",
        "title": "Individual Enterprise Outcome Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/cbo_enterprise_outcome",
        "lastUpdated": null,
        "code": "enterprise-cbo-business-outcome",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "CBO Level Enterprise Outcome Update",
        "label": "CBO Level Enterprise Outcome Update",
        "id": "enterprise-6",
        "title": "CBO Level Enterprise Outcome Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/other_enterprise_outcome",
        "lastUpdated": null,
        "code": "enterprise-other-outcome",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "Other Enterprise Outcome Update",
        "label": "Other Enterprise Outcome Update",
        "id": "enterprise-7",
        "title": "Other Enterprise Outcome Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/lc_business_monthly",
        "lastUpdated": null,
        "code": "enterprise-lc-business-monthly",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "LC Level Monthly Business Update",
        "label": "LC Level Monthly Business Update",
        "id": "enterprise-8",
        "title": "LC Level Monthly Business Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/clf_business_monthly",
        "lastUpdated": null,
        "code": "enterprise-clf-monthly-business",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "CLF Level Monthly Business",
        "label": "CLF Level Monthly Business Update",
        "id": "enterprise-9",
        "title": "CLF Level Monthly Business Update",
        "tenant": "uk"
      },
      {
        "path": "/enterprise/business_profile_clf_lc_year_wise",
        "lastUpdated": null,
        "code": "enterprise-business-profile-clf-lc-year-wise",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/enterprise.svg",
        "icon": "business",
        "count": 0,
        "description": "LC CLF Business Profile Year Wise",
        "label": "LC CLF Business Profile Year Wise",
        "id": "enterprise-10",
        "title": "LC CLF Business Profile Year Wise",
        "tenant": "uk"
      }


    ],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/enterprise.svg",
    "icon": "business",
    "count": 0,
    "description": "Create, update, and track enterprise activities and outcomes.",
    "id": "h9n5n5pi",
    "title": "Enterprise Data",
    "tenant": "uk"
  },
  {
    "path": "/livelihood?id=xodsen21",
    "lastUpdated": null,
    "code": "livelihood",
    "children": [
      {
        "path": "/livelihood/ultra_poor_package_clf_level_activity",
        "lastUpdated": null,
        "code": "livelihood-ultra-poor-package-clf-level-activity",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Ultra Poor Package CLF Level Activity",
        "label": "Ultra Poor Package CLF Level Activity",
        "id": "livelihood-1",
        "title": "Ultra Poor Package CLF Level Activity",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/ultra_poor_package_lc_level_activity",
        "lastUpdated": null,
        "code": "livelihood-ultra-poor-package-lc-level-activity",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Ultra Poor Package LC Level Activity",
        "label": "Ultra Poor Package LC Level Activity",
        "id": "livelihood-2",
        "title": "Ultra Poor Package LC Level Activity",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/drudgery_reduction_tool",
        "lastUpdated": null,
        "code": "livelihood-drudgery-reduction-tool",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Drudgery Reduction Tool",
        "label": "Drudgery Reduction Tool",
        "id": "livelihood-3",
        "title": "Drudgery Reduction Tool",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/pashu_sakhi_training",
        "lastUpdated": null,
        "code": "livelihood-pashu-sakhi-training",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Pashu Sakhi Training",
        "label": "Pashu Sakhi Training",
        "id": "livelihood-4",
        "title": "Pashu Sakhi Training",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/pashu_sakhi_kit",
        "lastUpdated": null,
        "code": "livelihood-pashu-sakhi-kit",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Pashu Sakhi Kit",
        "label": "Pashu Sakhi Kit",
        "id": "livelihood-5",
        "title": "Pashu Sakhi Kit",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/pashu_sakhi_outcome",
        "lastUpdated": null,
        "code": "livelihood-pashu-sakhi-outcome",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Pashu Sakhi Outcome",
        "label": "Pashu Sakhi Outcome",
        "id": "livelihood-6",
        "title": "Pashu Sakhi Outcome",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/csa_seed_data_order",
        "lastUpdated": null,
        "code": "livelihood-csa-seed-data-order",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "CSA Seed Data Order",
        "id": "livelihood-7",
        "title": "CSA Seed Data Order",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/ultra_poor_package_outcome_clf_level",
        "lastUpdated": null,
        "code": "livelihood-ultra-poor-package-outcome-clf-level",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Ultra Poor Package Outcome CLF Level",
        "label": "Ultra Poor Package Outcome CLF Level",
        "id": "livelihood-8",
        "title": "Ultra Poor Package Outcome CLF Level",
        "tenant": "uk"
      },
      {
        "path": "/livelihood/ultra_poor_package_outcome_lc_level",
        "lastUpdated": null,
        "code": "livelihood-ultra-poor-package-outcome-lc-level",
        "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
        "imageUrl": "/assets/icons/livelihood.svg",
        "icon": "agriculture",
        "count": 0,
        "description": "Ultra Poor Package Outcome LC Level",
        "label": "Ultra Poor Package Outcome LC Level",
        "id": "livelihood-9",
        "title": "Ultra Poor Package Outcome LC Level",
        "tenant": "uk"
      }
    ],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/livelihood.svg",
    "icon": "agriculture",
    "count": 0,
    "description": "Capture ultra-poor interventions, drudgery reduction, livestock, CSA seed data.",
    "id": "xodsen21",
    "title": "Livelihood Data",
    "tenant": "uk"
  },
  {
    "path": "/infrastructure?id=h0tnkeld",
    "lastUpdated": null,
    "code": "infrastructure",
    "children": [],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/infrastructure.svg",
    "icon": "BusinessCenter",
    "count": 0,
    "description": "Record community assets, infrastructure projects & facilities.",
    "id": "h0tnkeld",
    "title": "Infrastructure",
    "tenant": "uk"
  },
  {
    "path": "/finance?id=ywsirwgl",
    "lastUpdated": null,
    "code": "finance",
    "children": [],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/finance.svg",
    "icon": "CurrencyRupee",
    "count": 0,
    "description": "Track financial disbursement, equity contributions, CIF utilization.",
    "id": "ywsirwgl",
    "title": "Finance Data",
    "tenant": "uk"
  },
  {
    "path": "/training?id=7bfm0d1j",
    "lastUpdated": null,
    "code": "training",
    "children": [],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/training.svg",
    "icon": "ModelTraining",
    "count": 0,
    "description": "Capture training programs, attendance, outcomes & knowledge sessions.",
    "id": "7bfm0d1j",
    "title": "Training & Knowledge",
    "tenant": "uk"
  },
  {
    "path": "/line-department?id=6fifdtnu",
    "lastUpdated": null,
    "code": "line-dept",
    "children": [],
    "gradient": "linear-gradient(to right, #239460 0%, #6fc926 100%)",
    "imageUrl": "/assets/icons/line-dept.svg",
    "icon": "Construction",
    "count": 0,
    "description": "Department-specific data entry for Agriculture, Animal Husbandry, etc.",
    "id": "6fifdtnu",
    "title": "Line Departments",
    "tenant": "uk"
  }
]