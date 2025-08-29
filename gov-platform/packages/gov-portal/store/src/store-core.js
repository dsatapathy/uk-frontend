import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./slices/auth/authSlice.js";
import formSession from "./slices/form/formSession.slice.js";
import drafts from "./slices/form/drafts.slice.js";
import featureFlags from "./slices/form/featureFlags.slice.js";
import { createReducerManager } from "./reducer/reducerManager.js";

export function createAppStore() {
  const staticReducers = {
    auth,
    form: combineReducers({
      formSession,
      drafts,
      featureFlags,
    }),
  };
  const reducerManager = createReducerManager(staticReducers);
  const store = configureStore({ reducer: reducerManager.reduce });
  store.reducerManager = reducerManager;
  return store;
}
