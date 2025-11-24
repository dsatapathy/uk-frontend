import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./Landing.jsx"),
  "LandingPage"
);
export const loadCollectionCenter = asDefault(
  () => import("./CollectionCenter.jsx"),
  "CollectionCenter"
);
export const loadInfrastructureLandingPage = asDefault(
  () => import("./InfrastructureLanding.jsx"),
  "InfrastructureLanding"
);