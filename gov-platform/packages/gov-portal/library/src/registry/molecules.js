import { makeLoader, registerAll, registerAllOnce } from "./helpers";

export const AsyncAutocomplete = makeLoader("../molecules/AsyncAutocomplete.jsx", "AsyncAutocomplete");
export const MultiSelect       = makeLoader("../molecules/MultiSelect.jsx",       "MultiSelect");
export const Section           = makeLoader("../molecules/Section.jsx",           "Section");     // if present
export const CardGrid          = makeLoader("../molecules/CardGrid.jsx",          "CardGrid");    // if present
export const AttentionBar      = makeLoader("../molecules/AttentionBar.jsx", "AttentionBar"); // re-exporting atom
export const NotificationsModal = makeLoader("../molecules/NotificationsModal.jsx", "NotificationsModal");
const defs = [
  ["AsyncAutocomplete", AsyncAutocomplete],
  ["MultiSelect",       MultiSelect],
  ["Section",           Section],
  ["CardGrid",          CardGrid],
  ["AttentionBar",      AttentionBar],
  ["NotificationsModal", NotificationsModal],
];

export const registerMolecules = () => registerAllOnce("registry:molecules", defs);
