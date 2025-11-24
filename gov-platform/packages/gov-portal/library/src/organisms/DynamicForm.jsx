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
import { borderRadius } from "@mui/system";

/* -------------------------------- helpers -------------------------------- */
const TYPE_DEFAULTS = { checkbox: false, default: "" };

function fileToDescriptor(f) {
  if (!(f instanceof File)) return f; // allow server objects
  const { name, size, type, lastModified } = f;
  return { __fileDraft__: true, name, size, type, lastModified };
}

function makeDraftSerializable(schema, flatValues) {
  const out = { ...flatValues };
  (schema?.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((fld) => {
      if (fld.type === "file" || fld.type === "upload") {
        const v = out[fld.id];
        if (Array.isArray(v)) out[fld.id] = v.map(fileToDescriptor);
        else out[fld.id] = fileToDescriptor(v);
      }
    });
  });
  return out;
}

// --- helpers to support section-grouped defaults ----------------------------
function getDeep(root, path) {
  return String(path || "")
    .split(".")
    .reduce((a, k) => (a == null ? a : a[k]), root);
}

/** Looks like { [sectionId or section.output.key]: { ...fields } } ? */
function looksSectioned(schema, obj) {
  if (!obj || typeof obj !== "object") return false;
  const secKeys = new Set(
    (schema?.sections || []).map((s) => (s.output?.key ? s.output.key : s.id))
  );
  return Object.keys(obj).some((k) => secKeys.has(k));
}

/**
 * Flatten section-grouped input into RHF flat { [fieldId]: value } shape.
 * - Reads direct values: sectionValues[fieldId]
 * - If field has output.path, also tries reading relative to the section group,
 *   and (fallback) absolute from the full sectioned object.
 */
function flattenFromSectioned(schema, sectioned) {
  const out = {};
  for (const sec of schema?.sections || []) {
    const secKey = sec.output?.key || sec.id;
    const group = sectioned?.[secKey];
    if (!group || typeof group !== "object") continue;

    for (const f of sec.fields || []) {
      // 1) direct: { [secKey]: { [fieldId]: value } }
      if (Object.prototype.hasOwnProperty.call(group, f.id)) {
        out[f.id] = group[f.id];
        continue;
      }

      // 2) custom path support (relative to section OR absolute)
      const fo = f.output || {};
      if (fo.path) {
        const p = String(fo.path);
        // relative path if it starts with `${secKey}.`
        const rel = p.startsWith(secKey + ".") ? p.slice(secKey.length + 1) : p;
        const valRel = getDeep(group, rel);
        if (valRel !== undefined) {
          out[f.id] = valRel;
          continue;
        }
        // absolute fallback from entire "sectioned" object
        const valAbs = getDeep(sectioned, p);
        if (valAbs !== undefined) {
          out[f.id] = valAbs;
          continue;
        }
      }
    }
  }
  return out;
}

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
    // Clean empty date strings so zod preprocessors see undefined instead of ""
    const cleaned = { ...values };
    try {
      const dateFieldIds = (formSchema?.sections || [])
        .flatMap((s) => (s.fields || []))
        .filter((f) => {
          const t = String(f.type || "").toLowerCase();
          return t === "date" || t === "datepicker" || t === "autocomplete";
        })
        .map((f) => f.id);
      if (dateFieldIds.length) {
        dateFieldIds.forEach((id) => {
          if (cleaned[id] === "") cleaned[id] = undefined;
        });
        // eslint-disable-next-line no-console
        // console.debug("DynamicForm.cleanDates", { dateFieldIds, before: values, after: cleaned });
      }
    } catch (e) {}

    const res = await base(cleaned, context, options);
    const hidden = collectHiddenFieldIds(formSchema, cleaned);

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
    let merged = { ...base };
    // Draft (usually flat), but allow sectioned just in case
    if (draft?.values) {
      merged = looksSectioned(schemaForDefaults, draft.values)
        ? { ...merged, ...flattenFromSectioned(schemaForDefaults, draft.values) }
        : { ...merged, ...draft.values };
    }
    // Caller-provided defaults can be flat OR sectioned
    if (defaultValues) {
      merged = looksSectioned(schemaForDefaults, defaultValues)
        ? { ...merged, ...flattenFromSectioned(schemaForDefaults, defaultValues) }
        : { ...merged, ...defaultValues };
    }
    return merged;
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
  const didHydrateFromDraft = React.useRef(false);
  React.useEffect(() => {
    // hydrate once on mount (or when switching entityId/schema)
    if (!didHydrateFromDraft.current && draft?.values) {
      reset((prev) => ({ ...prev, ...draft.values }), { keepDirty: true });
      didHydrateFromDraft.current = true;
    }
  }, [draft?.values, reset]);

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
          const live = getValues(); // still contains real File objects
          const serializable = makeDraftSerializable(schemaForValidation, live);
          dispatch(saveDraft({ key: formKey, values: serializable, updatedAt }));
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
    // dispatch(setSubmitting(true));
    // try {
    //   // still useful when the form is used without the stepper
    //   const payload =
    //     output === "schema"
    //       ? mapUsingSchemaOutput(schemaForValidation, vals)
    //       : output === "bySection"
    //         ? mapUsingSchemaOutput({ sections: (schemaForValidation?.sections || []).map(s => ({ ...s, output: { key: s.id, type: "object" } })) }, vals)
    //         : vals;
    //   await onSubmit?.(payload);
    //   // dispatch(clearDraft(formKey));
    // } finally {
    //   dispatch(setSubmitting(false));
    // }
    dispatch(setSubmitting(true));
    try {
      // Sometimes the vals argument can be an empty object while RHF internally
      // holds the real values. Use getValues() as a fallback so callers always
      // receive the live form values.
      const live = vals && Object.keys(vals).length ? vals : getValues();

      const payload =
        output === "schema"
          ? mapUsingSchemaOutput(schemaForValidation, live)
          : output === "bySection"
            ? mapUsingSchemaOutput({ sections: (schemaForValidation?.sections || []).map(s => ({ ...s, output: { key: s.id, type: "object" } })) }, live)
            : live;
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
      reset: (vals) =>
        reset(
          looksSectioned(schemaForValidation, vals)
            ? flattenFromSectioned(schemaForValidation, vals)
            : vals
        ),
      getErrors: () => formState.errors,
      /**
 * Merge a bunch of values into the form in one shot (flat or sectioned).
 * Keeps existing user edits unless you overwrite a key.
 */
      patch: (vals, opts = { shouldValidate: false, shouldDirty: false }) => {
        const incoming = looksSectioned(schemaForValidation, vals)
          ? flattenFromSectioned(schemaForValidation, vals)
          : vals;
        const merged = { ...getValues(), ...incoming };
        // reset in one go ⇒ your watch(meta?.name) sees no single-field change,
        // so dependent auto-resets won't fight your bulk patch.
        reset(merged, { keepDirty: opts.shouldDirty });
        if (opts.shouldValidate) {
          // validate only touched fields or all, your call:
          trigger(undefined, { shouldFocus: false });
        }
      },
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

        {/* sticky footer actions (matches the stepper look/behavior) */}
        {!hideDefaultActions && (ui?.stickyActions ?? true) && (
          <DSBox
            sx={{
              position: "sticky",
              bottom: { xs: "-15px", sm: "40px" },
              borderRadius: 0,
              borderTop: (t) => `1px solid ${t.palette.divider}`,
              background: (t) => t.palette.background.paper,
              px: { xs: 2, md: 3 },
              py: 2,
              zIndex: 1,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <AppButton type="submit" variant="contained">
              {ui?.submitLabel || "Submit"}
            </AppButton>
            {ui?.showReset !== false && (
              <AppButton
                type="button"
                variant="outlined"
                onClick={() => reset(formDefaults)}
              >
                {ui?.resetLabel || "Reset"}
              </AppButton>
            )}
          </DSBox>
        )}

        {/* legacy non-sticky fallback if you really want it */}
        {!hideDefaultActions && (ui?.stickyActions === false) && (
          <DSBox sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
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
