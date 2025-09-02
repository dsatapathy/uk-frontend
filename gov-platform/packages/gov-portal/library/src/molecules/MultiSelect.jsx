import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import s from "@gov/styles/library/form/MultiSelect.module.scss";

/**
 * MultiSelect — Multiple select with chips (controlled). RHF lives in parent (pass `rhf`).
 *
 * Value in form state = array of primitive option values, e.g. ["A","C"].
 *
 * Props:
 * - rhf?                      : { name, value: string[], onChange, onBlur, ref }
 * - id, name
 * - value: string[]           : controlled (if not using rhf)
 * - onChange(nextValues: string[])
 * - onBlur, inputRef
 * - options: Array<{ value, label, disabled? }> | string[]     // strings auto-normalize
 * - placeholder
 * - disabled, readOnly, error
 * - ariaDescribedBy
 * - loading                   : boolean (optional)
 * - config: {
 *     // input visuals
 *     variant: "outlined"|"filled"|"standard",
 *     size: "sm"|"md",
 *     fullWidth: boolean,
 *     marginY: "none"|"xs"|"sm"|"md",
 *
 *     // option mapping
 *     optionValueKey: string,        // default "value"
 *     optionLabelKey: string,        // default "label"
 *
 *     // UX
 *     limitTags: number|null,        // chips collapsed after N
 *     disableCloseOnSelect: boolean, // keep popup open while selecting
 *     filterSelectedOptions: boolean,
 *     showCheckboxes: boolean,       // render checkboxes in list
 *     showSelectAll: boolean,
 *     selectAllLabel: string,
 *
 *     // selection rules
 *     maxSelected: number|null,      // cap selection count
 *     onMaxSelected?: (max) => void, // optional callback when hitting cap
 *
 *     // chips
 *     chipColor: "default"|"primary"|"secondary"|"success"|"error"|"warning"|"info",
 *     chipVariant: "filled"|"outlined",
 *     chipSize: "sm"|"md",
 *     deletableChips: boolean,
 *   }
 * - textFieldProps, autocompleteProps
 */
const DEFAULT_CFG = {
  variant: "outlined",
  size: "md",
  fullWidth: true,
  marginY: "sm",

  optionValueKey: "value",
  optionLabelKey: "label",

  limitTags: 3,
  disableCloseOnSelect: true,
  filterSelectedOptions: true,
  showCheckboxes: true,
  showSelectAll: false,
  selectAllLabel: "Select all",

  maxSelected: null,

  chipColor: "default",
  chipVariant: "filled",
  chipSize: "sm",
  deletableChips: true,
};

function normalizeOptions(options, valueKey, labelKey) {
  if (!Array.isArray(options)) return [];
  return options.map((o) =>
    typeof o === "string" ? { [valueKey]: o, [labelKey]: o } : o
  );
}

export default function MultiSelect({
  rhf,

  id,
  name,
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  inputRef,

  options = [],
  placeholder,

  disabled,
  readOnly,
  error,
  ariaDescribedBy,

  loading,

  config,
  textFieldProps,
  autocompleteProps,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);
  const muiSize = cfg.size === "sm" ? "small" : "medium";

  // Unify RHF → controlled
  const controlled = rhf
    ? { name: rhf.name, value: rhf.value || [], onChange: rhf.onChange, onBlur: rhf.onBlur, inputRef: rhf.ref }
    : { name, value: valueProp || [], onChange: onChangeProp, onBlur: onBlurProp, inputRef };

  // Normalize options and build lookup map for fast value → option
  const valueKey = cfg.optionValueKey;
  const labelKey = cfg.optionLabelKey;
  const opts = React.useMemo(
    () => normalizeOptions(options, valueKey, labelKey),
    [options, valueKey, labelKey]
  );
  const optByVal = React.useMemo(() => {
    const m = new Map();
    for (const o of opts) m.set(o[valueKey], o);
    return m;
  }, [opts, valueKey]);

  // Selected value objects for Autocomplete
  const selectedValues = Array.isArray(controlled.value) ? controlled.value : [];
  const selectedOptions = selectedValues
    .map((v) => optByVal.get(v))
    .filter(Boolean);

  // Selection guards
  const max = cfg.maxSelected ?? null;
  const reachedMax = max != null && selectedValues.length >= max;

  const getOptionDisabled = (option) => {
    if (option?.disabled) return true;
    if (readOnly) return true;
    if (max == null) return false;
    // Allow toggling already selected ones; block new when cap reached.
    const isSelected = selectedValues.includes(option[valueKey]);
    return reachedMax && !isSelected;
  };

  const handleChange = (_, newSelectedOptions) => {
    if (readOnly) return;
    let next = newSelectedOptions.map((o) => o[valueKey]);

    if (max != null && next.length > max) {
      if (typeof cfg.onMaxSelected === "function") cfg.onMaxSelected(max);
      next = next.slice(0, max);
    }
    controlled.onChange?.(next);
  };

  // “Select all” helpers (works only on enabled options)
  const enabledValues = opts.filter((o) => !o.disabled).map((o) => o[valueKey]);
  const allChecked = enabledValues.length > 0 && enabledValues.every((v) => selectedValues.includes(v));
  const someChecked = enabledValues.some((v) => selectedValues.includes(v));
  const toggleAll = () => {
    if (readOnly) return;
    let next;
    if (allChecked) {
      // unselect all enabled (keep any disabled preselected intact)
      next = selectedValues.filter((v) => !enabledValues.includes(v));
    } else {
      // select all enabled + keep any already selected (unique)
      next = Array.from(new Set([...selectedValues, ...enabledValues]));
      if (max != null && next.length > max) {
        next = next.slice(0, max);
        if (typeof cfg.onMaxSelected === "function") cfg.onMaxSelected(max);
      }
    }
    controlled.onChange?.(next);
  };

  const rootClass = [s.root, s[`my--${cfg.marginY}`]].join(" ");

  return (
    <div className={rootClass}>
      <Autocomplete
        multiple
        id={id}
        size={muiSize}
        options={opts}
        value={selectedOptions}
        onChange={handleChange}
        onBlur={controlled.onBlur}
        disableCloseOnSelect={cfg.disableCloseOnSelect}
        filterSelectedOptions={cfg.filterSelectedOptions}
        getOptionLabel={(o) => (o?.[labelKey] ?? "")}
        isOptionEqualToValue={(a, b) => a?.[valueKey] === b?.[valueKey]}
        getOptionDisabled={getOptionDisabled}
        loading={!!loading}
        // collapse chips after N
        limitTags={cfg.limitTags == null ? -1 : cfg.limitTags}
        // readOnly: prevent typing & selection (MUI lacks direct prop)
        readOnly={readOnly}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant={cfg.variant}
            size={muiSize}
            error={!!error}
            fullWidth={cfg.fullWidth}
            inputRef={controlled.inputRef}
            inputProps={{
              ...params.inputProps,
              "aria-describedby": ariaDescribedBy,
              readOnly, // prevent typing in input
            }}
            {...(textFieldProps || {})}
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const chipProps = getTagProps({ index });
            return (
              <Chip
                {...chipProps}
                key={option[valueKey]}
                label={option[labelKey]}
                color={cfg.chipColor}
                variant={cfg.chipVariant}
                size={cfg.chipSize === "sm" ? "small" : "medium"}
                onDelete={
                  (disabled || readOnly || !cfg.deletableChips)
                    ? undefined
                    : chipProps.onDelete
                }
              />
            );
          })
        }
        renderOption={(props, option, { selected }) => {
          const liProps = { ...props };
          // MUI adds onClick to li; we'll let it work unless readOnly.
          if (readOnly) {
            liProps.onClick = (e) => e.preventDefault();
          }
          return (
            <li {...liProps} key={option[valueKey]}>
              {cfg.showCheckboxes && (
                <Checkbox
                  size={muiSize}
                  checked={selected}
                  disabled={getOptionDisabled(option)}
                  tabIndex={-1}
                  style={{ marginRight: 8 }}
                />
              )}
              {option[labelKey]}
            </li>
          );
        }}
        // Extra props passthrough
        {...(autocompleteProps || {})}
      />

      {cfg.showSelectAll && (
        <div className={s.selectAllRow} aria-disabled={disabled || readOnly}>
          <button
            type="button"
            className={s.selectAllBtn}
            disabled={disabled || readOnly}
            onClick={toggleAll}
            aria-pressed={allChecked}
            aria-describedby={ariaDescribedBy}
          >
            <span className={s.box} data-state={allChecked ? "checked" : someChecked ? "indeterminate" : "unchecked"} />
            <span className={s.label}>{cfg.selectAllLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
