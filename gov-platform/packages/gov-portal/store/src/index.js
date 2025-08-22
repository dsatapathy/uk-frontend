// packages/gov-portal/store/src/index.js

// Store + reducer manager
export { createAppStore, StoreProvider, injectReducer } from "./store.jsx";
export { createReducerManager } from "./reducer/reducerManager.js";

// Hooks
export {
  useAppDispatch,
  useAppSelector,
  useIsAuthenticated,
  useUser,
} from "./hooks";

// Auth slice (actions + reducer)
export {
  default as authReducer,
  setAuth,
  setUser,
  clearAuth,
} from "./slices/authSlice.js";

// Optional: expose a ready store instance
export { appStore } from "./expose-store.js";
