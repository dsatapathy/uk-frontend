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
import InlineCondition from "../form/InlineCondition.jsx";

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

/** ── derive deps & show-expression from f.rules ─────────────────────────── */
const RULE_PATH_RE = /values\.([a-zA-Z0-9_.]+)/g;

function extractRuleDepsFromField(field) {
  const out = new Set();
  (field.rules || []).forEach((r) => {
    if (!r || typeof r.when !== "string") return;
    let m;
    while ((m = RULE_PATH_RE.exec(r.when))) out.add(m[1]); // capture after "values."
  });
  return Array.from(out);
}

function buildShowExpr(field) {
  const hides = (field.rules || []).filter(
    (r) => r.action === "hide" && typeof r.when === "string" && r.when.trim()
  );
  if (!hides.length) return "true";
  const orClauses = hides.map((r) => `(${r.when})`).join(" || ");
  return `!(${orClauses})`;
}

/* -------------------- VISIBILITY AWARE RESOLVER HELPERS ------------------- */
function safeBool(expr, values) {
  if (!expr) return false;
  try {
    // eslint-disable-next-line no-new-func
    return !!new Function("values", `return !!(${expr});`)(values);
  } catch {
    return false;
  }
}
function fieldIsHidden(field, values) {
  const rules = (field.rules || []).filter(
    (r) => r?.action === "hide" && typeof r.when === "string" && r.when.trim()
  );
  if (!rules.length) return false;
  return rules.some((r) => safeBool(r.when, values));
}
function collectHiddenFieldIds(schema, values) {
  const out = new Set();
  (schema?.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      if (fieldIsHidden(f, values)) out.add(f.id);
    });
  });
  return out;
}
// Wrap zodResolver to drop errors/values for hidden fields
function makeVisibilityAwareResolver(zodSchema, formSchema) {
  const base = zodResolver(zodSchema);
  return async (values, context, options) => {
    const res = await base(values, context, options);

    const hidden = collectHiddenFieldIds(formSchema, values);

    // 1) strip errors for hidden fields
    if (res.errors) {
      for (const key of Array.from(hidden)) {
        if (res.errors[key]) delete res.errors[key];
      }
    }

    // 2) OPTIONAL: strip hidden values from the validated result
    //    (If you want drafts to retain hidden field values, comment this out.)
    hidden.forEach((k) => {
      if (k in res.values) delete res.values[k];
    });

    return res;
  };
}

/* ------------------------------- Component ------------------------------- */
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

  const schemaForValidation = validationSchema || schema;
  const schemaForDefaults = defaultsSchema || schemaForValidation;

  const zodSchema = React.useMemo(
    () => buildZodFromSchema(schemaForValidation),
    [schemaForValidation]
  );

  const formKey = formKeyOf(schemaForValidation, entityId);
  const draft = useSelector((s) => s?.drafts?.[formKey]);

  const formDefaults = React.useMemo(() => {
    const base = defaultsFromSchema(schemaForDefaults);
    return { ...base, ...(draft?.values || {}), ...(defaultValues || {}) };
  }, [schemaForDefaults, defaultValues, draft]);

  // ▼▼▼ CHANGED: use visibility-aware resolver
  const resolver = React.useMemo(
    () => (zodSchema ? makeVisibilityAwareResolver(zodSchema, schemaForValidation) : undefined),
    [zodSchema, schemaForValidation]
  );

  const methods = useForm({
    resolver,                         // << was: zodResolver(zodSchema)
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: formDefaults,
  });

  const { handleSubmit, formState, reset, getValues, setValue, trigger, watch } = methods;

  React.useEffect(() => {
    if (draft?.values) reset((prev) => ({ ...prev, ...draft.values }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.updatedAt]);

  React.useEffect(() => {
    dispatch(
      startFormSession({
        formId: schemaForValidation?.id || schema?.id,
        entityId,
        schemaVersion: schemaForValidation?.version || schema?.version || "1.0.0",
      })
    );
    return () => {
      dispatch(endFormSession());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, schemaForValidation?.id, schemaForValidation?.version, entityId]);

  const autosaveTimerRef = React.useRef();
  React.useEffect(() => {
    const sub = watch((vals, meta) => {
      onValuesChange?.(vals, meta);
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = window.setTimeout(() => {
        const updatedAt = Date.now();
        try {
          dispatch(saveDraft({ key: formKey, values: vals, updatedAt }));
          dispatch(setLastSavedAt(updatedAt));
        } catch {
          /* no-op */
        }
      }, autosaveMs);
    });
    return () => {
      window.clearTimeout(autosaveTimerRef.current);
      sub.unsubscribe();
    };
  }, [watch, autosaveMs, dispatch, formKey, onValuesChange]);

  const submit = handleSubmit(async (vals) => {
    dispatch(setSubmitting(true));
    try {
      await onSubmit?.(vals);
      // dispatch(clearDraft(formKey));
    } finally {
      dispatch(setSubmitting(false));
    }
  });

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
              cols={ui?.grid?.cols ? ui?.grid?.cols : { xs: 1, sm: 2, md: 12 }}
              gap={ui?.grid?.gap ?? { xs: "s2", md: "s3" }}
              areas={ui?.grid?.areas?.[sec.id]}
            >
              {(sec.fields || []).map((f) => {
                const whenExpr = buildShowExpr(f);
                const deps = extractRuleDepsFromField(f);
                return (
                  <InlineCondition
                    key={f.id}
                    when={whenExpr}
                    then={{ show: true }}
                    else={{ show: false }}
                    deps={deps}
                    config={{
                      keepMountedWhenHidden: false,
                      collapseHidden: true,
                      allowStringExpr: true,
                    }}
                  >
                    <FormGrid.Item
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
                        mountWhenHidden={false}
                      />
                    </FormGrid.Item>
                  </InlineCondition>
                );
              })}
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
