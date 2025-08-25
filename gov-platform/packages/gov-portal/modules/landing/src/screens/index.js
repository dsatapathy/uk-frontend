import { asDefault } from "@gov/core";

export const loadLandingPage = asDefault(
  () => import("./LandingPage.jsx"),
  "LandingPage"
);