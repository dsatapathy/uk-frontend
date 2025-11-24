// register.js
import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";


import {
  loadLandingPage,
  loadFinanceLandingPage,
  loadReapFinanceAccountUpdate,
  loadAwpbRawpbFinanceDataUpdate
} from "./screens";


export function register(app) {
  registerComponent("FinanceLanding", LazyWrap(loadFinanceLandingPage, "Finance Landing"));
  registerComponent("DefaultLandingPageFinance", LazyWrap(loadLandingPage, "Landing Page"));
  registerComponent("ReapFinanceAccountUpdate", LazyWrap(loadReapFinanceAccountUpdate, "Reap Finance Account Update"));
  registerComponent("AwpbRawpbFinanceDataUpdate", LazyWrap(loadAwpbRawpbFinanceDataUpdate, "AWPB RAWPB Finance Data Update"));

  // Add routes
  app.addRoutes([
    // default member landing (kept)
    { path: "/finance", exact: true, layout: "Shell", page: { type: "FinanceLanding" } },
    { path: "/finance/finance_report_page", exact: true, layout: "Shell", page: { type: "DefaultLandingPageFinance" } },
    { path: "/finance/reap_finance_account_update", exact: true, layout: "Shell", page: { type: "ReapFinanceAccountUpdate" } },
    { path: "/finance/awpb_rawpb_finance_data_update", exact: true, layout: "Shell", page: { type: "AwpbRawpbFinanceDataUpdate" } },
    
  ]);
}




