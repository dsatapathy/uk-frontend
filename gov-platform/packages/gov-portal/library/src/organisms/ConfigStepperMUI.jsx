// ConfigStepperMUI.jsx — fully modular, config-driven stepper for DynamicForm (React 17, MUI v5)
import * as React from "react";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LensBlurRoundedIcon from "@mui/icons-material/LensBlurRounded";
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
  if (step.sections && step.sections.length) return pickSections(fullSchema, step.sections);
  if (step.section && step.fieldIds) {
    const section = (fullSchema.sections || []).find((s) => s.id === step.section);
    if (!section) return { ...fullSchema, sections: [] };
    const one = pickFieldsFromOneSection(section, step.fieldIds);
    return { ...fullSchema, sections: [one] };
  }
  return { ...fullSchema, sections: [] };
}

function fieldsForStep(fullSchema, step) {
  if (step.fieldIds?.length) return step.fieldIds;
  const sections = buildSchemaForStep(fullSchema, step).sections || [];
  return sections.flatMap((s) => (s.fields || []).map((f) => f.id));
}

function evalCond(cond, ctx) {
  if (cond == null) return true;
  if (typeof cond === "boolean") return cond;
  if (typeof cond === "function") return !!cond(ctx);
  return true;
}

// ----------------------------- Styled Components ---------------------------

// Gradient connector
const GradientConnector = styled(StepConnector)(({ theme }) => ({
  // Horizontal (labels under icons)
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },

  // Base line (horizontal)
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    opacity: 0.6,
  },

  // Vertical mode: style the ROOT, then its line
  [`&.${stepConnectorClasses.vertical}`]: {
    top: 0,
    marginLeft: 14,
    padding: 0,
  },
  [`&.${stepConnectorClasses.vertical} .${stepConnectorClasses.line}`]: {
    width: 3,
    height: "100%",
    background: `linear-gradient(180deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    borderRadius: 2,
    border: 0,
    opacity: 0.6,
  },
}));

// Step icon root
const StepIconRoot = styled("div")(({ theme, ownerState }) => {
  const active = ownerState.active;
  const completed = ownerState.completed;

  return {
    background:
      completed
        ? theme.palette.success.main
        : active
          ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
          : theme.palette.grey[300],
    color: completed || active ? theme.palette.common.white : theme.palette.text.secondary,
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    boxShadow: active
      ? "0 6px 18px rgba(16,185,129,.35)"
      : completed
        ? "0 4px 12px rgba(16,185,129,.25)"
        : "inset 0 0 0 1px rgba(0,0,0,.06)",
    transition: "all .2s ease",
  };
});

function PrettyStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : <LensBlurRoundedIcon sx={{ fontSize: 16 }} />}
    </StepIconRoot>
  );
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

  const stepSchema = React.useMemo(() => buildSchemaForStep(schema, step), [schema, step]);
  const stepFieldIds = React.useMemo(() => fieldsForStep(schema, step), [schema, step]);
  const allFieldIds = React.useMemo(() => uniq(steps.flatMap((s) => fieldsForStep(schema, s))), [schema, steps]);
  const ctx = React.useMemo(() => ({ index, total, step }), [index, total, step]);

  const go = React.useCallback((to) => {
    const next = Math.max(0, Math.min(total - 1, to));
    if (next !== index) {
      setIndex(next);
      onStepChange?.(index, next, { ...ctx, nextIndex: next });
    }
  }, [index, total, onStepChange, ctx]);

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
      .map((a) => ({ ...a, disabled: !!evalCond(a?.disableWhen ?? false, env) }));
  }

  const resolvedActions = React.useMemo(() => resolveActions(), [actions, getStepActions, ctx, baseActions]);

  return (
    <DSBox sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", gap: 2 }}>
      {/* --- Modern Stepper Header --- */}
      <Paper elevation={0} sx={{ p: { xs: 1.25, sm: 2 }, border: "none" }}>
        <Stepper
          activeStep={index}
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          connector={<GradientConnector />}
          sx={{
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {steps.map((s, i) => {
            const isCompleted = i < index;
            const isActive = i === index;

            return (
              <Step key={s.id} completed={isCompleted} onClick={() => setIndex(i)}>
                <StepLabel
                  StepIconComponent={PrettyStepIcon}
                  sx={{
                    "& .MuiStepLabel-label": {
                      // completed → bold, others → normal
                      fontWeight: isCompleted ? 700 : 400,
                      // (optional) keep your size/colors consistent
                      fontSize: { xs: ".85rem", sm: ".95rem" },
                      color: "text.primary",
                      // small emphasis for current step if you want:
                      ...(isActive && !isCompleted ? { fontWeight: 500 } : null),
                    },
                  }}
                >
                  {s.label || s.title || s.id}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Paper>

      {/* form surface */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          border: "none",
          flex: 1,
          overflow: "auto",
          pb: { xs: 10, sm: 9 },
        }}
      >
        {step?.description && (
          <DSBox sx={{ mb: 2 }}>
            <TypographyX variant="subtitle1" weight="bold" color="text.secondary">
              {step.description}
            </TypographyX>
            <Divider sx={{ mt: 1 }} />
          </DSBox>
        )}
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

      {/* footer actions */}
      <DSBox
        radius={0}
        sx={{
          position: "sticky",
          bottom: { xs: "-15px", sm: 50 },
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          background: (t) => t.palette.background.paper,
          px: { xs: 2, md: 3 },
          py: 2,
          width: "100%",
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
            {resolvedActions.filter((a) => ["prev", "save"].includes(a.id)).map((a) => (
              <AppButton key={a.id} variant={a.variant} color={a.color} disabled={a.disabled} onClick={a.onClick}>
                {a.label}
              </AppButton>
            ))}
          </DSBox>
          <DSBox sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {resolvedActions.filter((a) => !["prev", "save"].includes(a.id)).map((a) => (
              <AppButton key={a.id} variant={a.variant} color={a.color} disabled={a.disabled} onClick={a.onClick}>
                {a.label}
              </AppButton>
            ))}
          </DSBox>
        </Stack>
      </DSBox>
    </DSBox>
  );
}
