import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

/** Shallow compare (default). Swap with deepEqual if you need it. */
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
 * Subscribes to specific fields and returns a *stable* derived value.
 *
 * @param {Object} args
 * @param {string|string[]} args.names           Field name or list of names to subscribe to
 * @param {(base, helpers) => any} [args.selector]  Map watched values -> selected output
 *     - base: if names.length===1 -> the value; else -> { [name]: value }
 *     - helpers.get(name): read any other field (NOT subscribed)
 * @param {(prev:any, next:any)=>boolean} [args.eq] Equality function (default: shallowEqual)
 * @param {any} [args.defaultValue]  Initial value when nothing watched yet
 * @returns {any} stable selected value
 */
export function useWatchValue({ names, selector, eq = shallowEqual, defaultValue } = {}) {
  const { control, getValues } = useFormContext();

  // Normalize names
  const nameList = React.useMemo(() => {
    if (!names) return undefined;                       // Do NOT subscribe to all; caller must pass names
    return Array.isArray(names) ? names : [names];
  }, [names]);

  // Subscribe only to those fields
  const watched = useWatch({
    control,
    name: nameList && nameList.length === 1 ? nameList[0] : nameList, // RHF returns value or array based on length
  });

  // Build the "base" input for selector
  const base = React.useMemo(() => {
    if (!nameList) return undefined;
    if (nameList.length === 1) return watched;          // direct scalar
    // map array to object { name: value }
    const arr = Array.isArray(watched) ? watched : [];
    const obj = {};
    nameList.forEach((n, i) => { obj[n] = arr[i]; });
    return obj;
  }, [nameList, watched]);

  // Compute selected output
  const selected = React.useMemo(() => {
    if (!nameList) return defaultValue;
    if (typeof selector === "function") {
      return selector(base, { get: (n) => getValues(n) });
    }
    return base;
  }, [nameList, base, selector, getValues, defaultValue]);

  // Stabilize with equality guard
  const ref = React.useRef(defaultValue);
  const [stable, setStable] = React.useState(() => selected);

  React.useEffect(() => {
    if (!eq(ref.current, selected)) {
      ref.current = selected;
      setStable(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]); // eq intentionally not a dep; treat it as stable

  return stable;
}

/**
 * <WatchValue> — Render-prop component wrapper around useWatchValue.
 *
 * Props:
 * - names, selector, eq, defaultValue (same as hook)
 * - children: function(selected) => ReactNode
 */
export function WatchValue({ names, selector, eq, defaultValue, children }) {
  const val = useWatchValue({ names, selector, eq, defaultValue });
  // Memoize the subtree so heavy children don’t recompute unless val changes
  return React.useMemo(() => (typeof children === "function" ? children(val) : null), [children, val]);
}
