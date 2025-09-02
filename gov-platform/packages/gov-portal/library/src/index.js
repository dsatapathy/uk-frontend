// Keep the same top-level exports so external imports don’t break.
export * from "./registry/constants";
export * from "./registry/lazyFns";

export * from "./registry/atoms";
export * from "./registry/molecules";
export * from "./registry/organisms";
export * from "./registry/layouts";
export * from "./registry/components";

import { registerAtoms } from "./registry/atoms";
import { registerMolecules } from "./registry/molecules";
import { registerOrganisms } from "./registry/organisms";
import { registerLayouts } from "./registry/layouts";
import { registerComponents } from "./registry/components";

// One call to register everything
export function registerLibraryDefaults() {
  registerAtoms();
  registerMolecules();
  registerOrganisms();
  registerLayouts();
  registerComponents();
}
