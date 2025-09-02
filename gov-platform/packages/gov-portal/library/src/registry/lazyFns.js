import { lazyModule } from "@gov/core";

// identical behavior to the original — just split out
const getSchemaMod   = lazyModule(() => import("../utils/schema.js"));
const getMenuMod     = lazyModule(() => import("../utils/menu-utils.js"));
const getZodMod      = lazyModule(() => import("../rules/ValidationFactory.js"));
const getRulesMod    = lazyModule(() => import("../rules/evaluate.js"));
const getDebounceMod = lazyModule(() => import("../utils/debounce.js"));
const getObjectMod   = lazyModule(() => import("../utils/object.js"));

// Keep export names 1:1
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
