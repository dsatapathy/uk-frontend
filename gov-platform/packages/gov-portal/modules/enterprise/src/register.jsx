// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadIndividualEnterprisesActivityUpdate,
  loadLcActivityAddition,
  loadCboEnterpriseActivityUpdate,
  loadOtherEnterpriseActivityUpdate,
  loadIndividualEnterpriseOutcome,
  loadCboEnterpriseOutcome,
  loadOtherEnterpriseOutcome,
  loadLcBussinessMonthly,
  loadClfBussinessMonthly,
  loadBusinessProfileClfLcYearWise,
  loadEnterpriseLanding,
} from "./screens";


export function register(app) {

  registerComponent("DefaultLandingPageEnterprise", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("EnterpriseLanding", LazyWrap(loadEnterpriseLanding, "Enterprise Landing"));
  registerComponent("IndividualEnterprisesActivityUpdate", LazyWrap(loadIndividualEnterprisesActivityUpdate, "Individual Enterprises Activity Update"));
  registerComponent("LcActivityAddition", LazyWrap(loadLcActivityAddition, "LC Activity Addition"));
  registerComponent("CboEnterpriseActivityUpdate", LazyWrap(loadCboEnterpriseActivityUpdate, "CBO Enterprise Activity Update"));
  registerComponent("OtherEnterpriseActivityUpdate", LazyWrap(loadOtherEnterpriseActivityUpdate, "Other Enterprise Activity Update"));
  registerComponent("IndividualEnterpriseOutcome", LazyWrap(loadIndividualEnterpriseOutcome, "Individual Enterprise Outcome"));
  registerComponent("CboEnterpriseOutcome", LazyWrap(loadCboEnterpriseOutcome, "Cbo Enterprise Outcome"));
  registerComponent("OtherEnterpriseOutcome", LazyWrap(loadOtherEnterpriseOutcome, "Other Enterprise Outcome"));
  registerComponent("LcBussinessMonthly", LazyWrap(loadLcBussinessMonthly, "LC Business Monthly"));
  registerComponent("ClfBussinessMonthly", LazyWrap(loadClfBussinessMonthly, "CLF Business Monthly"));
  registerComponent("BusinessProfileClfLcYearWise", LazyWrap(loadBusinessProfileClfLcYearWise, "Business Profile CLF-LC Year Wise"));
  // Add routes
  app.addRoutes([
    // default member landing (kept)
    { path: "/enterprise", exact: true, layout: "Shell", page: { type: "EnterpriseLanding" } },
    { path: "/enterprise/enterprise_report_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageEnterprise" } },
    { path: "/enterprise/individual_enterprises_activity_update", exact: true, layout: "Shell", page: { type: "IndividualEnterprisesActivityUpdate" } },
    { path: "/enterprise/lc_activity_addition", exact: true, layout: "Shell", page: { type: "LcActivityAddition" } },
    { path: "/enterprise/cbo_enterprise_activity_update", exact: true, layout: "Shell", page: { type: "CboEnterpriseActivityUpdate" } },
    { path: "/enterprise/other_enterprise_activity_update", exact: true, layout: "Shell", page: { type: "OtherEnterpriseActivityUpdate" } },
    { path: "/enterprise/individual_enterprise_outcome", exact: true, layout: "Shell", page: { type: "IndividualEnterpriseOutcome" } },
    { path: "/enterprise/cbo_enterprise_outcome", exact: true, layout: "Shell", page: { type: "CboEnterpriseOutcome" } },
    { path: "/enterprise/other_enterprise_outcome", exact: true, layout: "Shell", page: { type: "OtherEnterpriseOutcome" } },
    { path: "/enterprise/lc_business_monthly", exact: true, layout: "Shell", page: { type: "LcBussinessMonthly" } },
    { path: "/enterprise/clf_business_monthly", exact: true, layout: "Shell", page: { type: "ClfBussinessMonthly" } },
    { path: "/enterprise/business_profile_clf_lc_year_wise", exact: true, layout: "Shell", page: { type: "BusinessProfileClfLcYearWise" } },
  ]);
}




