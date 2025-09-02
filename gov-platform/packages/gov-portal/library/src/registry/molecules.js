import { makeLoader, registerAll } from "./helpers";

export const AsyncAutocomplete = makeLoader("../molecules/AsyncAutocomplete.jsx", "AsyncAutocomplete");
export const MultiSelect       = makeLoader("../molecules/MultiSelect.jsx",       "MultiSelect");
export const Section           = makeLoader("../molecules/Section.jsx",           "Section");     // if present
export const FieldRow          = makeLoader("../molecules/FieldRow.jsx",          "FieldRow");    // if present

const defs = [
  ["AsyncAutocomplete", AsyncAutocomplete],
  ["MultiSelect",       MultiSelect],
  ["Section",           Section],
  ["FieldRow",          FieldRow],
];

export const registerMolecules = () => registerAll(defs);
