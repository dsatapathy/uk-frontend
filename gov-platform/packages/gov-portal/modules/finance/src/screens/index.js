import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./Landing.jsx"),
  "LandingPage"
);
export const loadReapFinanceAccountUpdate = asDefault(
  () => import("./ReapFinanceAccountUpdate.jsx"),
  "ReapFinanceAccountUpdate"
);

export const loadAwpbRawpbFinanceDataUpdate = asDefault(
  () => import("./AwpbRawpbFinanceDataUpdate.jsx"),
  "AwpbRawpbFinanceDataUpdate"
);
export const loadFinanceLandingPage = asDefault(
  () => import("./FinanceLanding.jsx"),
  "FinanceLanding"
);