// components/form/FieldWrapper.jsx
import * as React from "react";
import Label from "./Label";
import HelperText from "./HelperText";
import ErrorMessage from "./ErrorMessage";
import s from "@gov/styles/library/form/FieldWrapper.module.scss";

/**
 * FieldWrapper — Standard spacing with label / control / helper-error slots.
 *
 * Props:
 * - label     : string | node
 * - required  : boolean
 * - error     : string | node   (rendered via ErrorMessage)
 * - helper    : string | node   (rendered via HelperText)
 * - htmlFor   : string (optional) — passed to Label for a11y
 * - idBase    : string (optional) — generates `${idBase}-error`, `${idBase}-help`
 * - config    : partial overrides (see DEFAULT_CFG)
 * - children  : the input/control (single element recommended)
 */

const DEFAULT_CFG = {
  layout: "top",            // "top" | "left"
  gap: "sm",                // "xs" | "sm" | "md" | "lg"
  marginBottom: "sm",       // "none" | "xs" | "sm" | "md"
  density: "md",            // "xs" | "sm" | "md" | "lg"
  showHelperWhenError: false,
};

export default function FieldWrapper({
  label,
  required = false,
  error,
  helper,
  htmlFor,
  idBase,
  config,
  children,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);

  const rootClass = [
    s.root,
    s[`layout--${cfg.layout}`],
    s[`gap--${cfg.gap}`],
    s[`mb--${cfg.marginBottom}`],
    s[`density--${cfg.density}`],
  ]
    .filter(Boolean)
    .join(" ");

  const headerEl = label ? (
    <div className={s.header}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
    </div>
  ) : null;

  const errorId = idBase ? `${idBase}-error` : undefined;
  const helpId  = idBase ? `${idBase}-help`  : undefined;

  // Inject a11y props into the single child if possible
  let controlEl = children;
  if (React.isValidElement(children)) {
    const prevDescribed = children.props?.["aria-describedby"];
    const includeHelp = cfg.showHelperWhenError || !error;
    const describedBy = [prevDescribed, error ? errorId : null, includeHelp ? helpId : null]
      .filter(Boolean)
      .join(" ")
      .trim();

    controlEl = React.cloneElement(children, {
      "aria-describedby": describedBy || undefined,
      "aria-invalid": !!error || undefined,
      id: htmlFor || children.props.id, // keep association with Label if provided
    });
  }

  return (
    <div className={rootClass}>
      {headerEl}
      <div className={s.control}>{controlEl}</div>
      <div className={s.assist}>
        <ErrorMessage id={errorId} message={error} />
        {(cfg.showHelperWhenError || !error) && helper ? (
          <HelperText id={helpId}>{helper}</HelperText>
        ) : null}
      </div>
    </div>
  );
}
