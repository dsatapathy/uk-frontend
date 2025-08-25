import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import { createReducerManager } from "./reducer/reducerManager.js";

export function createAppStore() {
  const reducerManager = createReducerManager({ auth });
  const store = configureStore({ reducer: reducerManager.reduce });
  store.reducerManager = reducerManager;
  return store;
}
