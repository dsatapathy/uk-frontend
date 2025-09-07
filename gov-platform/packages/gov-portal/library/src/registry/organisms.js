import { makeLoader, registerAll } from "./helpers";

export const DynamicForm   = makeLoader("../organisms/DynamicForm.jsx",   "DynamicForm");
export const FormGrid      = makeLoader("../organisms/FormGrid.jsx",      "FormGrid");
export const FieldGroup    = makeLoader("../organisms/FieldGroup.jsx",    "FieldGroup");
export const Repeater      = makeLoader("../organisms/Repeater.jsx",      "Repeater");
export const SectionOrganism = makeLoader("../organisms/SectionOrganism.jsx", "SectionOrganism"); // if you still use it
export const ModuleGrid    = makeLoader("../organisms/ModuleGrid.jsx",    "ModuleGrid");
const defs = [
  ["DynamicForm",    DynamicForm],
  ["FormGrid",       FormGrid],
  ["FieldGroup",     FieldGroup],
  ["Repeater",       Repeater],
  ["SectionOrganism",SectionOrganism],
  ["ModuleGrid",     ModuleGrid],
];

export const registerOrganisms = () => registerAll(defs);
