// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadReapFinanceAccountUpdate,
  loadAwpbRawpbFinanceDataUpdate
} from "./screens";


export function register(app) {

  registerComponent("DefaultLandingPageFinance", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("ReapFinanceAccountUpdate", LazyWrap(loadReapFinanceAccountUpdate, "Reap Finance Account Update"));
  registerComponent("AwpbRawpbFinanceDataUpdate", LazyWrap(loadAwpbRawpbFinanceDataUpdate, "AWPB RAWPB Finance Data Update"));

  // Add routes
  app.addRoutes([
    // default member landing (kept)
    // { path: "/enterprise", exact: true, layout: "Shell", page: { type: "EnterpriseLanding" } },
    { path: "/finance/finance_report_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageFinance" } },
    { path: "/finance/reap_finance_account_update", exact: true, layout: "Shell", page: { type: "ReapFinanceAccountUpdate" } },
    { path: "/finance/awpb_rawpb_finance_data_update", exact: true, layout: "Shell", page: { type: "AwpbRawpbFinanceDataUpdate" } },
    // { path: "/enterprise/individual_enterprises_activity_update", exact: true, layout: "Shell", page: { type: "IndividualEnterprisesActivityUpdate" } },
    // { path: "/enterprise/lc_activity_addition", exact: true, layout: "Shell", page: { type: "LcActivityAddition" } },
    // { path: "/enterprise/cbo_enterprise_activity_update", exact: true, layout: "Shell", page: { type: "CboEnterpriseActivityUpdate" } },
    // { path: "/enterprise/other_enterprise_activity_update", exact: true, layout: "Shell", page: { type: "OtherEnterpriseActivityUpdate" } },
    // { path: "/enterprise/individual_enterprise_outcome", exact: true, layout: "Shell", page: { type: "IndividualEnterpriseOutcome" } },
    // { path: "/enterprise/cbo_enterprise_outcome", exact: true, layout: "Shell", page: { type: "CboEnterpriseOutcome" } },
    // { path: "/enterprise/other_enterprise_outcome", exact: true, layout: "Shell", page: { type: "OtherEnterpriseOutcome" } },
    // { path: "/enterprise/lc_business_monthly", exact: true, layout: "Shell", page: { type: "LcBussinessMonthly" } },
    // { path: "/enterprise/clf_business_monthly", exact: true, layout: "Shell", page: { type: "ClfBussinessMonthly" } },
    // { path: "/enterprise/business_profile_clf_lc_year_wise", exact: true, layout: "Shell", page: { type: "BusinessProfileClfLcYearWise" } },
  ]);
}




