// src/engine/constants.js
export const DEFAULT_THEME = {
  palette: {
    mode: "light",
    primary:   { main: "#16a34a" },                 // agri-600
    secondary: { main: "#15803d", contrastText: "#ffffff" }, // agri-700
    background: { default: "#f9fafb" },
  },

  // keep in sync with ThemeBridge -> --g-radius
  shape: { borderRadius: 12 },

  components: {
    // Nice focus ring + tokenized radius for all buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "var(--g-radius)",
          "&:focus-visible": {
            outline: "2px solid var(--g-focus-ring)",
            outlineOffset: "2px",
          },
        },
      },
    },

    // Tokenized inputs (uses your --field-* with fallbacks)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "var(--field-radius, var(--g-radius))",
          backgroundColor: "var(--field-bg, #fff)",
          transition: "box-shadow .2s ease, border-color .2s ease",

          // hover
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--field-hover, var(--g-border))",
          },

          // focused
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--field-focus, var(--g-primary))",
            borderWidth: 2,
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px var(--field-focus-ring, var(--g-focus-ring))",
          },

          // error
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--field-error, #ef4444)",
          },
          "&.Mui-error.Mui-focused": {
            boxShadow:
              "0 0 0 3px var(--field-error-ring, color-mix(in srgb, #ef4444 35%, transparent))",
          },
        },
        notchedOutline: {
          borderColor: "var(--field-border, var(--g-border))",
        },
        input: {
          padding: "14.5px 14px", // compact feel
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--field-label, rgba(15,23,42,.8))",
          "&.Mui-focused": { color: "var(--field-focus, var(--g-primary))" },
          "&.Mui-error": { color: "var(--field-error, #ef4444)" },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: { marginLeft: 0, color: "var(--field-help, #64748b)" },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: { color: "var(--field-icon, #94a3b8)" }, // adornment icon color
      },
    },

    MuiPaper: {
      styleOverrides: { root: { borderRadius: "var(--g-radius)" } },
    },

    MuiLink: {
      styleOverrides: { root: { color: "var(--g-link)" } },
    },
    MuiCheckbox: {
  styleOverrides: {
    root: {
      color: 'var(--field-icon, #94a3b8)',              // unchecked
      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
        color: 'var(--g-primary)',                       // checked/indeterminate
      },
    },
  },
},
MuiRadio: {
  styleOverrides: {
    root: {
      color: 'var(--field-icon, #94a3b8)',              // unchecked
      '&.Mui-checked': {
        color: 'var(--g-primary)',                       // checked
      },
    },
  },
},
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "var(--g-primary)",
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "var(--g-primary)",
          },
        },
      },
    },
  },
};

// Avoid repeated boot calls in StrictMode/HMR
export const bootstrapFlags = { sidebar: false, modules: false };
