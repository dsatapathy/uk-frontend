// src/engine/constants.js
export const DEFAULT_THEME = {
  palette: {
    mode: "light",
    primary: { main: "#16a34a" }, // agri-600
    secondary: { main: "#15803d", contrastText: "#ffffff" }, // agri-700
    background: { default: "#f9fafb" },
  },

  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Nunito", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--g-font": '"Nunito", sans-serif',
        },
        "html, body, #root": {
          height: "100%",
        },
        body: {
          fontFamily: '"Nunito", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "*": {
          fontFamily: '"Nunito", sans-serif',
        },
        ".MuiTypography-root": {
          fontFamily: '"Nunito", sans-serif',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '[aria-disabled="true"] &': {
            opacity: 0.65,
            pointerEvents: "none",
            filter: "grayscale(0.1)",
          },
        },
        inputRoot: {
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--field-border, var(--g-border))',
          },
        },
        paper: {
          // dropdown panel
          '[aria-disabled="true"] &': {
            pointerEvents: "none",
            opacity: 0.65,
          },
        },
      },
    },
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

    // ✅ Added subtle box shadow
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "var(--field-radius, var(--g-radius))",
          backgroundColor: "var(--field-bg, #fff)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",   // <-- added
          transition: "box-shadow .2s ease, border-color .2s ease",

          "&:hover": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.10)", // hover bigger
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--field-hover, var(--g-border))",
          },

          "&.Mui-focused": {
            boxShadow: "0 0 0 3px var(--field-focus-ring, var(--g-focus-ring))",
          },

          "&.Mui-error.Mui-focused": {
            boxShadow:
              "0 0 0 3px var(--field-error-ring, color-mix(in srgb, #ef4444 35%, transparent))",
          },
        },
        notchedOutline: { borderColor: "var(--field-border, var(--g-border))" },
        input: { padding: "14.5px 14px" },
      },
    },

    MuiInputLabel: {
      root: {
        // ... your existing Paper styles
        '[aria-disabled="true"] &': {
          boxShadow: "none",
          filter: "grayscale(0.1)",
          opacity: 0.65,
          pointerEvents: "none",
        },
      },
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
        root: { color: "var(--field-icon, #fff)" },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "var(--g-radius)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)", // paper shadow too
        },
      },
    },

    MuiLink: { styleOverrides: { root: { color: "var(--g-link)" } } },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--field-icon, #fff)",
          "&.Mui-checked, &.MuiCheckbox-indeterminate": {
            color: "var(--g-primary)",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "var(--field-icon, #fff)",
          "&.Mui-checked": { color: "var(--g-primary)" },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          // ... your existing Paper styles
          '[aria-disabled="true"] &': {
            boxShadow: "none",
            filter: "grayscale(0.1)",
            opacity: 0.65,
            pointerEvents: "none",
          },
        },
        switchBase: {
          "&.Mui-checked": { color: "var(--g-primary)" },
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
