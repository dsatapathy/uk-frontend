
// ======================

import React from "react";
import PropTypes from "prop-types";
import { Snackbar as MUISnackbar, Alert } from "@mui/material";

const SnackbarContext = React.createContext(null);
let globalEnqueue = null;

export function SnackbarProvider({
    children,
    anchorOrigin = { vertical: "bottom", horizontal: "center" },
    autoHideDuration = 4000,
    variant = "filled",
}) {
    const [queue, setQueue] = React.useState([]);
    const [current, setCurrent] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const enqueue = React.useCallback((opts = {}) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const item = {
            id,
            message: String(opts.message ?? ""),
            severity: opts.severity ?? "info",
            duration: Number.isFinite(opts.duration) ? opts.duration : autoHideDuration,
            action: opts.action,
        };
        setQueue((q) => [...q, item]);
        return id;
    }, [autoHideDuration]);

    // expose to non-react callers
    React.useEffect(() => {
        globalEnqueue = (o) => enqueue(o);
        console.info("[Snackbar] provider mounted, globalEnqueue set");
        return () => {
            globalEnqueue = null;
            console.info("[Snackbar] provider unmounted, globalEnqueue cleared");
        };
    }, [enqueue]);

    // when queue updates and nothing is showing, show next
    React.useEffect(() => {
        if (!current && queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrent(next);
            setQueue(rest);
            // ensure fresh open
            setOpen(false);
            // small delay ensures MUI processes the state change
            window.setTimeout(() => setOpen(true), 10);
        }
    }, [queue, current]);

    const handleClose = React.useCallback((event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    }, []);

    const handleExited = React.useCallback(() => {
        setCurrent(null);
    }, []);

    const contextValue = React.useMemo(() => ({ enqueue }), [enqueue]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            {current && (
                <MUISnackbar
                    key={current.id}
                    open={open}
                    autoHideDuration={current.duration}
                    onClose={handleClose}
                    TransitionProps={{ onExited: handleExited }} // <- use TransitionProps
                    anchorOrigin={anchorOrigin}
                >
                    <Alert
                        onClose={handleClose}
                        severity={current.severity}
                        elevation={6}
                        variant={variant}
                        sx={{ width: "100%" }}
                        action={current.action}
                    >
                        {current.message}
                    </Alert>
                </MUISnackbar>
            )}
        </SnackbarContext.Provider>
    );
}

SnackbarProvider.propTypes = {
    children: PropTypes.node,
    anchorOrigin: PropTypes.object,
    autoHideDuration: PropTypes.number,
    variant: PropTypes.oneOf(["filled", "standard", "outlined"]),
};

export function useSnackbar() {
    const ctx = React.useContext(SnackbarContext);
    if (!ctx) throw new Error("useSnackbar must be used within a SnackbarProvider");
    return ctx;
}

export function showSnackbar(opts) {
    if (typeof globalEnqueue === "function") return globalEnqueue(opts);
    // eslint-disable-next-line no-console
    console.warn("SnackbarProvider not mounted - message:", opts?.message ?? opts);
    return null;
}

export default SnackbarProvider;
