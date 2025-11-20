// molecules/ModuleCard.jsx
import React from "react";
import DSCard from "../atoms/DSCard";
import TypographyX from "../atoms/TypographyX";
import { getIcon } from "../utils/icons";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// --- NEW: gradient palette + helpers ---------------------------
const GRADIENTS = [
  "linear-gradient(135deg,#239460 0%,#6fc926 100%)", // agri green
  "linear-gradient(135deg,#0061ff 0%,#60efff 100%)", // blue → cyan
  "linear-gradient(135deg,#ff7a18 0%,#af002d 100%)", // orange → red
  "linear-gradient(135deg,#7928ca 0%,#ff0080 100%)", // purple → pink
  "linear-gradient(135deg,#00c6ff 0%,#0072ff 100%)", // sky → royal blue
  "linear-gradient(135deg,#f7971e 0%,#ffd200 100%)", // orange → yellow
  "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)", // teal → green
  "linear-gradient(135deg,#f953c6 0%,#b91d73 100%)", // magenta → plum
];

function djb2(str = "") {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0; // unsigned
}

function pickGradient(module) {
  // explicit override wins
  if (module?.lowgradient) return module.lowgradient;

  const key =
    module?.code ||
    module?.title ||
    module?.path ||
    module?.id ||
    module?.moduleId ||
    "default";
  const idx = djb2(key) % GRADIENTS.length;
  return GRADIENTS[idx];
}
// ---------------------------------------------------------------

export const ModuleCard = React.memo(function ModuleCard({
  module,
  onNavigate,
  cardSx,
}) {
  const theme = useTheme();
  const { createHref, navigate } = useAppNavigation();
  const moduleId =
    module?.id ?? module?.moduleId ?? module?.value ?? module?.code ?? "";
  const targetPath = React.useMemo(() => {
    const basePath = module?.path;
    if (!basePath) return undefined;
    if (!moduleId) return basePath;
    try {
      const [pathWithoutHash, hash = ""] = basePath.split("#");
      const [pathname, initialQuery = ""] = pathWithoutHash.split("?");
      const params = new URLSearchParams(initialQuery);
      params.set("id", moduleId);
      const queryString = params.toString();
      return `${pathname}${queryString ? `?${queryString}` : ""}${
        hash ? `#${hash}` : ""
      }`;
    } catch {
      const separator = basePath.includes("?") ? "&" : "?";
      return `${basePath}${separator}id=${encodeURIComponent(moduleId)}`;
    }
  }, [module?.path, moduleId]);

  const routeTarget = targetPath || module?.path;
  const href = React.useMemo(() => createHref(routeTarget), [createHref, routeTarget]);
  const go = React.useCallback(
    (event) => {
      if (!routeTarget) {
        event?.preventDefault?.();
        return;
      }
      event?.preventDefault?.();
      if (typeof onNavigate === "function") {
        onNavigate(module, routeTarget);
        return;
      }
      navigate(routeTarget);
    },
    [routeTarget, onNavigate, module, navigate]
  );

  const primaryFallback = theme.palette.primary?.main || "#1b5e20";
  const primaryToken = `var(--g-primary, ${primaryFallback})`;
  const IconEl = getIcon(module?.icon || "Widgets");

  // NEW: per-icon gradient
  const iconGradient = pickGradient(module);

  return (
    <DSCard
      elevation={0}
      hoverRaise={false}
      radius={2}
      onClick={go}
      to={href || undefined}
      sx={{
        "&&": {
          borderRadius: 2,
          border: "none",
          background: "linear-gradient(135deg, #ffffff, #e6f0ff)",
          transition:
            "box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `
            0 8px 22px -16px ${alpha(theme.palette.common.black, 0.35)},
            0 0 16px -10px ${primaryToken}
          `,
          "&:hover": {
            boxShadow: `
              0 12px 32px -14px ${alpha(theme.palette.common.black, 0.28)},
              0 0 22px -6px ${primaryToken}
            `,
            transform: "translateY(-4px) scale(1.03)",
          },
          "&:hover .module-card-icon": {
            transform: "rotate(25deg) scale(1.08)",
            // keep same gradient on hover, just add ring/shadow
            boxShadow: `0 2px 10px ${alpha(
              theme.palette.common.black,
              0.18
            )}, 0 0 0 3px ${alpha(theme.palette.common.white, 0.8)}`,
            filter: `drop-shadow(0 0 6px ${alpha(
              theme.palette.primary?.main || "#1b5e20",
              0.3
            )})`,
          },
          "&:hover .module-card-icon svg": { color: "#fff" },
          ...cardSx,
        },
      }}
      contentSx={{
        p: { xs: 1.5, sm: 2 },
        display: "grid",
        justifyItems: "center",
        alignContent: "center",
        gap: 1,
        minHeight: 50,
      }}
    >
      {/* icon with unique gradient background */}
      <Box
        className="module-card-icon"
        sx={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          background: iconGradient, // <-- unique gradient here
          color: "#fff",
          transition:
            "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), filter 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {React.isValidElement(IconEl)
          ? React.cloneElement(IconEl, { sx: { fontSize: 32, color: "#fff" } })
          : IconEl}
      </Box>

      {/* label */}
      <TypographyX
        variant="body1"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          color: primaryToken,
          lineHeight: 1.25,
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          fontSize: { xs: ".95rem", sm: "1rem" },
          maxWidth: "100%",
        }}
      >
        {module?.title}
      </TypographyX>
    </DSCard>
  );
});

export default ModuleCard;
