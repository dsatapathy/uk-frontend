import React, { useMemo, useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useStore } from "react-redux";
import auth from "./slices/authSlice";
import { createReducerManager } from "./reducer/reducerManager";

// Create a store with a reducer manager
export function createAppStore() {
  const reducerManager = createReducerManager({ auth });
  const store = configureStore({ reducer: reducerManager.reduce });
  // attach the reducerManager to the store
  store.reducerManager = reducerManager;
  return store;
}

// Provider that memoizes the store and (optionally) exposes it on window
export function StoreProvider({ children }) {
  const store = useMemo(() => createAppStore(), []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__redux_store__ = store; // optional: handy for debugging
    }
  }, [store]);
  return <Provider store={store}>{children}</Provider>;
}

// HOC to inject/remove a reducer dynamically
export function injectReducer(key, reducer) {
  return function WithInjection({ children }) {
    const store = useStore();

    useEffect(() => {
      if (!key || !reducer) return;
      if (!store.reducerManager) {
        console.warn("injectReducer: reducerManager not found on store.");
        return;
      }
      // add on mount
      store.reducerManager.add(key, reducer);
      // remove on unmount
      return () => {
        store.reducerManager.remove(key);
      };
    }, [store]);

    return <>{children}</>;
  };
}
