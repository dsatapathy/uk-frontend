
import { asDefault } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { registerComponent } from "@gov/core";
import { lazyModule } from "@gov/core";
// atoms
export const loadButton = asDefault(() => import("./atoms/AppButton.jsx"), "AppButton");

// Lazy loaders (no component code pulled yet)
export const loadAuthLayout = asDefault(() => import("./components/AuthLayout.jsx"), "AuthLayout");
export const loadAuthCard = asDefault(() => import("./components/AuthCard.jsx"), "AuthCard");
export const loadBrand = asDefault(() => import("./components/Brand.jsx"), "Brand");
export const loadCaptchaBox = asDefault(() => import("./components/CaptchaBox.jsx"), "CaptchaBox");
export const loadFieldRenderer = asDefault(() => import("./form/FieldRenderer.jsx"), "FieldRenderer");
export const loadNavLayout = asDefault(() => import("./components/NavLayout.jsx"), "NavLayout");
export const ErrorSummary = asDefault(() => import("./components/ErrorSummary.jsx"), "ErrorSummary");
export const TextFieldAtom = asDefault(() => import("./atoms/TextFieldAtom.jsx"), "TextFieldAtom");
export const CheckboxAtom = asDefault(() => import("./atoms/CheckboxAtom.jsx"), "CheckboxAtom");
export const AsyncAutocomplete = asDefault(() => import("./molecules/AsyncAutocomplete.jsx"), "AsyncAutocomplete");
export const FormShell = asDefault(() => import("./organisms/FormShell.jsx"), "FormShell");

const getSchemaMod = lazyModule(() => import("./utils/schema.js"));
const getMenuMod = lazyModule(() => import("./utils/menu-utils.js"));
const getZodMod = lazyModule(() => import("./adapters/zodFactory.js"));
const getRulesMod = lazyModule(() => import("./rules/evaluate.js"));
const getDebounceMod = lazyModule(() => import("./utils/debounce.js"));
const getObjectMod = lazyModule(() => import("./utils/object.js"));
// Lazy function wrappers (async). Usage: await buildSchemaLazy(args)
export const buildSchemaLazy = async (...args) => {
  const { buildSchema } = await getSchemaMod();
  return buildSchema(...args);
};
export const findAncestorsByPathLazy = async (...args) => {
  const { findAncestorsByPath } = await getMenuMod();
  return findAncestorsByPath(...args);
};
export const buildZodFromSchemaLazy = async (...args) => {
  const { buildZodFromSchema } = await getZodMod();
  return buildZodFromSchema(...args);
};

export const evaluateExpressionLazy = async (...args) => {
  const { evaluateExpression } = await getRulesMod();
  return evaluateExpression(...args);
};
export const applyRulesForFieldLazy = async (...args) => {
  const { applyRulesForField } = await getRulesMod();
  return applyRulesForField(...args);
};

export const debounceLazy = async (...args) => {
  const { debounce } = await getDebounceMod();
  return debounce(...args);
};

export const getInLazy = async (...args) => {
  const { getIn } = await getObjectMod();
  return getIn(...args);
};
export const setInLazy = async (...args) => {
  const { setIn } = await getObjectMod();
  return setIn(...args);
};



// Lazy “constants” must be accessed via a function since import() is async
export const getDRAWER_WIDTH = async () => {
  const { DRAWER_WIDTH } = await getMenuMod();
  return DRAWER_WIDTH;
};
// Call this once from the host (bootstrap), not here.
export function registerLibraryDefaults() {
  registerComponent("AuthLayout", LazyWrap(loadAuthLayout, "AuthLayout"));
  registerComponent("AuthCard", LazyWrap(loadAuthCard, "AuthCard"));
  registerComponent("Brand", LazyWrap(loadBrand, "Brand"));
  registerComponent("CaptchaBox", LazyWrap(loadCaptchaBox, "CaptchaBox"));
  registerComponent("FieldRenderer", LazyWrap(loadFieldRenderer, "FieldRenderer"));
  registerComponent("NavLayout", LazyWrap(loadNavLayout, "NavLayout"));
  registerComponent("ErrorSummary", LazyWrap(ErrorSummary, "ErrorSummary"));

  // atoms
  registerComponent("AppButton", LazyWrap(loadButton, "AppButton"));
  registerComponent("TextFieldAtom", LazyWrap(TextFieldAtom, "TextFieldAtom"));
  registerComponent("CheckboxAtom", LazyWrap(CheckboxAtom, "CheckboxAtom"));
  registerComponent("AsyncAutocomplete", LazyWrap(AsyncAutocomplete, "AsyncAutocomplete"));
  registerComponent("FormShell", LazyWrap(FormShell, "FormShell"))
}
