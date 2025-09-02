// components/form/DynamicForm.jsx
import * as React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";

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
  // clearDraft, // ← uncomment if you want to clear after successful submit
} from "@gov/store";

import { buildZodFromSchema } from "../adapters/zodFactory.js";

/* ---------- helpers ---------- */
const TYPE_DEFAULTS = { checkbox: false, default: "" };

function defaultsFromSchema(schema) {
  const out = {};
  (schema.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      if (f.defaultValue !== undefined) out[f.id] = f.defaultValue;
      else out[f.id] = TYPE_DEFAULTS[f.type] ?? TYPE_DEFAULTS.default;
    });
  });
  return out;
}

/* ---------- DynamicForm ---------- */
/**
 * Props:
 * - schema
 * - onSubmit(values)
 * - defaultValues?
 * - user?, flags?, ui?
 * - entityId?            : string (default "local-entity")
 * - autosaveMs?          : number (default 1000ms)
 */
export default function DynamicForm({
  schema,
  onSubmit,
  defaultValues,
  user,
  flags,
  ui,
  entityId = "local-entity",
  autosaveMs = 1000,
}) {
  const dispatch = useDispatch();

  const zodSchema = React.useMemo(
    () => (typeof buildZodFromSchema === "function" ? buildZodFromSchema(schema) : null),
    [schema]
  );

  const formKey = `${schema.id}::${entityId}`;

  // Pull any existing draft from Redux (shape: { values, updatedAt })
  const draft = useSelector((s) => s?.drafts?.[formKey]);

  const formDefaults = React.useMemo(() => {
    const base = defaultsFromSchema(schema);
    // preload order: explicit defaultValues prop > saved draft > schema defaults
    return { ...base, ...(draft?.values || {}), ...(defaultValues || {}) };
  }, [schema, defaultValues, draft]);

  const methods = useForm({
    resolver: zodSchema ? zodResolver(zodSchema) : undefined,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: formDefaults,
  });

  const { handleSubmit, formState, reset, control } = methods;

  // If a draft arrives later (e.g., async store load), reset once
  React.useEffect(() => {
    if (draft?.values) reset((prev) => ({ ...prev, ...draft.values }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.updatedAt]);

  // Start / end session
  React.useEffect(() => {
    dispatch(
      startFormSession({
        formId: schema.id,
        entityId,
        schemaVersion: schema.version || "1.0.0",
      })
    );
    return () => {
      dispatch(endFormSession());
    };
  }, [dispatch, schema.id, schema.version, entityId]);

  // Watch all form values for autosave
  const values = useWatch({ control });
  const autosaveTimerRef = React.useRef();

  React.useEffect(() => {
    // debounce
    window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      const updatedAt = Date.now();
      dispatch(saveDraft({ key: formKey, values, updatedAt }));
      dispatch(setLastSavedAt(updatedAt));
      // (optional) mirror to localStorage if you want cross-tab persistence
      // localStorage.setItem(formKey, JSON.stringify({ values, updatedAt }));
    }, autosaveMs);

    return () => window.clearTimeout(autosaveTimerRef.current);
  }, [values, autosaveMs, dispatch, formKey]);

  // Submit handler
  const submit = handleSubmit(async (vals) => {
    dispatch(setSubmitting(true));
    try {
      await onSubmit?.(vals);
      // Optionally clear draft on success:
      // dispatch(clearDraft(formKey));
    } finally {
      dispatch(setSubmitting(false));
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={submit} noValidate sx={{ p: ui?.padding ?? 0 }}>
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

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained">
            {ui?.submitLabel || "Submit"}
          </Button>
          {ui?.showReset !== false && (
            <Button type="button" variant="outlined" onClick={() => reset(formDefaults)}>
              {ui?.resetLabel || "Reset"}
            </Button>
          )}
        </Box>

        {formState.errors?.root?.message && (
          <Box sx={{ mt: 2 }}>
            <ErrorMessage id="form-root-error" message={formState.errors.root.message} />
          </Box>
        )}
      </Box>
    </FormProvider>
  );
}
