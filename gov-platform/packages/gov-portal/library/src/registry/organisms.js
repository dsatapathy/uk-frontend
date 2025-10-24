import { makeLoader, registerAll, registerAllOnce } from "./helpers";

export const DynamicForm   = makeLoader("../organisms/DynamicForm.jsx",   "DynamicForm");
export const FormGrid      = makeLoader("../organisms/FormGrid.jsx",      "FormGrid");
export const FieldGroup    = makeLoader("../organisms/FieldGroup.jsx",    "FieldGroup");
export const Repeater      = makeLoader("../organisms/Repeater.jsx",      "Repeater");
export const SectionOrganism = makeLoader("../organisms/SectionOrganism.jsx", "SectionOrganism"); // if you still use it
export const ModuleGrid    = makeLoader("../organisms/ModuleGrid.jsx",    "ModuleGrid");
export const LandingTemplate = makeLoader("../organisms/LandingTemplate.jsx", "LandingTemplate");
export const ConfigStepperMUI = makeLoader("../organisms/ConfigStepperMUI.jsx", "ConfigStepperMUI");
const defs = [
  ["DynamicForm",    DynamicForm],
  ["FormGrid",       FormGrid],
  ["FieldGroup",     FieldGroup],
  ["Repeater",       Repeater],
  ["SectionOrganism",SectionOrganism],
  ["ModuleGrid",     ModuleGrid],
  ["LandingTemplate", LandingTemplate],
  ["ConfigStepperMUI", ConfigStepperMUI],
];

export const registerOrganisms = () => registerAllOnce("registry:organisms", defs);
