import { makeLoader, registerAll } from "./helpers";

export const AsyncAutocomplete = makeLoader("../molecules/AsyncAutocomplete.jsx", "AsyncAutocomplete");
export const MultiSelect       = makeLoader("../molecules/MultiSelect.jsx",       "MultiSelect");
export const Section           = makeLoader("../molecules/Section.jsx",           "Section");     // if present
export const CardGrid          = makeLoader("../molecules/CardGrid.jsx",          "CardGrid");    // if present
const defs = [
  ["AsyncAutocomplete", AsyncAutocomplete],
  ["MultiSelect",       MultiSelect],
  ["Section",           Section],
  ["CardGrid",          CardGrid],
];

export const registerMolecules = () => registerAll(defs);
