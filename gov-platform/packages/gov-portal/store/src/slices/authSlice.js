import { createSlice } from "@reduxjs/toolkit";

const initialState = { status: "idle" };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.tokens = action.payload.tokens;
      state.user = action.payload.user;
      state.status = action.payload.tokens ? "authenticated" : "unauthenticated";
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearAuth() {
      return { ...initialState, status: "unauthenticated" };
    },
  },
});

export const { setAuth, setUser, clearAuth } = slice.actions;
export default slice.reducer;
