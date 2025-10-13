import React from "react";
import { Card, CardActionArea, CardHeader, CardContent, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { surfaceSx } from "../utils/variants";

const DSCard = React.memo(function DSCard({
    intent = "neutral",
    variant = "ghost",
    hoverRaise = true,
    radius = "md",
    elevation = 2,

    headerIcon,
    headerTitle,
    headerAction,

    // style passthroughs
    headerSx,
    headerTitleSx,
    headerSubheaderSx,
    headerIconSx,
    contentSx,

    // NEW: Floating Icon API
    floatingIcon,                // <Icon /> element (optional)
    floatingSide = "left",       // "left" | "right"
    floatingSize = 44,           // px
    floatingOffset = { top: 14, side: 14 }, // { top, side }
    floatingSx,                  // extra sx for the bubble

    imageUrl,
    aspect = "16/9",
    onClick,
    to,
    children,
    sx,
}) {
    const theme = useTheme();
    const rad = typeof radius === "number" ? radius : { sm: 8, md: 12, lg: 16, xl: 20 }[radius] || 12;

    // header avatar (keep support if you still want it)
    const avatarEl =
        headerIcon && React.isValidElement(headerIcon)
            ? React.cloneElement(headerIcon, {
                sx: { ...(headerIcon.props?.sx || {}), ...(headerIconSx || {}) },
            })
            : headerIcon;

    return (
        <Card
            elevation={elevation}
            sx={{
                borderRadius: typeof radius === "number" ? radius : 12,
                overflow: "hidden",
                ...surfaceSx(theme, { intent, variant }),
                transition: hoverRaise ? "transform 180ms ease, box-shadow 180ms ease" : undefined,
                "&:hover": hoverRaise
                    ? { transform: "translateY(-3px)", boxShadow: theme.shadows[Math.min(6, elevation + 2)] }
                    : undefined,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative", // for floating icon
                ...sx,
            }}
        >
            <CardActionArea
                onClick={onClick}
                {...(to ? { component: "a", href: to } : {})}
                sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
            >
                {(avatarEl || headerTitle || headerAction) && (
                    <CardHeader
                        title={headerTitle}
                        action={headerAction}
                        titleTypographyProps={{
                            fontWeight: 700,
                            component: "h3",
                            sx: {
                                ...(headerTitleSx || {}),
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                                lineHeight: 1.25,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            },
                        }}
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            minHeight: 56,
                            py: 1,
                            pr: floatingSide === "right" ? `${floatingSize + 24}px` : undefined, // pad right if icon on right
                            pl: floatingSide === "left" ? `${floatingSize + 24}px` : undefined,  // pad left if icon on left
                            "& .MuiCardHeader-content": { overflow: "hidden" },
                            ...headerSx,
                        }}
                    />
                )}

                <CardContent sx={{ flexGrow: 1, ...(contentSx || {}) }}>{children}</CardContent>
            </CardActionArea>

            {/* NEW: Floating Icon */}
            {floatingIcon ? (
                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        top: floatingOffset?.top ?? 14,
                        ...(floatingSide === "right"
                            ? { right: floatingOffset?.side ?? 14 }
                            : { left: floatingOffset?.side ?? 14 }),
                        width: floatingSize,
                        height: floatingSize,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        pointerEvents: "none",
                        zIndex: 2,
                        // glassy bubble
                        backgroundColor: "rgba(255,255,255,0.28)",
                        backdropFilter: "blur(6px)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        color: "#000",
                        ...floatingSx,
                    }}
                >
                    {/* Render icon inside (keeps icon color black by default) */}
                    {React.isValidElement(floatingIcon)
                        ? React.cloneElement(floatingIcon, {
                            sx: {
                                fontSize: Math.max(18, floatingSize * 0.48),
                                color: "#000",
                                ...(floatingIcon.props?.sx || {})
                            },
                        })
                        : floatingIcon}
                </Box>
            ) : null}
        </Card>
    );
});

export default DSCard;
