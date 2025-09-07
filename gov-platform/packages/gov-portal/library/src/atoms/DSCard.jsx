import React from "react";
import { Card, CardActionArea, CardHeader, CardContent, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { surfaceSx } from "../utils/variants";


const DSCard = React.memo(function DSCard({
    intent = "neutral",
    variant = "ghost", // visual surface
    hoverRaise = true,
    radius = "md",
    elevation = 2,
    headerIcon,
    headerTitle,
    headerAction,
    imageUrl,
    aspect = "16/9",
    onClick,
    to,
    children,
    sx,
}) {
    const theme = useTheme();
    const rad = typeof radius === "number" ? radius : { sm: 8, md: 12, lg: 16, xl: 20 }[radius] || 12;


    return (
        <Card
            elevation={elevation}
            sx={{
                borderRadius: typeof radius === "number" ? radius : 12,
                overflow: "hidden",
                ...surfaceSx(theme, { intent, variant }),
                transition: hoverRaise ? "transform 180ms ease, box-shadow 180ms ease" : undefined,
                "&:hover": hoverRaise ? { transform: "translateY(-3px)", boxShadow: theme.shadows[Math.min(6, elevation + 2)] } : undefined,
                height: "100%",              // ←
                display: "flex",             // ←
                flexDirection: "column",     // ←
                ...sx,
            }}
        >
            <CardActionArea
                onClick={onClick}
                {...(to ? { component: "a", href: to } : {})}
                sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}  // ←
            >
                {(headerIcon || headerTitle || headerAction) && (
                    <CardHeader avatar={headerIcon} title={headerTitle} action={headerAction} titleTypographyProps={{ fontWeight: 700 }} />
                )}
                <CardContent sx={{ flexGrow: 1 }}>{children}</CardContent>  {/* ← stretch content */}
            </CardActionArea>
        </Card>
    );
});
export default DSCard;