// components/form/context/FormContext.jsx
import * as React from "react";

/** ---------- Defaults ---------- */
const DEFAULTS = {
  i18n: {
    locale: "en-IN",
    dict: {},                     // { "key.path": "Label with {name}" }
  },
  formats: {
    // Intl format options
    number: { style: "decimal", maximumFractionDigits: 2 },
    currency: "INR",
    currencyOptions: { maximumFractionDigits: 2 },
    // Fallback DateTimeFormat if you don’t use MUI/Day.js formatting
    dateTime: { day: "2-digit", month: "2-digit", year: "numeric" },
  },
  rbac: {
    roles: [],                    // e.g. ["clerk","reviewer"]
    // Optional policies:
    // permissions: { "forms.submit": ["clerk","admin"], ... }
    // fields: { fieldId: { read: ["*"], write: ["admin"] } }
    permissions: {},
    fields: {},
    defaultAllow: true,           // set false to default-deny
  },
  readonly: false,                // whole-form readOnly
  density: "md",                  // "xs" | "sm" | "md" | "lg"
  dir: "ltr",                     // "ltr" | "rtl"
  namespace: "g-form",            // CSS namespace if you need
};

/** ---------- Utils ---------- */
function deepMerge(a, b) {
  if (!b) return a;
  const out = { ...a };
  for (const k of Object.keys(b)) {
    const va = a?.[k], vb = b[k];
    out[k] =
      va && vb && typeof va === "object" && !Array.isArray(va) && !Array.isArray(vb)
        ? deepMerge(va, vb)
        : vb;
  }
  return out;
}

function template(str, params) {
  if (!params) return str;
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? ""));
}

function translate(i18n, key, params) {
  const k = String(key);
  const msg = i18n?.dict?.[k] ?? k;
  return template(msg, params);
}

function hasRole(roles, candidate) {
  if (!roles || roles.length === 0) return false;
  return roles.includes("*") || roles.includes(candidate);
}

function canPermission(rbac, key) {
  const allowed = rbac?.permissions?.[key];
  if (!allowed) return !!rbac.defaultAllow;
  if (allowed.includes("*")) return true;
  return (rbac.roles || []).some((r) => allowed.includes(r));
}

function canFieldAccess(rbac, fieldId, action) {
  const cfg = rbac?.fields?.[fieldId];
  if (!cfg) return !!rbac.defaultAllow;
  const allowed = cfg[action]; // e.g. { read: ["*"], write: ["admin"] }
  if (!allowed) return !!rbac.defaultAllow;
  if (allowed.includes("*")) return true;
  return (rbac.roles || []).some((r) => allowed.includes(r));
}

/** ---------- Context ---------- */
const FormEngineCtx = React.createContext(null);

/**
 * FormEngineProvider
 * settings: partial overrides of DEFAULTS
 *    { i18n, formats, rbac, readonly, density, dir, namespace }
 */
export function FormEngineProvider({ settings, children }) {
  const merged = React.useMemo(() => deepMerge(DEFAULTS, settings || {}), [settings]);

  // i18n
  const t = React.useCallback((key, params) => translate(merged.i18n, key, params), [merged.i18n]);

  // Intl formatters (memoized)
  const nf = React.useMemo(
    () => new Intl.NumberFormat(merged.i18n?.locale || "en-IN", merged.formats?.number),
    [merged.i18n?.locale, merged.formats?.number]
  );
  const cf = React.useMemo(
    () =>
      new Intl.NumberFormat(merged.i18n?.locale || "en-IN", {
        style: "currency",
        currency: merged.formats?.currency || "INR",
        ...(merged.formats?.currencyOptions || {}),
      }),
    [merged.i18n?.locale, merged.formats?.currency, merged.formats?.currencyOptions]
  );
  const df = React.useMemo(
    () => new Intl.DateTimeFormat(merged.i18n?.locale || "en-IN", merged.formats?.dateTime),
    [merged.i18n?.locale, merged.formats?.dateTime]
  );

  // RBAC helpers (stable)
  const can = React.useCallback((permissionKey) => canPermission(merged.rbac, permissionKey), [merged.rbac]);
  const canField = React.useCallback(
    (fieldId, action = "read") => canFieldAccess(merged.rbac, fieldId, action),
    [merged.rbac]
  );

  const value = React.useMemo(
    () => ({
      ...merged,
      i18n: { ...merged.i18n, t },
      formats: { ...merged.formats, nf, cf, df },
      rbac: { ...merged.rbac, can, canField },
    }),
    [merged, t, nf, cf, df, can, canField]
  );

  return <FormEngineCtx.Provider value={value}>{children}</FormEngineCtx.Provider>;
}

/** ---------- Hooks ---------- */
export function useFormEngine() {
  return React.useContext(FormEngineCtx) || {
    ...DEFAULTS,
    i18n: { ...DEFAULTS.i18n, t: (k, p) => translate(DEFAULTS.i18n, k, p) },
    formats: {
      ...DEFAULTS.formats,
      nf: new Intl.NumberFormat(DEFAULTS.i18n.locale, DEFAULTS.formats.number),
      cf: new Intl.NumberFormat(DEFAULTS.i18n.locale, {
        style: "currency",
        currency: DEFAULTS.formats.currency,
        ...(DEFAULTS.formats.currencyOptions || {}),
      }),
      df: new Intl.DateTimeFormat(DEFAULTS.i18n.locale, DEFAULTS.formats.dateTime),
    },
    rbac: {
      ...DEFAULTS.rbac,
      can: () => DEFAULTS.rbac.defaultAllow,
      canField: () => DEFAULTS.rbac.defaultAllow,
    },
  };
}

export function useI18n()    { return useFormEngine().i18n; }
export function useFormats() { return useFormEngine().formats; }
export function useRBAC()    { return useFormEngine().rbac; }
export function useDensity() { return useFormEngine().density; }
export function useReadonly(){ return useFormEngine().readonly; }
