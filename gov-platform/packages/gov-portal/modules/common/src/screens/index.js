// widgets/index.js
import { asDefault } from "@gov/core";

export const loadAcknowledgePage = asDefault(
  () => import("./AcknowledgePage.jsx"),
  "AcknowledgePage"
);

export const loadCommonHome = asDefault(
  () => import("./CommonHome.jsx"),
  "CommonHome"
);
export const loadUserDataModuleSearch = asDefault(
  () => import("./UserDataModuleSearch.jsx"),
  "UserDataModuleSearch"
);

