import { makeLoader, registerAll } from "./helpers";

// Keep old export names
export const loadAuthLayout = makeLoader("../components/AuthLayout.jsx", "AuthLayout");
export const loadNavLayout  = makeLoader("../components/NavLayout.jsx",  "NavLayout");

const defs = [
  ["AuthLayout", loadAuthLayout],
  ["NavLayout",  loadNavLayout],
];

export const registerLayouts = () => registerAll(defs);
