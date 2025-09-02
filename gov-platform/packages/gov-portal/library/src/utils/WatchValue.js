// utils/watchValue.js (or wherever your hook lives)
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (let k of ka) if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k])) return false;
  return true;
}

/**
 * useWatchValue
 * - You may pass { control, getValues } explicitly
 * - Or omit them to read from FormProvider context
 */
export function useWatchValue({
  names,
  selector,
  eq = shallowEqual,
  defaultValue,
  control: controlArg,
  getValues: getValuesArg,
} = {}) {
  const ctx = useFormContext?.(); // may be undefined when called above FormProvider
  const control = controlArg || ctx?.control;
  const getValues = getValuesArg || ctx?.getValues;

  // If we still don't have control, bail out safely with defaultValue.
  const nameList = React.useMemo(() => {
    if (!names) return undefined;
    return Array.isArray(names) ? names : [names];
  }, [names]);

  // Without control, return defaultValue and do no subscription.
  if (!control || !nameList) return defaultValue;

  const watched = useWatch({
    control,
    name: nameList.length === 1 ? nameList[0] : nameList,
  });

  const base = React.useMemo(() => {
    if (nameList.length === 1) return watched;
    const arr = Array.isArray(watched) ? watched : [];
    const obj = {};
    nameList.forEach((n, i) => { obj[n] = arr[i]; });
    return obj;
  }, [nameList, watched]);

  const selected = React.useMemo(() => {
    if (typeof selector === "function") {
      return selector(base, { get: (n) => getValues?.(n) });
    }
    return base;
  }, [base, selector, getValues]);

  const ref = React.useRef(defaultValue);
  const [stable, setStable] = React.useState(() => selected);

  React.useEffect(() => {
    if (!eq(ref.current, selected)) {
      ref.current = selected;
      setStable(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return stable;
}
