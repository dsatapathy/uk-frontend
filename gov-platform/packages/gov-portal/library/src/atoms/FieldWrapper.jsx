// components/form/FieldWrapper.jsx
import * as React from "react";
import Label from "./Label";
import HelperText from "./HelperText";
import ErrorMessage from "./ErrorMessage";
import s from "@gov/styles/library/form/FieldWrapper.module.scss";

// Pull a readable string (or node) out of whatever we get
function normalizeError(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (React.isValidElement(err)) return err;
  if (typeof err.message === "string") return err.message;
  // Guard: if message is an object/array, stringify briefly
  if (err.message && typeof err.message === "object") {
    try { return JSON.stringify(err.message); } catch { /* noop */ }
  }
  return "";
}

/**
 * FieldWrapper — Standard spacing with label / control / helper-error slots.
 *
 * Props:
 * - label, required, error, helper, htmlFor, idBase, config, children
 *   NOTE: `error` can be a string OR an RHF error object.
 */
export default function FieldWrapper({
  label,
  required = false,
  error,          // can be string | RHF error object
  helper,
  htmlFor,
  idBase,
  config,
  children,
}) {
  const rootClass = [
    s.root,
    s[`layout--${config?.layout || "top"}`],
    s[`gap--${config?.gap || "sm"}`],
    s[`mb--${config?.marginBottom || "sm"}`],
    s[`density--${config?.density || "md"}`],
  ].filter(Boolean).join(" ");

  const errorId = idBase ? `${idBase}-error` : undefined;
  const helpId  = idBase ? `${idBase}-help`  : undefined;

  const message = normalizeError(error);

  return (
    <div className={rootClass}>
      {label ? (
        <div className={s.header}>
          <Label htmlFor={htmlFor} required={required}>{label}</Label>
        </div>
      ) : null}

      <div className={s.control}>{children}</div>

      <div className={s.assist}>
        {message ? <ErrorMessage id={errorId} message={message} /> : null}
        {(!message || config?.showHelperWhenError) && helper ? (
          <HelperText id={helpId}>{helper}</HelperText>
        ) : null}
      </div>
    </div>
  );
}
