import React from "react";
import { getComponent } from "@gov/core";
import { useConfig } from "@gov/library";
import { loadMemberProfileSchema, loadMemberProfileSteps } from "../form/loaders";

// 0-based index: step2 => index 1, step4 => index 3
const actionPolicy = (step, ctx) => {
  const isFirst = ctx.index === 0;
  const isLast = ctx.index === ctx.total - 1;
  const base = isFirst ? ["draft", "next"]
    : isLast ? ["prev", "draft", "submit"]
      : ["prev", "draft", "next"];
  // Always list the custom IDs; showWhen will decide visibility
  return [...base, "customStep2", "customStep4"];
};

const actions = {
  draft: { label: "Save Draft" },
  next: { requiresValid: true },
  submit: { label: "Submit", requiresValid: true },

  // 👇 will appear only on step 2 (index 1)
  customStep2: {
    id: "customStep2",
    label: "Validate SHG",
    variant: "outlined",
    color: "info",
    showWhen: ({ index }) => index === 1,
    onClick: ({ getValues }) => {
      const v = getValues?.();
      // …do whatever you need with v…
      console.log("Step 2 custom:", v);
    },
  },

  // 👇 will appear only on step 4 (index 3)
  customStep4: {
    id: "customStep4",
    label: "Verify KYC",
    color: "secondary",
    requiresValid: true,        // optional: enforce step validation first
    showWhen: ({ index }) => index === 3,
    onClick: ({ getValues }) => {
      const v = getValues?.();
      console.log("Step 4 custom:", v);
    },
  },
};


const ui = {
  padding: 2,
  grid: {
    cols:{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    gap: { xs: "s2", md: "s2" },
  },
  // section wrappers
  sections: {
    collapsible: false,
    defaultOpen: true,
  },
  // card look & feel for each FieldGroup
  sectionCard: {
    elevation: 0,
    variant: "outlined",
    sx: {
      p: { xs: 1.5, md: 2 },
      borderRadius: "var(--g-radius)",
      border: theme => `1px solid ${theme.palette.divider}`,
      titleSx: { fontWeight: 600 }, // if your FieldGroup forwards this
    },
  },
  // field containers
  fieldLayout: "top",
  fieldWrapper: {
    dense: true,
    requiredMark: "asterisk",
    labelWidth: 220,
  },
};

export default function CLFLCProfileUpdate() {
  const DynamicForm = getComponent("DynamicForm");
  const ConfigStepperMUI = getComponent("ConfigStepperMUI");
  const formApiRef = React.useRef(null);
  const { config: schema, loading: schemaLoading } = useConfig(
    loadMemberProfileSchema,
    "member-profile-schema"
  );
  const { config: steps, loading: stepsLoading } = useConfig(
    loadMemberProfileSteps,
    "member-profile-steps"
  );
  if (schemaLoading || stepsLoading || !schema || !steps) {
    return null;
  }
    return (
    <ConfigStepperMUI
      schema={schema}
      steps={steps}
      DynamicForm={DynamicForm}
      formApiRef={formApiRef}
      actions={actions}
      getStepActions={actionPolicy}
      onSave={(vals, ctx) => console.log("SAVE", vals, ctx)}
      onDraft={(vals, ctx) => console.log("DRAFT", vals, ctx)}
      onSubmit={(vals, ctx) => console.log("SUBMIT", vals, ctx)}

      formProps={{
        entityId: "member-profile",
        autosaveMs: 800,
        ui,
        validationSchema: schema,
        defaultsSchema: schema,
        output: "schema",
      }}
    />
  );
}
