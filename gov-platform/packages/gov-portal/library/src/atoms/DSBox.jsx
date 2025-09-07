import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { de } from "zod/v4/locales";
import { surfaceSx } from "../utils/variants";


/**
* DSBox — styled container with prop-driven spacing, radius, elevation,
* surface variants, and flex/grid helpers. Keeps visual consistency.
*/
const DSBox = React.memo(function DSBox({
    as, // html tag override
    intent = "neutral", // primary|neutral|success|warning|danger
    variant = "ghost", // solid|soft|outline|ghost
    radius = "md", // sm|md|lg|xl|number (px)
    elevation = 0, // 0..4 -> MUI elevation mapping
    p, px, py, pt, pr, pb, pl, gap, // spacing helpers
    display, direction, align, justify, wrap, // flex helpers
    grid, gridCols, gridRows, gridGap, // grid helpers
    clickable = false,
    hoverRaise = false,
    sx,
    children,
    ...rest
}) {
    const theme = useTheme();
    const rad = typeof radius === "number" ? radius : { sm: 8, md: 12, lg: 16, xl: 20 }[radius] || 12;


    const baseSx = {
        borderRadius: rad,
        ...(elevation ? { boxShadow: theme.shadows[elevation] } : {}),
        ...(surfaceSx(theme, { intent, variant })),
        ...(clickable ? { cursor: "pointer", userSelect: "none" } : {}),
        ...(hoverRaise ? { transition: "transform .18s ease, box-shadow .18s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: theme.shadows[Math.min(6, (elevation || 2) + 2)] } } : {}),
        ...(display ? { display } : {}),
        ...(direction ? { flexDirection: direction } : {}),
        ...(align ? { alignItems: align } : {}),
        ...(justify ? { justifyContent: justify } : {}),
        ...(wrap ? { flexWrap: wrap } : {}),
        ...(grid ? { display: "grid" } : {}),
        ...(gridCols ? { gridTemplateColumns: gridCols } : {}),
        ...(gridRows ? { gridTemplateRows: gridRows } : {}),
        ...(gridGap ? { gap: gridGap } : {}),
        ...(p !== undefined ? { p } : {}),
        ...(px !== undefined ? { px } : {}),
        ...(py !== undefined ? { py } : {}),
        ...(pt !== undefined ? { pt } : {}),
        ...(pr !== undefined ? { pr } : {}),
        ...(pb !== undefined ? { pb } : {}),
        ...(pl !== undefined ? { pl } : {}),
        ...(gap !== undefined ? { gap } : {}),
        ...sx,
    };


    return (
        <Box component={as} sx={baseSx} {...rest}>
            {children}
        </Box>
    );
});

export default DSBox;