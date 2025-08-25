import { createAppStore } from "./store-core.js";

export const appStore = createAppStore();

// expose for dynamic injection (optional)
if (typeof window !== "undefined") {
  window.__redux_store__ = appStore;
}
