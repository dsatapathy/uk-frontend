import React, { createContext, useContext, useState } from "react";

// Keys used for storing auth information
const ACCESS_KEY = "uk-portal::uk.access";
const REFRESH_KEY = "uk-portal::uk.refresh";
const USER_KEY = "uk-portal::user";

const AuthContext = createContext({
  user: null,
  tokens: { access: null, refresh: null },
  setAuth: () => {},
  clearAuth: () => {}
});

function readStored() {
  try {
    const store = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const userRaw = store(USER_KEY);
    return {
      user: userRaw ? JSON.parse(userRaw) : null,
      tokens: {
        access: store(ACCESS_KEY),
        refresh: store(REFRESH_KEY)
      }
    };
  } catch {
    return { user: null, tokens: { access: null, refresh: null } };
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStored());

  const setAuth = (data, { remember } = {}) => {
    setState(data);
    try {
      const storage = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      storage.setItem(USER_KEY, JSON.stringify(data.user));
      storage.setItem(ACCESS_KEY, data.tokens.access);
      storage.setItem(REFRESH_KEY, data.tokens.refresh);
      other.removeItem(USER_KEY);
      other.removeItem(ACCESS_KEY);
      other.removeItem(REFRESH_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const clearAuth = () => {
    setState({ user: null, tokens: { access: null, refresh: null } });
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}