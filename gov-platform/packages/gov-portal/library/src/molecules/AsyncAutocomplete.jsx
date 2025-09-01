// packages/bpa/src/molecules/AsyncAutocomplete.jsx
import React, { useMemo, useState, useEffect } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { debounce } from "../utils/debounce.js";
import { useOptions } from "@gov/data";

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
  const [open, setOpen] = useState(false);        // 👈 only fetch when open
  const deps = contextDeps || {};
  const ready = depsReady(deps);

  const valueKey = field?.options?.valueKey || "value";
  const labelKey = field?.options?.labelKey || "label";
  const endpointKey = field?.options?.endpointKey;
  const endpointOverride = field?.options?.endpoint;

  // Only update search query when user types (ignore 'reset', 'selectOption', etc.)
  const onInputChange = useMemo(
    () =>
      debounce((_, v, reason) => {
        if (reason === "input") setQuery(v || "");
      }, 300),
    []
  );

  const { data = [], isLoading, isFetching } = useOptions(endpointKey, {
    query,
    deps,
    endpoint: endpointOverride,
    enabled: open && !hidden && !disabled && ready, // 👈 gate by open + deps
  });

  // Optional: clear stale value when parent cleared
  useEffect(() => {
    if (!ready && rhf.value != null) rhf.onChange(null);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = data.find((o) => o?.[valueKey] === rhf?.value) || null;
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
      getOptionLabel={(o) => o?.[labelKey] ?? ""}
      isOptionEqualToValue={(opt, val) => opt?.[valueKey] === val?.[valueKey]}
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
