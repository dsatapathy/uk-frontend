// utils (tiny)
import { asDefault } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { registerComponent } from "@gov/core";

// atoms
export const loadRenderButton = asDefault(() => import("./Buttons/RenderButton.jsx"), "RenderButton");

// Call this once from the host (bootstrap), not here.
export function registerUtilsDefaults() {
    registerComponent("RenderButton", LazyWrap(loadRenderButton, "RenderButton"));
}
