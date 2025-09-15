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

function buildEffectExpr(field, action) {
  const exprs = (field.rules || [])
    .filter((r) => r.action === action && typeof r.when === "string" && r.when.trim())
    .map((r) => `(${r.when})`);
  return exprs.length ? exprs.join(" || ") : "false";
}

const isNil = (v) => v === undefined || v === null || v === "";
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
function passWhen(expr, values) {
  if (!expr) return true;
  try { return !!new Function("values", `return !!(${expr});`)(values); } catch { return true; }
}
function applyTransform(v, t) {
  if (!t) return v;
  if (t === "int") return v === "" ? null : parseInt(v, 10);
  if (t === "float") return v === "" ? null : parseFloat(v);
  if (t === "bool") return !!v;
  return v;
}
function mapUsingSchemaOutput(schema, flatValues) {
  const out = {};
  for (const sec of schema?.sections || []) {
    const so = sec.output || {};
    const secKey = so.key || sec.id;
    const isArray = so.type === "array";
    let bucket = isArray ? [] : {};
    for (const f of sec.fields || []) {
      const fo = f.output || {};
      if (fo.drop) continue;
      if (fo.when && !passWhen(fo.when, flatValues)) continue;
      const raw = flatValues[f.id];
      if (isNil(raw)) continue;
      const val = applyTransform(raw, fo.transform);
      const isUpload = f.type === "upload" || f.type === "file";
      const shouldCollect = fo.collect || (so.collect === "uploads" && isUpload) || fo.path === "[]";
      if (isArray && shouldCollect) {
        bucket.push(fo.itemShape === "pair" ? { id: f.id, value: val } : { id: f.id, value: val });
      } else {
        const path = fo.path || `${secKey}.${f.id}`;
        if (path.includes(".")) setDeep(out, path, val);
        else {
          if (isArray) bucket.push({ [path]: val });
          else bucket[path] = val;
        }
      }
    }
    if (isArray ? bucket.length : Object.keys(bucket).length) {
      if (!isArray) out[secKey] = { ...(out[secKey] || {}), ...bucket };
      else out[secKey] = bucket;
    }
  }
  return out;
}

// map fieldId -> default value (from schema or type)
function buildDefaultMap(schema) {
  const out = {};
  (schema?.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      out[f.id] = f.defaultValue !== undefined
        ? f.defaultValue
        : (TYPE_DEFAULTS[f.type] ?? TYPE_DEFAULTS.default);
    });
  });
  return out;
}

// collect explicit (options.dependsOn) and implicit (rules: values.*) deps
function buildDependencyGraph(schema) {
  const childrenOf = new Map(); // parentId -> Set(childIds)
  const ensure = (k) => { if (!childrenOf.has(k)) childrenOf.set(k, new Set()); return childrenOf.get(k); };
  (schema?.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      const explicit = (f.options?.dependsOn || [])
        .filter((d) => d.startsWith("values."))
        .map((d) => d.slice(7)); // "values.district" -> "district"
      const implicit = extractRuleDepsFromField(f); // from rule.when strings you already parse
      const allParents = new Set([...explicit, ...implicit]);
      allParents.forEach((p) => ensure(p).add(f.id));
    });
  });
  return childrenOf;
}

function flattenDependents(childrenOf, startIds) {
  const out = new Set();
  const visit = (id) => {
    const kids = childrenOf.get(id);
    if (!kids) return;
    kids.forEach((k) => {
      if (out.has(k)) return;
      out.add(k);
      visit(k);
    });
  };
  startIds.forEach(visit);
  return Array.from(out);
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
  output = "flat", // "flat" | "bySection" | "schema"
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
    reValidateMode: "onSubmit",
    defaultValues: formDefaults,
    shouldUnregister: false,
  });

  const { handleSubmit, formState, reset, getValues, setValue, trigger, watch, clearErrors } = methods;
  // ── defaults & dependency graph ──────────────────────────────────────────
  const defaultMap = React.useMemo(() => buildDefaultMap(schemaForValidation), [schemaForValidation]);
  const depGraph = React.useMemo(() => buildDependencyGraph(schemaForValidation), [schemaForValidation]);

  // Keep previous snapshots to detect changes / newly-hidden fields
  const prevHiddenRef = React.useRef(new Set());
  const prevValuesRef = React.useRef(getValues());
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
      let didBulkReset = false;
      // 1) If a single field changed, reset all of its dependents (recursive)
      const changed = meta?.name ? [meta.name] : [];
      if (changed.length) {
        const toReset = flattenDependents(depGraph, changed);
        toReset.forEach((fid) => {
          if (fid in vals) {
            if (vals[fid] !== defaultMap[fid]) {
              didBulkReset = true;
              setValue(fid, defaultMap[fid], { shouldValidate: false, shouldDirty: false });
            }
            clearErrors(fid);
            // NOTE: do NOT unregister; keep field mounted so UI updates gracefully
          }
        });
      }

      // 2) If some fields became hidden due to rules, reset them
      const hiddenNow = collectHiddenFieldIds(schemaForValidation, vals); // you already have this
      // compute newly hidden = now - prev
      const prevHidden = prevHiddenRef.current;
      hiddenNow.forEach((fid) => {
        if (!prevHidden.has(fid) && fid in vals) {
          if (vals[fid] !== defaultMap[fid]) {
            didBulkReset = true;
            setValue(fid, defaultMap[fid], { shouldValidate: false, shouldDirty: false });
          }
          clearErrors(fid);
        }
      });
      prevHiddenRef.current = hiddenNow;
      prevValuesRef.current = vals;

      onValuesChange?.(vals, meta);
      // If we were bulk-resetting, let RHF settle, then schedule one autosave.
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = window.setTimeout(() => {
        const updatedAt = Date.now();
        try {
          dispatch(saveDraft({ key: formKey, values: getValues(), updatedAt }));
          dispatch(setLastSavedAt(updatedAt));
        } catch { }
      }, didBulkReset ? Math.max(autosaveMs, 600) : autosaveMs);
    });
    return () => {
      window.clearTimeout(autosaveTimerRef.current);
      sub.unsubscribe();
    };
  }, [watch, autosaveMs, dispatch, formKey, onValuesChange, depGraph, defaultMap, schemaForValidation, setValue, clearErrors]);

  const submit = handleSubmit(async (vals) => {
    dispatch(setSubmitting(true));
    try {
      // still useful when the form is used without the stepper
      const payload =
        output === "schema"
          ? mapUsingSchemaOutput(schemaForValidation, vals)
          : output === "bySection"
            ? mapUsingSchemaOutput({ sections: (schemaForValidation?.sections || []).map(s => ({ ...s, output: { key: s.id, type: "object" } })) }, vals)
            : vals;
      await onSubmit?.(payload);
      // dispatch(clearDraft(formKey));
    } finally {
      dispatch(setSubmitting(false));
    }
  });

  React.useImperativeHandle(
    formApiRef,
    () => ({
      getValues: () => getValues(),
      // Let parent format however it wants without firing a submit
      buildPayload: (vals) => {
        const v = vals ?? getValues();
        if (output === "schema") return mapUsingSchemaOutput(schemaForValidation, v);
        if (output === "bySection") {
          const shaped = { sections: (schemaForValidation?.sections || []).map(s => ({ ...s, output: { key: s.id, type: "object" } })) };
          return mapUsingSchemaOutput(shaped, v);
        }
        return v; // "flat"
      },
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
        {(schema?.sections || []).map((sec) => {
          const secShowExpr = buildShowExpr(sec);
          const secDisableExpr = buildEffectExpr(sec, "disable");
          const secDeps = extractRuleDepsFromField(sec);

          return (
            <InlineCondition
              key={sec.id}
              when={secShowExpr}
              then={{ show: true }}
              else={{ show: false }}
              deps={secDeps}
              config={{ keepMountedWhenHidden: false, collapseHidden: true, allowStringExpr: true }}
            >
              <InlineCondition
                when={secDisableExpr}
                then={{ disable: true, className: "sectionDisabled" }}
                else={{}}
                deps={secDeps}
                config={{ allowStringExpr: true }}
              >
                <FieldGroup
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
                    columnGap={{ xs: 1, md: 4 }}
                    rowGap={{ xs: 1, md: 2 }}
                  >
                    {(sec.fields || []).map((f) => {
                      const fieldShowExpr = buildShowExpr(f);
                      const fieldDeps = extractRuleDepsFromField(f);
                      return (
                        <InlineCondition
                          key={f.id}
                          span={f.grid?.span}
                          when={fieldShowExpr}
                          then={{ show: true }}
                          else={{ show: false }}
                          deps={fieldDeps}
                          config={{ keepMountedWhenHidden: false, collapseHidden: true, allowStringExpr: true }}
                        >
                          {/* <FormGrid.Item span={f.grid?.span} rowSpan={f.grid?.rowSpan} area={f.grid?.area}> */}
                            <FieldController
                              field={f}
                              user={user}
                              flags={flags}
                              wrap
                              wrapperProps={{ layout: ui?.fieldLayout ?? "top", config: ui?.fieldWrapper }}
                              mountWhenHidden={false}
                            />
                          {/* </FormGrid.Item> */}
                        </InlineCondition>
                      );
                    })}
                  </FormGrid>
                </FieldGroup>
              </InlineCondition>
            </InlineCondition>
          );
        })}

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
