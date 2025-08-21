// src/engine/constants.js
export const DEFAULT_THEME = {
    palette: {
      mode: "light",
      primary: { main: "#0b5fff" },
      secondary: { main: "#4f46e5" },
      background: { default: "#f9fafb" },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "var(--field-radius)",
            backgroundColor: "var(--field-bg)",
            transition: "box-shadow .2s ease, border-color .2s ease",
            // hover border
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--field-hover)",
            },
            // focused
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--field-focus)",
              borderWidth: 2,
            },
            "&.Mui-focused": {
              /* focus ring / shadow */
              boxShadow: "0 0 0 3px var(--field-focus-ring)",
            },
            // error
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--field-error)",
            },
            "&.Mui-error.Mui-focused": {
              boxShadow: "0 0 0 3px var(--field-error-ring)",
            },
          },
          notchedOutline: {
            borderColor: "var(--field-border)",
          },
          input: {
            padding: "14.5px 14px", // compact feel
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "rgba(15,23,42,.8)",
            "&.Mui-focused": { color: "var(--field-focus)" },
            "&.Mui-error": { color: "var(--field-error)" },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: { root: { marginLeft: 0, color: "#64748b" } },
      },
      MuiSvgIcon: {
        styleOverrides: { root: { color: "#94a3b8" } }, // adornment icon color
      },
    },
  };
  
  // Avoid repeated boot calls in StrictMode/HMR
  export const bootstrapFlags = { sidebar: false, modules: false };
  