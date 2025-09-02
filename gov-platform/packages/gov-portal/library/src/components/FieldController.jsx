import * as React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

// Wrappers & atoms
import FieldWrapper from "../atoms/FieldWrapper.jsx";
import InputText from "../atoms/InputText.jsx";
import InputNumber from "../atoms/InputNumber.jsx";
import TextArea from "../atoms/TextArea.jsx";
import Checkbox from "../atoms/Checkbox.jsx";
import RadioGroup from "../atoms/RadioGroup.jsx";
import MultiSelect from "../molecules/MultiSelect.jsx";
import AsyncAutocomplete from "../molecules/AsyncAutocomplete.jsx";
import DatePicker from "../atoms/DatePicker.jsx";

/** -----------------------------------------------------------------------
 * Small, safe helpers
 * --------------------------------------------------------------------- */
const TYPE_TO_INPUT = {
  text: "text",
  password: "password",
  email: "email",
  tel: "tel",
  url: "text",
};

const has = (v) => v !== undefined && v !== null && v !== "";

/** read deep path, e.g. "values.city.code" */
function get(obj, path) {
  return String(path || "")
    .split(".")
    .reduce((a, k) => (a == null ? a : a[k]), obj);
}

/** build dependency object from dependsOn: ["values.state","user.tenant"] */
function buildDeps(depList = [], values, user) {
  const out = {};
  depList.forEach((d) => {
    if (d.startsWith("values.")) {
      const key = d.slice(7);                // after "values."
      const param = key.split(".").pop();    // last segment
      out[param] = get(values, key);
    } else if (d.startsWith("user.")) {
      const key = d.slice(5);
      const param = key.split(".").pop();
      out[param] = get(user, key);
    }
  });
  return out;
}

/** are all required dependencies resolved (truthy)? */
function depsResolved(depList = [], values, user) {
  if (!depList.length) return true;
  const d = buildDeps(depList, values, user);
  return Object.values(d).every((v) => has(v));
}

/** tiny trusted-expression evaluator for rule.when like "!values.state" */
function safeBool(expr, values) {
  if (!expr) return false;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("values", `return !!(${expr});`);
    return !!fn(values);
  } catch {
    return false;
  }
}
function safeExpr(expr, values) {
  if (!expr) return undefined;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("values", `return (${expr});`);
    return fn(values);
  } catch {
    return undefined;
  }
}

/** evaluate rules: supports hide/disable/require/derive */
function evaluateRules(field, { values }) {
  const res = { hidden: false, disabled: false, required: false, derived: undefined };
  (field.rules || []).forEach((r) => {
    const ok = safeBool(r.when, values);
    if (!ok) return;
    switch (r.action) {
      case "hide": res.hidden = true; break;
      case "disable": res.disabled = true; break;
      case "require": res.required = true; break;
      case "derive": res.derived = safeExpr(r.value, values); break;
      default: break;
    }
  });
  return res;
}

/** -----------------------------------------------------------------------
 * FieldController
 * --------------------------------------------------------------------- */
/**
 * Props:
 * - field: a field node from your JSON schema
 * - wrap?: boolean = true                 // wrap with FieldWrapper
 * - wrapperProps?: object                 // extra props for FieldWrapper { config?, ...rest }
 * - user?: any, flags?: any               // optional context
 * - ruleEngine?: (field, ctx)=>{hidden,disabled,required,derived}
 * - mountWhenHidden?: boolean = true      // keep mounted when hidden
 */
export default function FieldController({
  field,
  wrap = true,
  wrapperProps,
  user,
  flags,
  ruleEngine,
  mountWhenHidden = true,
}) {
  const { control, setValue, getValues } = useFormContext();

  // watch only what we need: the field itself + declared dependsOn
  const depList = field?.options?.dependsOn || [];
  useWatch({
    control,
    name: [field.id, ...depList.map((d) => d.replace(/^values\./, ""))],
  });

  const values = getValues(); // RHF snapshot for rules/derive
  const ruleState = React.useMemo(
    () => (typeof ruleEngine === "function" ? ruleEngine(field, { values, user, flags }) : evaluateRules(field, { values })),
    [field, values, user, flags, ruleEngine]
  );

  // apply derived value (formula) when present (in effect only; not during render)
  React.useEffect(() => {
    if (ruleState.derived !== undefined) {
      setValue(field.id, ruleState.derived, { shouldValidate: true, shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleState.derived]);

  // compute “required” from rules + validators
  const requiredBySchema = (field.validations || []).some((v) => v.type === "required");
  const required = !!ruleState.required || requiredBySchema;

  // common flags
  const disabled = !!ruleState.disabled || !!field.props?.disabled;
  const hidden = !!ruleState.hidden || !!field.props?.hidden;

  // dependency context for async option components
  const ctxDeps = buildDeps(depList, values, user);
  const depsReady = depsResolved(depList, values, user);

  // If not mounting hidden fields, bail out entirely
  if (hidden && !mountWhenHidden) return null;

  // Wrapper config merge (layout can come from field or wrapperProps.config)
  const { config: wrapperCfgIn, ...wrapperRest } = wrapperProps || {};
  const wrapperCfg = {
    ...(wrapperCfgIn || {}),
    layout: (wrapperCfgIn && wrapperCfgIn.layout) || field.layout || "top",
  };

  // render with RHF Controller
  return (
    <Controller
      name={field.id}
      defaultValue={
        field.defaultValue !== undefined
          ? field.defaultValue
          : field.type === "checkbox"
          ? false
          : ""
      }
      control={control}
      render={({ field: rhf, fieldState }) => {
        const errorObj = fieldState.error;              // RHF error object (for wrapper)
        const body = renderFieldByType(field, {
          rhf,
          error: errorObj,
          disabled,
          required,
          hidden,
          ctxDeps,
          depsReady,
        });

        if (!wrap) return body;

        return (
          <FieldWrapper
            {...wrapperRest}
            label={field.label}
            required={required}
            error={errorObj}                // pass the OBJECT to wrapper (it normalizes to string)
            helper={field.helperText}
            config={wrapperCfg}
          >
            {body}
          </FieldWrapper>
        );
      }}
    />
  );
}

/** choose the right atom/molecule for this field */
function renderFieldByType(field, { rhf, error, disabled, required, hidden, ctxDeps, depsReady }) {
  if (hidden) return null;

  // Inputs expect boolean error; wrapper receives the object.
  const inputCommon = { disabled, required, error: !!error };

  switch (field.type) {
    case "checkbox":
      return (
        <Checkbox
          name={rhf.name}
          checked={!!rhf.value}
          onChange={(ev) => rhf.onChange(ev.target.checked)}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          label={field.inlineLabel || field.label}
          indeterminate={field.props?.indeterminate}
          {...inputCommon}
        />
      );

    case "radio":
    case "radio-group":
      return (
        <RadioGroup
          name={rhf.name}
          value={rhf.value ?? ""}
          onChange={(v) => rhf.onChange(v)}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          options={field.options?.items || []}
          optionLabelKey={field.options?.labelKey || "label"}
          optionValueKey={field.options?.valueKey || "value"}
          row={field.props?.row ?? false}
          {...inputCommon}
        />
      );

    case "multiselect":
      return (
        <MultiSelect
          name={rhf.name}
          value={Array.isArray(rhf.value) ? rhf.value : []}
          onChange={(v) => rhf.onChange(v)}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          options={field.options?.items || []} // static options
          maxSelected={field.props?.maxSelected}
          chipColor={field.props?.chipColor}
          {...inputCommon}
        />
      );

    case "autocomplete":
      return (
        <AsyncAutocomplete
          field={field}
          rhf={{
            value: rhf.value ?? null,
            onChange: (v) => rhf.onChange(v),
            onBlur: rhf.onBlur,
            name: rhf.name,
            ref: rhf.ref,
          }}
          contextDeps={ctxDeps}
          enabled={depsReady && !disabled}
          {...inputCommon}
        />
      );

    case "number":
      return (
        <InputNumber
          id={field.id}
          name={rhf.name}
          value={has(rhf.value) ? rhf.value : ""}
          onChange={(v) => rhf.onChange(v)}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          min={field.props?.min}
          max={field.props?.max}
          step={field.props?.step ?? 1}
          format={field.props?.format ?? "decimal"}
          placeholder={field.props?.placeholder}
          config={field.config}
          {...inputCommon}
        />
      );

    case "date":
    case "datepicker":
      // Ensure app is wrapped in <LocalizationProvider dateAdapter={AdapterDayjs}>
      return (
        <DatePicker
          rhf={rhf}
          minDate={field.props?.minDate}
          maxDate={field.props?.maxDate}
          format={field.props?.format || "DD/MM/YYYY"}
          config={field.config}
          {...inputCommon}
        />
      );

    case "textarea":
      return (
        <TextArea
          id={field.id}
          name={rhf.name}
          value={rhf.value ?? ""}
          onChange={rhf.onChange}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          rows={field.props?.rows ?? 3}
          maxLength={field.props?.maxLength}
          autoResize={field.props?.autoResize ?? true}
          placeholder={field.props?.placeholder}
          config={field.config}
          {...inputCommon}
        />
      );

    case "email":
    case "password":
    case "tel":
    case "url":
    case "text":
    default:
      return (
        <InputText
          id={field.id}
          name={rhf.name}
          value={rhf.value ?? ""}
          onChange={rhf.onChange}
          onBlur={rhf.onBlur}
          inputRef={rhf.ref}
          type={TYPE_TO_INPUT[field.type] || "text"}
          placeholder={field.props?.placeholder}
          maxLength={field.props?.maxLength}
          prefix={field.props?.prefix}
          suffix={field.props?.suffix}
          config={field.config}
          {...inputCommon}
        />
      );
  }
}
