import React, { useMemo, useEffect } from "react";
import { Provider, useStore } from "react-redux";
import { createAppStore } from "../store-core.js";

export function StoreProvider({ children }) {
  const store = useMemo(() => createAppStore(), []);
  useEffect(() => {
    if (typeof window !== "undefined") window.__redux_store__ = store;
  }, [store]);
  return <Provider store={store}>{children}</Provider>;
}

export function injectReducer(key, reducer) {
  return function WithInjection({ children }) {
    const store = useStore();
    useEffect(() => {
      if (!key || !reducer) return;
      if (!store.reducerManager) {
        console.warn("injectReducer: reducerManager not found on store.");
        return;
      }
      store.reducerManager.add(key, reducer);
      return () => store.reducerManager.remove(key);
    }, [store]);
    return <>{children}</>;
  };
}
