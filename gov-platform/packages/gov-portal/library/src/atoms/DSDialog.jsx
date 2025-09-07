import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { surfaceSx } from "../utils/variants";


const DSDialog = React.memo(function DSDialog({
    title,
    actions,
    intent = "neutral",
    variant = "ghost",
    radius = "md",
    maxWidth = "sm",
    fullWidth = true,
    children,
    PaperProps,
    ...rest
}) {
    const theme = useTheme();
    const rad = typeof radius === "number" ? radius : { sm: 8, md: 12, lg: 16, xl: 20 }[radius] || 12;


    return (
        <Dialog
            {...rest}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            PaperProps={{
                sx: {
                    borderRadius: rad,
                    ...surfaceSx(theme, { intent, variant }),
                },
                ...PaperProps,
            }}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent dividers>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
});
export default DSDialog;