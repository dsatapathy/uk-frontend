// utils (tiny)
export { buildSchema } from "./utils/schema.js";
import { asDefault } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { registerComponent } from "@gov/core";

// atoms
export const loadButton = asDefault(() => import("./atoms/AppButton.jsx"), "AppButton");

// Lazy loaders (no component code pulled yet)
export const loadAuthLayout = asDefault(() => import("./components/AuthLayout.jsx"), "AuthLayout");
export const loadAuthCard = asDefault(() => import("./components/AuthCard.jsx"), "AuthCard");
export const loadBrand = asDefault(() => import("./components/Brand.jsx"), "Brand");
export const loadCaptchaBox = asDefault(() => import("./components/CaptchaBox.jsx"), "CaptchaBox");
export const loadFieldRenderer = asDefault(() => import("./form/FieldRenderer.jsx"), "FieldRenderer");

// Call this once from the host (bootstrap), not here.
export function registerLibraryDefaults() {
    registerComponent("AuthLayout", LazyWrap(loadAuthLayout, "AuthLayout"));
    registerComponent("AuthCard", LazyWrap(loadAuthCard, "AuthCard"));
    registerComponent("Brand", LazyWrap(loadBrand, "Brand"));
    registerComponent("CaptchaBox", LazyWrap(loadCaptchaBox, "CaptchaBox"));
    registerComponent("FieldRenderer", LazyWrap(loadFieldRenderer, "FieldRenderer"));
    // atoms
    registerComponent("AppButton", LazyWrap(loadButton, "AppButton"));
}
