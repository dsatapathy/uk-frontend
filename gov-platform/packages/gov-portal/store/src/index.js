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

// Providers
export { default as FormEngineProvider } from "./providers/FormEngineProvider.jsx";

// Auth slice (actions + reducer)
export {
  setAuth,
  setUser,
  clearAuth,
} from "./slices/auth/authSlice.js";

export { startFormSession, setSubmitting, setLastSavedAt, endFormSession } from "./slices/form/formSession.slice.js";
export { saveDraft, clearDraft } from "./slices/form/drafts.slice.js";
export { setFlag } from "./slices/form/featureFlags.slice.js";

// Optional: expose a ready store instance
export { appStore } from "./expose-store.js";
