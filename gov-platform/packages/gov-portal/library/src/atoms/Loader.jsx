import React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * Global Loader provider + hook
 *
 * Usage:
 * - Wrap your app root with <LoaderProvider>{children}</LoaderProvider>
 * - In components: const { show, hide, setMessage } = useLoader();
 *    show("Loading..."); // increments internal counter and shows backdrop
 *    hide();             // decrements counter and hides when reaches 0
 * - From non-react code: import { showLoader, hideLoader } and call them
 */

/* module-level refs for non-react callers */
let globalShow = null;
let globalHide = null;
let globalSetMessage = null;

const LoaderContext = React.createContext(null);

export function LoaderProvider({
  children,
  backdropColor = "rgba(0,0,0,0.45)",
  spinnerColor = "primary",
  zIndex = 1300,
}) {
  const [count, setCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const show = React.useCallback((msg) => {
    setMessage((m) => (typeof msg === "string" ? msg : m));
    setCount((c) => c + 1);
  }, []);

  const hide = React.useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  // sync open state with count
  React.useEffect(() => {
    setOpen(count > 0);
  }, [count]);

  // expose to non-react callers
  React.useEffect(() => {
    globalShow = (msg) => show(msg);
    globalHide = () => hide();
    globalSetMessage = (m) => setMessage(String(m ?? ""));
    return () => {
      globalShow = null;
      globalHide = null;
      globalSetMessage = null;
    };
  }, [show, hide]);

  const contextValue = React.useMemo(
    () => ({
      show,
      hide,
      setMessage: (m) => setMessage(String(m ?? "")),
      isOpen: open,
    }),
    [show, hide, open]
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      <Backdrop
        open={open}
        sx={{
          color: (t) => t.palette[spinnerColor]?.main ?? spinnerColor,
          zIndex,
          backgroundColor: backdropColor,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <CircularProgress color={spinnerColor} />
        {message ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="inherit">
              {message}
            </Typography>
          </Box>
        ) : null}
      </Backdrop>
    </LoaderContext.Provider>
  );
}

LoaderProvider.propTypes = {
  children: PropTypes.node,
  backdropColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  zIndex: PropTypes.number,
};

export function useLoader() {
  const ctx = React.useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return ctx;
}

/* non-react helpers for services or plain JS modules */
export function showLoader(msg) {
  if (typeof globalShow === "function") {
    globalShow(msg);
    return;
  }
  // fallback: no provider mounted
  // eslint-disable-next-line no-console
  console.warn("LoaderProvider not mounted - showLoader called", msg);
}

export function hideLoader() {
  if (typeof globalHide === "function") {
    globalHide();
    return;
  }
  // eslint-disable-next-line no-console
  console.warn("LoaderProvider not mounted - hideLoader called");
}

export function setLoaderMessage(msg) {
  if (typeof globalSetMessage === "function") {
    globalSetMessage(msg);
    return;
  }
  // eslint-disable-next-line no-console
  console.warn("LoaderProvider not mounted - setLoaderMessage called", msg);
}

export default LoaderProvider;