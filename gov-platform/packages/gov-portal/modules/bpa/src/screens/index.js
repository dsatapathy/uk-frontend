// widgets/index.js (optional)
import { asDefault } from "@gov/core";

export const loadBpaApply = asDefault(
    () => import("./BpaApplyPage.jsx"),
    "BpaApplyPage"
);

export const loadStepperTestPage = asDefault(
    () => import("./StepperTestPage.jsx"),
    "StepperTestPage"
);
