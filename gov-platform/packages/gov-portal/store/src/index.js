// packages/gov-portal/store/src/index.js

// Store + reducer manager
export { createAppStore } from "./store-core.js";
export { createReducerManager } from "./reducer/reducerManager.js";

// Hooks
export {
  useAppDispatch,
  useAppSelector,
  useIsAuthenticated,
  useUser,
} from "./hooks/index.js";

// Auth slice (actions + reducer)
export {
  setAuth,
  setUser,
  clearAuth,
} from "./slices/authSlice.js";

// Optional: expose a ready store instance
export { appStore } from "./expose-store.js";
