import { registerComponent, LazyWrap } from "@gov/core";
export * from "./lazyFns";
export * from "./constants";

import { registerAtoms } from "./atoms";
import { registerMolecules } from "./molecules";
import { registerOrganisms } from "./organisms";
import { registerLayouts } from "./layouts";

export function registerLibraryDefaults() {
  registerAtoms();
  registerMolecules();
  registerOrganisms();
  registerLayouts();
}
