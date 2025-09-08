import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import DSBox from "../atoms/DSBox.jsx";
import AppButton from "../atoms/AppButton.jsx";
import FormGrid from "../organisms/FormGrid.jsx";
import FieldGroup from "../organisms/FieldGroup.jsx";
import ErrorMessage from "../atoms/ErrorMessage.jsx";
import FieldController from "../components/FieldController.jsx";

import {
  startFormSession,
  setSubmitting,
  setLastSavedAt,
  endFormSession,
  saveDraft,
  // clearDraft,
} from "@gov/store";

import { buildZodFromSchema } from "../rules/ValidationFactory.js";


/* -------------------------------- helpers -------------------------------- */
const TYPE_DEFAULTS = { checkbox: false, default: "" };

function defaultsFromSchema(schema) {
  const out = {};
  (schema?.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      if (f.defaultValue !== undefined) out[f.id] = f.defaultValue;
      else out[f.id] = TYPE_DEFAULTS[f.type] ?? TYPE_DEFAULTS.default;
    });
  });
  return out;
}

/** build a stable key for drafts */
function formKeyOf(schema, entityId) {
  return `${schema?.id || "form"}::${entityId || "local-entity"}`;
}

/* ------------------------------- Component ------------------------------- */
/**
 * DynamicForm (optimized for use with a stepper)
 * -------------------------------------------------------------------------
 * Props:
 * - schema:          JSON schema for the VISIBLE part (current step)
 * - validationSchema?: JSON schema for validation (defaults to `schema`).
 *                      Pass the FULL schema when using stepper so Submit can validate all fields.
 * - defaultsSchema?: JSON schema used to compute default values (defaults to `validationSchema`).
 * - onSubmit(values)
 * - defaultValues?
 * - user?, flags?, ui?
 * - entityId?            : string (default "local-entity")
 * - autosaveMs?          : number (default 1000ms)
 * - hideDefaultActions?  : boolean (when true, hides the built-in submit/reset row)
 * - formApiRef?          : ref exposing { getValues, setValue, trigger, reset, getErrors }
 * - onValuesChange?      : (values, meta) => void (meta: { name, type })
 */
export default function DynamicForm({
  schema,
  validationSchema,
  defaultsSchema,
  onSubmit,
  defaultValues,
  user,
  flags,
  ui,
  entityId = "local-entity",
  autosaveMs = 1000,
  hideDefaultActions = false,
  formApiRef,
  onValuesChange,
}) {
  const dispatch = useDispatch();

  // pick schemas for validation + defaults
  const schemaForValidation = validationSchema || schema;
  const schemaForDefaults = defaultsSchema || schemaForValidation;

  // Build Zod ONCE per validation schema (can be full schema for stepper)
  const zodSchema = React.useMemo(() => buildZodFromSchema(schemaForValidation), [schemaForValidation]);

  // Draft key should be stable to the full form identity, not the visible slice
  const formKey = formKeyOf(schemaForValidation, entityId);

  // Pull any existing draft from Redux (shape: { values, updatedAt })
  const draft = useSelector((s) => s?.drafts?.[formKey]);

  // Defaults: explicit defaultValues > saved draft > defaults from FULL schema
  const formDefaults = React.useMemo(() => {
    const base = defaultsFromSchema(schemaForDefaults);
    return { ...base, ...(draft?.values || {}), ...(defaultValues || {}) };
  }, [schemaForDefaults, defaultValues, draft]);

  // React Hook Form setup
  const methods = useForm({
    resolver: zodSchema ? zodResolver(zodSchema) : undefined,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: formDefaults,
  });

  const { handleSubmit, formState, reset, getValues, setValue, trigger, watch } = methods;

  // If a draft arrives later (e.g., async load), merge once
  React.useEffect(() => {
    if (draft?.values) reset((prev) => ({ ...prev, ...draft.values }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.updatedAt]);

  // Start / end session
  React.useEffect(() => {
    dispatch(
      startFormSession({
        formId: schemaForValidation?.id || schema?.id,
        entityId,
        schemaVersion: schemaForValidation?.version || schema?.version || "1.0.0",
      })
    );
    return () => { dispatch(endFormSession()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, schemaForValidation?.id, schemaForValidation?.version, entityId]);

  // Efficient autosave via RHF subscription (avoids re-render per keystroke)
  const autosaveTimerRef = React.useRef();
  React.useEffect(() => {
    const sub = watch((vals, meta) => {
      // upcall if needed
      onValuesChange?.(vals, meta);
      // debounce autosave
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = window.setTimeout(() => {
        const updatedAt = Date.now();
        try {
          dispatch(saveDraft({ key: formKey, values: vals, updatedAt }));
          dispatch(setLastSavedAt(updatedAt));
          // Optional localStorage mirror
          // localStorage.setItem(formKey, JSON.stringify({ values: vals, updatedAt }));
        } catch (e) {
          // no-op
        }
      }, autosaveMs);
    });
    return () => {
      window.clearTimeout(autosaveTimerRef.current);
      sub.unsubscribe();
    };
  }, [watch, autosaveMs, dispatch, formKey, onValuesChange]);

  // Submit handler
  const submit = handleSubmit(async (vals) => {
    dispatch(setSubmitting(true));
    try {
      await onSubmit?.(vals);
      // dispatch(clearDraft(formKey));
    } finally {
      dispatch(setSubmitting(false));
    }
  });

  // Expose safe API to parent (stepper)
  React.useImperativeHandle(
    formApiRef,
    () => ({
      getValues: () => getValues(),
      setValue: (p, v, opts) => setValue(p, v, opts),
      trigger: (names, opts) => trigger(names, opts),
      reset: (vals) => reset(vals),
      getErrors: () => formState.errors,
    }),
    [getValues, setValue, trigger, reset, formState.errors]
  );

  return (
    <FormProvider {...methods}>
      <DSBox component="form" onSubmit={submit} noValidate sx={{ p: ui?.padding ?? 0 }}>
        {(schema?.sections || []).map((sec) => (
          <FieldGroup
            key={sec.id}
            id={sec.id}
            title={sec.title}
            description={sec.description}
            collapsible={ui?.sections?.collapsible ?? false}
            defaultOpen={ui?.sections?.defaultOpen ?? true}
            config={ui?.sectionCard}
          >
            <FormGrid
              cols={ui?.grid?.cols ?? { xs: 1, sm: 2 }}
              gap={ui?.grid?.gap ?? { xs: "s2", md: "s3" }}
              areas={ui?.grid?.areas?.[sec.id]}
            >
              {(sec.fields || []).map((f) => (
                <FormGrid.Item
                  key={f.id}
                  span={f.grid?.span}
                  rowSpan={f.grid?.rowSpan}
                  area={f.grid?.area}
                >
                  <FieldController
                    field={f}
                    user={user}
                    flags={flags}
                    wrap
                    wrapperProps={{
                      layout: ui?.fieldLayout ?? "top",
                      config: ui?.fieldWrapper,
                    }}
                  />
                </FormGrid.Item>
              ))}
            </FormGrid>
          </FieldGroup>
        ))}

        {!hideDefaultActions && (
          <DSBox sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            <AppButton type="submit" variant="contained">
              {ui?.submitLabel || "Submit"}
            </AppButton>
            {ui?.showReset !== false && (
              <AppButton type="button" variant="outlined" onClick={() => reset(formDefaults)}>
                {ui?.resetLabel || "Reset"}
              </AppButton>
            )}
          </DSBox>
        )}

        {formState.errors?.root?.message && (
          <DSBox sx={{ mt: 2 }}>
            <ErrorMessage id="form-root-error" message={formState.errors.root.message} />
          </DSBox>
        )}
      </DSBox>
    </FormProvider>
  );
}
