// src/engine/constants.js
export const DEFAULT_THEME = {
    palette: {
      mode: "light",
      primary: { main: "#0b5fff" },
      secondary: { main: "#4f46e5" },
      background: { default: "#f9fafb" },
    },
    shape: { borderRadius: 8 },
  };
  
  // Avoid repeated boot calls in StrictMode/HMR
  export const bootstrapFlags = { sidebar: false, modules: false };
  