// packages/bpa/src/molecules/AsyncAutocomplete.jsx
import React, { useMemo, useState, useEffect } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { debounce } from "../utils/debounce.js";
import { useOptions } from "@gov/data";

/* ----------------------------- helpers ----------------------------- */
function depsReady(deps = {}) {
  const ks = Object.keys(deps || {});
  if (ks.length === 0) return true;
  return ks.every((k) => {
    const v = deps[k];
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    return true;
  });
}
const has = (v) => v !== undefined && v !== null && v !== "";

// set nested path into obj: setDeep(obj, "a.b.c", 1)
function setDeep(obj, path, value) {
  const parts = String(path).split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * Build a `values` object from deps whose keys look like "values.*"
 * Also keep the flat deps so simple GET/param endpoints still work.
 * Example:
 *   { "values.district": "CTC", "values.block": "BK01" }
 * becomes:
 *   depsOut.values = { district: "CTC", block: "BK01" }
 */
function normalizeDepsForTemplates(raw = {}) {
  const out = { ...raw };
  const values = {};
  Object.entries(raw).forEach(([k, v]) => {
    if (k.startsWith("values.")) {
      const path = k.slice("values.".length); // "district" / "block" / "gp"
      setDeep(values, path, v);
    }
  });
  if (Object.keys(values).length > 0) out.values = { ...(out.values || {}), ...values };
  return out;
}

/* --------------------------- component ---------------------------- */
export default function AsyncAutocomplete({
  field,
  rhf,
  label,
  error,
  disabled,
  hidden,
  contextDeps,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false); // only fetch when open

  // Normalize deps so $values.* works in bodyTemplate
  const rawDeps = contextDeps || {};
  const deps = useMemo(() => normalizeDepsForTemplates(rawDeps), [rawDeps]);

  const ready = depsReady(deps);

  const valueKey = field?.options?.valueKey || "value";
  const labelKey = field?.options?.labelKey || "label";
  const endpointKey = field?.options?.endpointKey;
  const endpointOverride = field?.options?.endpoint; // string URL override
  const requestOverride = field?.options?.request;   // { method, url, bodyTemplate, buildBody, buildParams, select }

  // Only update search query when user types (ignore 'reset', 'selectOption', etc.)
  const onInputChange = useMemo(
    () =>
      debounce((_, v, reason) => {
        if (reason === "input") setQuery(v || "");
      }, 300),
    []
  );

  const shouldLoad = !hidden && !disabled && ready && (open || (rhf.value ?? "") !== "");

  const { data = [], isLoading, isFetching } = useOptions(endpointKey, {
    query,
    deps,
    endpoint: endpointOverride,
    request: requestOverride,
    enabled: shouldLoad, // also when a value exists, to resolve label
  });

  // Optional: clear stale value when parent cleared
  useEffect(() => {
    if (!ready && rhf.value != null) rhf.onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const selected =
    data.find((o) => o?.[valueKey] === rhf?.value) ||
    // Optional fallback so label shows even before options load:
    (has(rhf.value) ? { [valueKey]: rhf.value, [labelKey]: String(rhf.value) } : null);

  if (hidden) return null;

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={data}
      value={selected}
      onChange={(_, v) => rhf.onChange(v ? v[valueKey] : null)}
      onInputChange={onInputChange}
      loading={(isLoading || isFetching) && open && ready}
      disabled={disabled || !ready}
      getOptionLabel={(o) => (o && o[labelKey] != null ? String(o[labelKey]) : "")}
      isOptionEqualToValue={(opt, val) =>
        opt?.[valueKey] === (val && typeof val === "object" ? val[valueKey] : val)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={
            !ready
              ? field?.options?.dependsOnHint || "Please select the parent field first"
              : error?.message
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(isLoading || isFetching) && open && ready ? (
                  <CircularProgress size={18} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
