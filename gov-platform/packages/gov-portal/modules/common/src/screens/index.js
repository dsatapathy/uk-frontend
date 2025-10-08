// widgets/index.js
import { asDefault } from "@gov/core";

export const loadAcknowledgePage = asDefault(
  () => import("./AcknowledgePage.jsx"),
  "AcknowledgePage"
);

