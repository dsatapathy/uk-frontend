// packages/bpa/src/pages/BpaApplyPage.jsx
import React from "react";
import { bpaSchema } from "../form/bpa.schema";
import { getComponent } from "@gov/core";
import { useSubmitForm } from "@gov/data";
export default function BpaApplyPage() {
  const DynamicForm = getComponent("DynamicForm");
  const submit = useSubmitForm(bpaSchema.id, "local-entity");

  return (
    <DynamicForm
      schema={bpaSchema}
      onSubmit={(values) => submit.mutate(values)}
    />
  );
}
