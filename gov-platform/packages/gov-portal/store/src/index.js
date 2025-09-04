/**
 * Central exports for the store layer.  The store is built with a
 * `reducerManager` which enables **dynamic reducer registration**.
 * Modules can inject their own slices at runtime without rebuilding
 * the entire store.
 *
 * ```js
 * import { appStore } from "@gov/store";
 * import mySlice from "./slice";
 *
 * // Register the slice under a unique key
 * appStore.reducerManager.add("mySlice", mySlice.reducer);
 *
 * // Optional cleanup
 * // appStore.reducerManager.remove("mySlice");
 * ```
 */
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
  setHydrated,
} from "./slices/auth/authSlice.js";

export { startFormSession, setSubmitting, setLastSavedAt, endFormSession } from "./slices/form/formSession.slice.js";
export { saveDraft, clearDraft } from "./slices/form/drafts.slice.js";
export { setFlag } from "./slices/form/featureFlags.slice.js";

// Optional: expose a ready store instance
export { appStore } from "./expose-store.js";
