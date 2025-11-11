// widgets/index.js
import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./Landing.jsx"),
  "LandingPage"
);
export const loadIndividualEnterprisesActivityUpdate = asDefault(
  () => import("./IndividualEnterprisesActivityUpdate.jsx"),
  "IndividualEnterprisesActivityUpdate"
);
export const loadLcActivityAddition = asDefault(
  () => import("./LcActivityAddition.jsx"),
  "LcActivityAddition"
);
export const loadCboEnterpriseActivityUpdate = asDefault(
  () => import("./CboEnterpriseActivityUpdate.jsx"),
  "CboEnterpriseActivityUpdate"
);
export const loadOtherEnterpriseActivityUpdate = asDefault(
  () => import("./OtherEnterpriseActivityUpdate.jsx"),
  "OtherEnterpriseActivityUpdate"
);

export const loadIndividualEnterpriseOutcome = asDefault(
  () => import("./IndividualEnterpriseOutcome.jsx"),
  "IndividualEnterpriseOutcome"
);
export const loadCboEnterpriseOutcome = asDefault(
  () => import("./CboEnterpriseOutcome.jsx"),
  "CboEnterpriseOutcome"
);
export const loadOtherEnterpriseOutcome = asDefault(
  () => import("./OtherEnterpriseOutcome.jsx"),
  "OtherEnterpriseOutcome"
);
export const loadLcBussinessMonthly = asDefault(
  () => import("./LcBussinessMonthly.jsx"),
  "LcBussinessMonthly"
);
export const loadClfBussinessMonthly = asDefault(
  () => import("./ClfBussinessMonthly.jsx"),
  "ClfBussinessMonthly"
);
export const loadBusinessProfileClfLcYearWise = asDefault(
  () => import("./BusinessProfileClfLcYearWise.jsx"),
  "BusinessProfileClfLcYearWise"
);
export const loadEnterpriseLanding = asDefault(
  () => import("./EnterpriseLanding.jsx"),
  "EnterpriseLanding"
);