// ConfigStepperMUI.jsx — fully modular, config-driven stepper for DynamicForm (React 17, MUI v5)
import * as React from "react";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DSBox from "../atoms/DSBox";
import TypographyX from "../atoms/TypographyX";
import AppButton from "../atoms/AppButton";

// ----------------------------- small utils ---------------------------------
const byId = (xs = []) => Object.fromEntries(xs.map((x) => [x.id, x]));
const uniq = (arr) => Array.from(new Set(arr));

function pickSections(schema, sectionIds = []) {
  const idset = new Set(sectionIds);
  const all = schema.sections || [];
  const picked = all.filter((s) => idset.has(s.id));
  return { ...schema, sections: picked };
}

function pickFieldsFromOneSection(section, fieldIds = []) {
  const idset = new Set(fieldIds);
  return { ...section, fields: (section.fields || []).filter((f) => idset.has(f.id)) };
}

function buildSchemaForStep(fullSchema, step) {
  // step can specify either sections:[ids] or a single section  fieldIds
  if (step.sections && step.sections.length) return pickSections(fullSchema, step.sections);
  if (step.section && step.fieldIds) {
    const section = (fullSchema.sections || []).find((s) => s.id === step.section);
    if (!section) return { ...fullSchema, sections: [] };
    const one = pickFieldsFromOneSection(section, step.fieldIds);
    return { ...fullSchema, sections: [one] };
  }
  // default: show nothing
  return { ...fullSchema, sections: [] };
}

function fieldsForStep(fullSchema, step) {
  if (step.fieldIds?.length) return step.fieldIds;
  const sections = buildSchemaForStep(fullSchema, step).sections || [];
  return sections.flatMap((s) => (s.fields || []).map((f) => f.id));
}

// Evaluate show/disable conditions (boolean or function)
function evalCond(cond, ctx) {
  if (cond == null) return true;
  if (typeof cond === "boolean") return cond;
  if (typeof cond === "function") return !!cond(ctx);
  return true;
}

// ----------------------------- main component ------------------------------
export default function ConfigStepperMUI({
  schema,
  DynamicForm,
  formApiRef,
  steps,
  startIndex = 0,
  actions = {},
  getStepActions,
  onSave, onDraft, onSubmit, onStepChange,
  formProps = {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [index, setIndex] = React.useState(Math.min(startIndex, steps.length - 1));
  const step = steps[index];
  const total = steps.length;

  // Build a filtered schema for current step
  const stepSchema = React.useMemo(() => buildSchemaForStep(schema, step), [schema, step]);

  // Compute field IDs in current step (for step validation)
  const stepFieldIds = React.useMemo(() => fieldsForStep(schema, step), [schema, step]);
  const allFieldIds = React.useMemo(() => uniq(steps.flatMap((s) => fieldsForStep(schema, s))), [schema, steps]);

  const ctx = React.useMemo(() => ({ index, total, step }), [index, total, step]);

  // move between steps
  const go = React.useCallback((to) => {
    const next = Math.max(0, Math.min(total - 1, to));
    if (next !== index) {
      setIndex(next);
      onStepChange?.(index, next, { ...ctx, nextIndex: next });
    }
  }, [index, total, onStepChange, ctx]);

  // ---------- handlers wired to RHF through DynamicForm formApiRef ----------
  const triggerStep = React.useCallback(async () => {
    const api = formApiRef?.current;
    if (!api?.trigger) return true;
    return api.trigger(stepFieldIds, { shouldFocus: true });
  }, [formApiRef, stepFieldIds]);

  const triggerAll = React.useCallback(async () => {
    const api = formApiRef?.current;
    if (!api?.trigger) return true;
    const ok = await api.trigger(allFieldIds, { shouldFocus: true });
    if (!ok && api.getErrors) {
      const errors = api.getErrors();
      const firstIdx = steps.findIndex((s) => fieldsForStep(schema, s).some((id) => !!errors?.[id]));
      if (firstIdx >= 0) setIndex(firstIdx);
    }
    return ok;
  }, [formApiRef, allFieldIds, steps, schema]);

  // default actions wiring (you can override with getStepActions)
  const baseActions = React.useMemo(() => ({
    prev: { id: "prev", label: "Previous", variant: "outlined", color: "inherit", onClick: () => go(index - 1) },
    next: { id: "next", label: "Next", variant: "contained", color: "primary", requiresValid: true, onClick: async () => (await triggerStep()) && go(index + 1) },
    save: {
      id: "save", label: "Save", variant: "outlined", color: "primary",
      onClick: async () => {
        const api = formApiRef?.current;
        const vals = api?.getValues?.();
        const payload = api?.buildPayload ? api.buildPayload(vals) : vals;
        onSave?.(payload, ctx);
      }
    },
    draft: {
      id: "draft", label: "Save Draft", variant: "outlined", color: "secondary",
      onClick: async () => {
        const api = formApiRef?.current;
        const vals = api?.getValues?.();
        const payload = api?.buildPayload ? api.buildPayload(vals) : vals;
        onDraft?.(payload, ctx);
      }
    },
    submit: {
      id: "submit", label: "Submit", variant: "contained", color: "success",
      requiresValid: true,
      onClick: async () => {
        if (!(await triggerAll())) return;
        const api = formApiRef?.current;
        const vals = api?.getValues?.();
        const payload = api?.buildPayload ? api.buildPayload(vals) : vals;
        onSubmit?.(payload, ctx);
      }
    },
  }), [go, index, triggerStep, triggerAll, onSave, onDraft, onSubmit, formApiRef, ctx]);

  function resolveActions() {
    const env = { ...ctx, getValues: formApiRef?.current?.getValues };
    const idsOrObjs = (typeof getStepActions === "function")
      ? getStepActions(step, env)
      : ["prev", "save", "next", "draft", "submit"];
    const merged = idsOrObjs.map((x) =>
      typeof x === "string"
        ? { ...baseActions[x], ...(actions[x] || {}) }
        : x?.id
          ? { ...(baseActions[x.id] || {}), ...(actions[x.id] || {}), ...x }
          : x
    );

    return merged
      .filter((a) => evalCond(a?.showWhen ?? true, env))
      .map((a) => ({
        ...a,
        disabled: !!evalCond(a?.disableWhen ?? false, env),
      }));
  }

  const resolvedActions = React.useMemo(() => resolveActions(), [actions, getStepActions, ctx, baseActions]);

  return (
    // Make the whole area a column so the footer can sit at the bottom *inside the body*
    <DSBox sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", gap: 2 }}>
      {/* top stepper */}
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 }, border: "none" }}>
        <Stepper activeStep={index} alternativeLabel={!isMobile} orientation={isMobile ? "vertical" : "horizontal"}>
          {steps.map((s) => (
            <Step key={s.id}>
              <StepLabel sx={{
                "& .MuiStepLabel-label": {
                  fontWeight: 600,   // or 'bold'
                  color: "var(--g-fg)", // optional: use your theme token
                },
              }}>{s.label || s.title || s.id}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* form surface — grows and scrolls; keep room for sticky footer */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          border: "none",
          flex: 1,
          overflow: "auto",
          pb: { xs: 10, sm: 9 }, // avoid overlap with sticky footer height
        }}
      >
        {step?.description && (
          <DSBox sx={{ mb: 2 }}>
            <TypographyX variant="subtitle1" weight="bold" color="text.secondary">{step.description}</TypographyX>
            <Divider sx={{ mt: 1 }} />
          </DSBox>
        )}

        {/* IMPORTANT: keep one DynamicForm mounted; pass a filtered schema */}
        <DynamicForm
          {...formProps}
          schema={stepSchema}
          hideDefaultActions
          formApiRef={formApiRef}
          validationSchema={schema}
          defaultsSchema={schema}
          output="bySection"
        />
      </Paper>

      {/* footer actions — INSIDE body, width-matched, mobile 100% */}
      <DSBox
        radius={0}
        sx={{
          position: "sticky",
          bottom: { xs: "calc(env(safe-area-inset-bottom, 0px) + 4px)", sm: 50 },
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          background: (t) => t.palette.background.paper,
          px: { xs: 2, md: 3 },
          py: 2,
          width: "100%",
          maxWidth: 1200,          // ← match your content container width
          mx: "auto",              // ← center on desktop
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}
        >
          <DSBox sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {resolvedActions
              .filter((a) => ["prev", "save"].includes(a.id))
              .map((a) => (
                <AppButton
                  key={a.id}
                  variant={a.variant}
                  color={a.color}
                  disabled={a.disabled}
                  onClick={a.onClick}
                >
                  {a.label}
                </AppButton>
              ))}
          </DSBox>
          <DSBox sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {resolvedActions
              .filter((a) => !["prev", "save"].includes(a.id))
              .map((a) => (
                <AppButton
                  key={a.id}
                  variant={a.variant}
                  color={a.color}
                  disabled={a.disabled}
                  onClick={a.onClick}
                >
                  {a.label}
                </AppButton>
              ))}
          </DSBox>
        </Stack>
      </DSBox>
    </DSBox>
  );
}
