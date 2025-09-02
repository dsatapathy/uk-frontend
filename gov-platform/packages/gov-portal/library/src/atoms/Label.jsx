// components/form/Label.jsx
import * as React from "react";
import { Box, FormLabel, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { visuallyHidden } from "@mui/utils";
import s from "@gov/styles/library/form/Label.module.scss";

/**
 * Label — Config-driven, responsive, SCSS-styled (no context).
 *
 * Props:
 * - htmlFor   : string (id of input)
 * - required  : boolean
 * - tooltip   : string | node
 * - config    : partial per-instance overrides (merged over defaults)
 * - children  : label text
 */

const DEFAULT_CFG = {
  gap: "xs",                 // "xs" | "sm" | "md" | "lg"
  size: "md",                // "sm" | "md" | "lg"
  weight: "600",             // "400" | "500" | "600" | "700" (map to your SCSS)
  color: "default",          // "default" | "muted" | "primary" | etc. (as in SCSS)

  showRequiredMark: true,
  requiredMark: "*",
  requiredColor: "danger",   // maps to .color--danger for asterisk

  showOptionalTag: true,
  optionalText: "(optional)",
  hideOptionalOnXs: false,

  ariaRequiredText: "required",
  ariaOptionalText: "optional",

  showTooltipIcon: true,
  tooltipPlacement: "top",
  renderTooltipIcon: null,   // custom icon component if desired
};

export default function Label({ htmlFor, required = false, tooltip, config, children }) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const TooltipIcon = cfg.renderTooltipIcon || InfoOutlinedIcon;

  const rootClass = [s.root, s[`gap--${cfg.gap}`]].join(" ");

  const textClass = [
    s.text,
    s[`size--${cfg.size}`],
    s[`weight--${cfg.weight}`],
    s[`color--${cfg.color}`],
  ].join(" ");

  const asteriskClass = [s.asterisk, s[`color--${cfg.requiredColor}`]].join(" ");

  const optionalClass = [s.optional, cfg.hideOptionalOnXs ? s.hideOnXs : null]
    .filter(Boolean)
    .join(" ");

  return (
    <Box component="div" className={rootClass}>
      <FormLabel htmlFor={htmlFor} required={false} className={textClass}>
        <span>{children}</span>

        {required ? (
          <>
            {cfg.showRequiredMark ? (
              <span className={asteriskClass} aria-hidden="true">
                {cfg.requiredMark}
              </span>
            ) : null}
            <Box component="span" sx={visuallyHidden}>
              {" " + (cfg.ariaRequiredText || "required")}
            </Box>
          </>
        ) : (
          <>
            {cfg.showOptionalTag ? (
              <span className={optionalClass} aria-hidden="true">
                {cfg.optionalText}
              </span>
            ) : null}
            <Box component="span" sx={visuallyHidden}>
              {" " + (cfg.ariaOptionalText || "optional")}
            </Box>
          </>
        )}
      </FormLabel>

      {tooltip && cfg.showTooltipIcon ? (
        <Tooltip title={tooltip} arrow placement={cfg.tooltipPlacement}>
          <IconButton
            size="small"
            edge="start"
            aria-label={`Help about: ${typeof children === "string" ? children : "field"}`}
            tabIndex={0}
            className={s.iconBtn}
          >
            <TooltipIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
}
