import React from "react";
import { memberProfileSchema } from "../form/member-profile.schema";
import { memberProfileSteps } from "../form/member-profile.steps";
import { getComponent } from "@gov/core";

export default function StepperTestPage() {
    const DynamicForm = getComponent("DynamicForm");
    const ConfigStepperMUI = getComponent("ConfigStepperMUI");
    const formApiRef = React.useRef(null);

    return (
        <ConfigStepperMUI
            schema={memberProfileSchema}
            DynamicForm={DynamicForm}
            formApiRef={formApiRef}
            steps={memberProfileSteps}
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
                ui: { padding: { xs: 1, md: 2 }, grid: { cols: { xs: 1, sm: 2 }, gap: { xs: "s2", md: "s3" } } }
            }}
        />
    );
}
