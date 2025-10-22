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
const has = (v) => v !== undefined && v !== null && v !== "";

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
  const [open, setOpen] = useState(false); // fetch only when open
  const deps = contextDeps || {};
  const ready = depsReady(deps);

  const valueKey = field?.options?.valueKey || "value";
  const labelKey = field?.options?.labelKey || "label";
  const endpointKey = field?.options?.endpointKey;
  const endpointOverride = field?.options?.endpoint;

  // ▼ configurable typography (with safe defaults)
  const dropdownFontFamily =
    field?.options?.dropdownFontFamily || `"Nunito",sans-serif`;
  const dropdownFontSize =
    field?.options?.dropdownFontSize != null ? field.options.dropdownFontSize : 14;

  const onInputChange = useMemo(
    () =>
      debounce((_, v, reason) => {
        if (reason === "input") setQuery(v || "");
      }, 300),
    []
  );

  const shouldLoad =
    !hidden && !disabled && ready && (open || (rhf.value ?? "") !== "");

  const finalQuery = useMemo(() => {
    const baseQuery = field?.options?.query || {};
    const dynamicQuery = field?.options?.queryBuilder
      ? field.options.queryBuilder(deps)
      : {};
    return {
      ...baseQuery,
      ...dynamicQuery,
      ...(query ? { search: query } : {}),
    };
  }, [field?.options, deps, query]);

  const { data = [], isLoading, isFetching } = useOptions(endpointKey, {
    query: finalQuery,
    deps,
    endpoint: endpointOverride,
    enabled: shouldLoad,
  });

  // clear stale value when parents cleared
  useEffect(() => {
    if (!ready && rhf.value != null) rhf.onChange(null);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected =
    data.find((o) => o?.[valueKey] === rhf?.value) ||
    (has(rhf.value)
      ? { [valueKey]: rhf.value, [labelKey]: String(rhf.value) }
      : null);

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
      isOptionEqualToValue={(opt, val) =>
        opt?.[valueKey] === (val && typeof val === "object" ? val[valueKey] : val)
      }

      // Always works (per-item control)
      renderOption={(liProps, option) => (
        <li
          {...liProps}
          style={{
            ...(liProps?.style || {}),
            fontFamily: dropdownFontFamily,
            fontSize: dropdownFontSize,
          }}
        >
          {option?.[labelKey] ?? ""}
        </li>
      )}

      componentsProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-listbox": {
              fontFamily: dropdownFontFamily,
              fontSize: dropdownFontSize,
              lineHeight: 1.45,
            },
            "& .MuiAutocomplete-option": {
              fontFamily: dropdownFontFamily,
              fontSize: dropdownFontSize,
              "&:hover, &.Mui-focused, &.Mui-focusVisible, &[aria-selected='true']": {
                backgroundColor: "var(--g-primary) !important",
                color: "#fff",
              },
            },
          },
        },
      }}

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
          placeholder={field?.options?.placeholder || ""}
          InputProps={{
            ...params.InputProps,
            placeholder: field?.options?.placeholder || "Type to search...",
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
