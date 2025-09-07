// @gov/ui/config-hooks.js
import * as React from "react";

/** HMR-safe, app-wide cache (survives module reloads in dev) */
const CACHE = (import.meta?.hot
  ? (import.meta.hot.data.__configCache ??= new Map())
  : (globalThis.__configCache ??= new Map())
);

/**
 * useConfig(loadFn, key, options?)
 * - loadFn: () => Promise<Config>  e.g. () => import('./landing.config.js').then(m=>m.default)
 * - key: stable key like 'login' | 'landing'
 * - options: { enabled?: boolean, initial?: any, onError?: (err)=>void }
 */
export function useConfig(loadFn, key, { enabled = true, initial = null, onError } = {}) {
  const getRecord = () => CACHE.get(key);

  const [state, setState] = React.useState(() => {
    const rec = getRecord();
    if (rec?.status === "fulfilled") return { loading: false, value: rec.value, error: null };
    if (rec?.status === "rejected")  return { loading: false, value: initial, error: rec.error };
    return { loading: enabled, value: initial, error: null };
  });

  React.useEffect(() => {
    if (!enabled) return;

    let alive = true;
    let rec = getRecord();

    // Start load only once; share the same promise across all consumers
    if (!rec) {
      const promise = Promise.resolve().then(loadFn);
      rec = { status: "pending", promise };
      CACHE.set(key, rec);

      promise
        .then((val) => {
          CACHE.set(key, { status: "fulfilled", value: val });
          if (alive) setState({ loading: false, value: val, error: null });
        })
        .catch((err) => {
          CACHE.set(key, { status: "rejected", error: err });
          onError?.(err);
          if (alive) setState({ loading: false, value: initial, error: err });
        });
    } else if (rec.status === "fulfilled") {
      // Fast path: already loaded
      if (alive) setState((s) =>
        s.value === rec.value ? s : { loading: false, value: rec.value, error: null }
      );
    } else if (rec.status === "rejected") {
      if (alive) setState({ loading: false, value: initial, error: rec.error });
    } else if (rec.status === "pending") {
      // Attach to in-flight
      rec.promise
        .then((val) => alive && setState({ loading: false, value: val, error: null }))
        .catch((err) => {
          onError?.(err);
          alive && setState({ loading: false, value: initial, error: err });
        });
    }

    return () => { alive = false; };
  }, [enabled, key, loadFn, initial, onError]);

  const reload = React.useCallback(() => {
    CACHE.delete(key);
    // re-run effect by changing a local nonce:
    setState({ loading: true, value: initial, error: null });
  }, [key, initial]);

  return {
    config: state.value,
    loading: state.loading,
    error: state.error,
    reload,
  };
}

/** Optional: prefetch (e.g., on route hover) */
export function prefetchConfig(loadFn, key) {
  const rec = CACHE.get(key);
  if (!rec) {
    const promise = Promise.resolve().then(loadFn);
    CACHE.set(key, { status: "pending", promise });
    promise.then((val) => CACHE.set(key, { status: "fulfilled", value: val }))
           .catch((err) => CACHE.set(key, { status: "rejected", error: err }));
  }
}
