import React from "react";
import { getComponent } from "@gov/core";
import { updateMemberProfileSchema } from "../form/update-profile.schema";
import { updateMemberProfileSteps } from "../form/update-profile.steps";
const ui = {
  padding: 2,
  grid: {
    cols: { xs: 1, sm: 2, md: 12, lg: 2, xl: 2 },
    gap:  { xs: "s2", md: "s2" },
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

export default function UpdateMember() {
    const DynamicForm = getComponent("DynamicForm");
    const ConfigStepperMUI = getComponent("ConfigStepperMUI");
    const formApiRef = React.useRef(null);

    return (
        <ConfigStepperMUI
            schema={updateMemberProfileSchema}
            DynamicForm={DynamicForm}
            formApiRef={formApiRef}
            steps={updateMemberProfileSteps}
            getStepActions={(step, ctx) =>
                ctx.index === ctx.total - 1
                    ? ["prev", "save", "draft", "submit"]
                    : ["prev", "save", "next", "draft"]
            }
            onSave={(vals) => console.log("SAVE", vals)}
            onDraft={(vals) => console.log("DRAFT", vals)}
            onSubmit={(vals) => console.log("SUBMIT", vals)}
            formProps={{
                entityId: "member-profile",
                autosaveMs: 800,
                ui,
            }}
        />
    );
}
