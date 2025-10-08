import React from "react";
import { getComponent } from "@gov/core";
import { shareholderProfileSchema } from "../form/shareholder-profile.schema";
import { useSubmitForm } from "@gov/data";


const ui = {
  padding: 2,
  grid: {
    cols:{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    gap: { xs: "s2", md: "s2" },
  },
  stickyActions: true,
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

export default function ShareholderProfileUpdate() {
  const DynamicForm = getComponent("DynamicForm");
  const submit = useSubmitForm(shareholderProfileSchema.id, "shareholder-profile");
  return (
    <DynamicForm
      schema={shareholderProfileSchema}
      onSubmit={(values) => submit.mutate(values)}
      entityId="shareholder-profile"
      autosaveMs={800}
      ui={ui}
      validationSchema={shareholderProfileSchema}
      defaultsSchema={shareholderProfileSchema}
      output="schema"
    />
  );
}
