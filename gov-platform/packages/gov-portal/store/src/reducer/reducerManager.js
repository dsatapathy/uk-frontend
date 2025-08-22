import { combineReducers } from "@reduxjs/toolkit";

export function createReducerManager(initial) {
  const reducers = { ...initial };
  let combined = combineReducers(reducers);

  const keysToRemove = [];

  return {
    reduce(state, action) {
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) delete state[key];
        keysToRemove.length = 0;
      }
      return combined(state, action);
    },
    add(key, reducer) {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combined = combineReducers(reducers);
    },
    remove(key) {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combined = combineReducers(reducers);
    },
    getReducers: () => reducers,
  };
}
