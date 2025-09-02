import { makeLoader, registerAll } from "./helpers";

// “Components” that aren’t strictly atoms/molecules/organisms
export const loadAuthCard     = makeLoader("../components/AuthCard.jsx",     "AuthCard");
export const loadBrand        = makeLoader("../components/Brand.jsx",        "Brand");
export const loadCaptchaBox   = makeLoader("../components/CaptchaBox.jsx",   "CaptchaBox");
export const loadFieldRenderer= makeLoader("../form/FieldRenderer.jsx",      "FieldRenderer");

// You also exported ErrorSummary directly earlier — keep it lazy the same way
export const ErrorSummary     = makeLoader("../components/ErrorSummary.jsx", "ErrorSummary");

const defs = [
  ["AuthCard",     loadAuthCard],
  ["Brand",        loadBrand],
  ["CaptchaBox",   loadCaptchaBox],
  ["FieldRenderer",loadFieldRenderer],
  ["ErrorSummary", ErrorSummary],
];

export const registerComponents = () => registerAll(defs);
