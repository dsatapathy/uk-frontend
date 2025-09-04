// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  hydrated: false,     // <-- track storage hydration
  tokens: null,
  user: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // mark store as hydrated (true/false)
    setHydrated(state, action) {
      state.hydrated = Boolean(action.payload);
      if (state.status === "idle") {
        state.status = "unauthenticated";
      }
    },

    setAuth(state, action) {
      state.tokens = action.payload?.tokens || null;
      state.user = action.payload?.user || null;
      state.status = state.tokens ? "authenticated" : "unauthenticated";
      // do not change hydrated here; let Hydrator control it
    },

    // IMPORTANT: accept the user object directly
    setUser(state, action) {
      state.user = action.payload || null; // not action.payload.user
    },

    // keep hydrated flag; just clear auth
    clearAuth(state) {
      state.tokens = null;
      state.user = null;
      state.status = "unauthenticated";
      // state.hydrated stays as-is
    },
  },
});

export const { setHydrated, setAuth, setUser, clearAuth } = auth.actions;
export default auth.reducer;
