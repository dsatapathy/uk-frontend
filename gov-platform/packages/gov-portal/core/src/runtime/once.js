// once.js
export function ensureOnce(key, fn) {
  const isHMR = !!import.meta?.hot;

  // Use Vite's HMR data bag in dev, otherwise a global store in prod/SSR.
  const store = isHMR
    ? (import.meta.hot.data.__onceStore ??= new Map())
    : (globalThis.__onceStore ??= new Map());

  // Already scheduled or completed?
  if (store.has(key)) return store.get(key);

  // Cache the result immediately to avoid double execution.
  let result;
  try {
    result = fn(); // may be sync or Promise
    store.set(key, result);
  } catch (err) {
    // don't cache failures
    throw err;
  }

  // If async fails later, allow a retry.
  if (result && typeof result.then === "function") {
    result.catch(() => {
      store.delete(key);
    });
  }

  // For HMR, clear on dispose so the next full-reload of this module can re-run it.
  if (isHMR) {
    import.meta.hot.dispose(() => {
      store.delete(key);
    });
  }

  return result;
}
