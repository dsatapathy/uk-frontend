import * as React from "react";

/**
 * Emotion calls these as hooks. We forward to React's hook:
 * - useInsertionEffect when available (React 18+)
 * - otherwise useLayoutEffect (React 17 fallback)
 */
export function useInsertionEffectAlwaysWithSyncFallback(effect, deps) {
  const hook = React.useInsertionEffect || React.useLayoutEffect;
  return hook(effect, deps);
}

export function useInsertionEffectWithLayoutFallback(effect, deps) {
  const hook = React.useInsertionEffect || React.useLayoutEffect;
  return hook(effect, deps);
}
