import * as React from "react";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// Layout & wrappers
import FormGrid from "./organisms/FormGrid.jsx";
import FieldGroup from "./organisms/FieldGroup.jsx";
import FieldWrapper from "../atoms/FieldWrapper.jsx";
import InlineCondition from "./utilities/InlineCondition.jsx";
import ErrorMessage from "../atoms/ErrorMessage.jsx";

// Field atoms/molecules
import InputText from "../atoms/InputText.jsx";
import InputNumber from "../atoms/InputNumber.jsx";
import TextArea from "../atoms/TextArea.jsx";
import Checkbox from "../atoms/Checkbox.jsx";
import RadioGroup from "../atoms/RadioGroup.jsx";
import AsyncAutocomplete from "../molecules/AsyncAutocomplete.jsx";
import DatePicker from "../atoms/DatePicker.jsx";

// Optional: your existing zod builder (if not available, pass no resolver)
import { buildZodFromSchema } from "../adapters/zodFactory.js";

/** ---------- small helpers ---------- */
const TYPE_TO_INPUT = {
  text: "text",
  password: "password",
  email: "email",
  tel: "tel",
  url: "text",
};

function defaultsFromSchema(schema) {
  const out = {};
  (schema.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      if (f.defaultValue !== undefined) out[f.id] = f.defaultValue;
      else if (f.type === "checkbox") out[f.id] = false;
      else out[f.id] = "";
    });
  });
  return out;
}

function pickDeps(depList = [], values, user) {
  const out = {};
  depList.forEach((d) => {
    if (d.startsWith("values.")) {
      const key = d.replace("values.", "");
      const param = key.split(".").pop();
      out[param] = key.split(".").reduce((a, k) => (a ? a[k] : undefined), values);
    } else if (d.startsWith("user.")) {
      const key = d.replace("user.", "");
      const param = key.split(".").pop();
      out[param] = key.split(".").reduce((a, k) => (a ? a[k] : undefined), user);
    }
  });
  return out;
}

// Basic rules evaluator: supports actions disable/hide/require + derive
function evaluateRules(field, { values }) {
  const res = { hidden: false, disabled: false, required: false, derived: undefined };

  (field.rules || []).forEach((r) => {
    const ok = safeEval(r.when, values);
    if (!ok) return;
    switch (r.action) {
      case "hide":      res.hidden = true; break;
      case "disable":   res.disabled = true; break;
      case "require":   res.required = true; break;
      case "derive":    res.derived = safeEvalExpr(r.value, values); break;
      default: break;
    }
  });

  return res;
}

// very small unsafe-ish expression evaluator (trusted schemas only)
function safeEval(expr, values) {
  if (!expr) return false;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("values", `return !!(${expr});`);
    return !!fn(values);
  } catch {
    return false;
  }
}
function safeEvalExpr(expr, values) {
  if (!expr) return undefined;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("values", `return (${expr});`);
    return fn(values);
  } catch {
    return undefined;
  }
}

/** ---------- DynamicForm ---------- */
/**
 * Props:
 * - schema          : JSON schema (sections[].fields[] as in your BPA)
 * - onSubmit(values): async fn
 * - defaultValues   : optional overrides for initial values
 * - user, flags     : optional context for conditions (if you wire them later)
 * - ui              : optional UI config (grid defaults, buttons, etc.)
 */
export default function DynamicForm({
  schema,
  onSubmit,
  defaultValues,
  user,
  flags,
  ui,
}) {
  const zodSchema = React.useMemo(
    () => (typeof buildZodFromSchema === "function" ? buildZodFromSchema(schema) : null),
    [schema]
  );

  const formDefaults = React.useMemo(
    () => ({ ...defaultsFromSchema(schema), ...(defaultValues || {}) }),
    [schema, defaultValues]
  );

  const methods = useForm({
    resolver: zodSchema ? zodResolver(zodSchema) : undefined,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: formDefaults,
  });

  const { handleSubmit, control, setValue, formState } = methods;
  const values = useWatch({ control }); // for rules/derive

  // Submit
  const submit = handleSubmit(async (vals) => {
    await onSubmit?.(vals);
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={submit} noValidate sx={{ p: ui?.padding ?? 0 }}>
        {/* Render Sections */}
        {(schema.sections || []).map((sec) => (
          <FieldGroup
            key={sec.id}
            id={sec.id}
            title={sec.title}
            description={sec.description}
            collapsible={ui?.sections?.collapsible ?? false}
            defaultOpen={ui?.sections?.defaultOpen ?? true}
            config={ui?.sectionCard}
          >
            {/* Use FormGrid for section layout */}
            <FormGrid
              cols={ui?.grid?.cols ?? { xs: 1, sm: 2 }}
              gap={ui?.grid?.gap ?? { xs: "s2", md: "s3" }}
              areas={ui?.grid?.areas?.[sec.id]}
            >
              {(sec.fields || []).map((f) => {
                // evaluate rules each render (fast enough; values is memoized by RHF)
                const ruleState = evaluateRules(f, { values, user, flags });

                // apply derive when present
                React.useEffect(() => {
                  if (ruleState.derived !== undefined) {
                    setValue(f.id, ruleState.derived, { shouldValidate: true, shouldDirty: true });
                  }
                }, [ruleState.derived]); // eslint-disable-line react-hooks/exhaustive-deps

                // RHF controller per field
                return (
                  <FormGrid.Item
                    key={f.id}
                    span={f.grid?.span}
                    rowSpan={f.grid?.rowSpan}
                    area={f.grid?.area}
                  >
                    <Controller
                      name={f.id}
                      defaultValue={
                        f.defaultValue !== undefined
                          ? f.defaultValue
                          : f.type === "checkbox"
                          ? false
                          : ""
                      }
                      render={({ field: rhf, fieldState }) => {
                        // Common props for wrappers/atoms
                        const common = {
                          disabled: !!ruleState.disabled || f.props?.disabled,
                          hidden: !!ruleState.hidden || f.props?.hidden,
                          required:
                            !!ruleState.required ||
                            (f.validations || []).some((v) => v.type === "required"),
                          error: fieldState.error,
                        };

                        // Build depends context for async options
                        const ctxDeps = pickDeps(
                          f?.options?.dependsOn || [],
                          values,
                          user
                        );

                        return (
                          <FieldWrapper
                            label={f.label}
                            required={common.required}
                            error={common.error}
                            helper={f.helperText}
                            layout={ui?.fieldLayout ?? "top"}
                            config={ui?.fieldWrapper}
                          >
                            {renderField(f, {
                              rhf,
                              common,
                              ctxDeps,
                            })}
                          </FieldWrapper>
                        );
                      }}
                    />
                  </FormGrid.Item>
                );
              })}
            </FormGrid>
          </FieldGroup>
        ))}

        {/* Submit Row */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained">
            {ui?.submitLabel || "Submit"}
          </Button>
          {ui?.showReset !== false ? (
            <Button
              type="button"
              variant="outlined"
              onClick={() => methods.reset(formDefaults)}
            >
              {ui?.resetLabel || "Reset"}
            </Button>
          ) : null}
        </Box>

        {/* global form errors (if any) */}
        {formState.errors?.root?.message ? (
          <Box sx={{ mt: 2 }}>
            <ErrorMessage id="form-root-error" message={formState.errors.root.message} />
          </Box>
        ) : null}
      </Box>
    </FormProvider>
  );
}

/** ---------- field renderer (switch) ---------- */
function renderField(field, { rhf, common, ctxDeps }) {
  if (common.hidden) {
    // still mounted for state/validation unless you want to unmount
    return null;
  }

  switch (field.type) {
    case "checkbox":
      return (
        <Checkbox
          rhf={rhf}
          label={field.inlineLabel}
          indeterminate={field.props?.indeterminate}
          {...common}
        />
      );

    case "radio":
    case "radio-group":
      return (
        <RadioGroup
          rhf={rhf}
          options={field.options?.items || []}
          optionLabelKey={field.options?.labelKey || "label"}
          optionValueKey={field.options?.valueKey || "value"}
          row={field.props?.row ?? false}
          {...common}
        />
      );

    case "textarea":
      return (
        <TextArea
          rhf={rhf}
          rows={field.props?.rows ?? 3}
          maxLength={field.props?.maxLength}
          autoResize={field.props?.autoResize ?? true}
          placeholder={field.props?.placeholder}
          config={field.config}
          {...common}
        />
      );

    case "number":
      return (
        <InputNumber
          rhf={rhf}
          id={field.id}
          min={field.props?.min}
          max={field.props?.max}
          step={field.props?.step ?? 1}
          format={field.props?.format ?? "decimal"}
          placeholder={field.props?.placeholder}
          config={field.config}
          {...common}
        />
      );

    case "date":
    case "datepicker":
      // NOTE: Make sure app is wrapped in <LocalizationProvider dateAdapter={AdapterDayjs}>
      return (
        <DatePicker
          rhf={rhf}
          minDate={field.props?.minDate}
          maxDate={field.props?.maxDate}
          format={field.props?.format || "DD/MM/YYYY"}
          config={field.config}
          {...common}
        />
      );

    case "autocomplete":
      return (
        <AsyncAutocomplete
          field={field}
          rhf={rhf}
          contextDeps={ctxDeps}
          {...common}
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
          error={!!common.error}
          disabled={common.disabled}
          readOnly={field.props?.readOnly}
        />
      );
  }
}
