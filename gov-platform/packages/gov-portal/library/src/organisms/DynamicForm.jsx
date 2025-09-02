// components/form/DynamicForm.jsx
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";

import FormGrid from "../organisms/FormGrid.jsx";
import FieldGroup from "../organisms/FieldGroup.jsx";
import ErrorMessage from "../atoms/ErrorMessage.jsx";
import FieldController from "../components/FieldController.jsx";
import { buildZodFromSchema } from "../adapters/zodFactory.js";
import { saveDraft, setLastSavedAt, setSubmitting } from "@gov/store";
import { useWatchValue } from "../utils/watchValue.js";

const TYPE_DEFAULTS = { checkbox: false, default: "" };

function defaultsFromSchema(schema) {
  const out = {};
  (schema.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      out[f.id] = f.defaultValue ?? (TYPE_DEFAULTS[f.type] ?? TYPE_DEFAULTS.default);
    });
  });
  return out;
}

export default function DynamicForm({
  schema,
  onSubmit,
  defaultValues,
  user,
  flags,
  ui,
  draftKey: draftKeyProp,
  entityId = "local-entity",
}) {
  const dispatch = useDispatch();

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

  const { handleSubmit, formState, reset, control, getValues } = methods;

  const fieldNames = React.useMemo(
    () => (schema.sections || []).flatMap((s) => (s.fields || []).map((f) => f.id)),
    [schema]
  );

  const draftKey = React.useMemo(
    () => draftKeyProp || `${schema.id || "form"}::${entityId}`,
    [draftKeyProp, schema.id, entityId]
  );

  // ✅ Watch using explicit control/getValues (no need for FormProvider yet)
  const watchedValues = useWatchValue({
    names: fieldNames,
    selector: (base) => base,
    defaultValue: formDefaults,
    control,
    getValues,
  });

  React.useEffect(() => {
    if (!watchedValues) return;
    const updatedAt = Date.now();
    dispatch(saveDraft({ key: draftKey, values: watchedValues, updatedAt }));
    dispatch(setLastSavedAt(updatedAt));
    try {
      localStorage.setItem(`draft::${draftKey}`, JSON.stringify({ values: watchedValues, updatedAt }));
    } catch {}
  }, [watchedValues, dispatch, draftKey]);

  const submit = handleSubmit(async (vals) => {
    dispatch(setSubmitting(true));
    try {
      await onSubmit?.(vals);
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
                <FormGrid.Item key={f.id} span={f.grid?.span} rowSpan={f.grid?.rowSpan} area={f.grid?.area}>
                  <FieldController
                    field={f}
                    user={user}
                    flags={flags}
                    wrap
                    wrapperProps={{
                      config: { ...(ui?.fieldWrapper || {}), layout: ui?.fieldLayout ?? "top" },
                    }}
                  />
                </FormGrid.Item>
              ))}
            </FormGrid>
          </FieldGroup>
        ))}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained">{ui?.submitLabel || "Submit"}</Button>
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
