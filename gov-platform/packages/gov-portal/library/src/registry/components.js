import { makeLoader, registerAll, registerAllOnce } from "./helpers";

// “Components” that aren’t strictly atoms/molecules/organisms
export const loadAuthCard     = makeLoader("../components/AuthCard.jsx",     "AuthCard");
export const loadBrand        = makeLoader("../components/Brand.jsx",        "Brand");
export const loadCaptchaBox   = makeLoader("../components/CaptchaBox.jsx",   "CaptchaBox");
export const loadFieldRenderer= makeLoader("../form/FieldRenderer.jsx",      "FieldRenderer");
export const FieldController = makeLoader("../components/FieldController.jsx", "FieldController");
// You can import FieldController directly if you want, but keep it lazy the same way
// export { default as FieldController } from "../components/FieldController.jsx";
// You also exported ErrorSummary directly earlier — keep it lazy the same way
export const ErrorSummary     = makeLoader("../components/ErrorSummary.jsx", "ErrorSummary");

const defs = [
  ["AuthCard",     loadAuthCard],
  ["Brand",        loadBrand],
  ["CaptchaBox",   loadCaptchaBox],
  ["FieldRenderer",loadFieldRenderer],
  ["ErrorSummary", ErrorSummary],
  ["FieldController", FieldController],
];

export const registerComponents = () => registerAllOnce("registry:components", defs);
