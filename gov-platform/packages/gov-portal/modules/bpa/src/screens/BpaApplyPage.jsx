// packages/bpa/src/pages/BpaApplyPage.jsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { http } from "@gov/data"; // or your local data client
import { bpaSchema } from "../form/bpa.schema";
import { getComponent } from "@gov/core";

export default function BpaApplyPage() {
    const FormShell    = getComponent("FormShell");

  const submit = useMutation({
    mutationFn: async (values) => (await http().post(`/forms/${bpaSchema.id}/submit`, values)).data,
  });

  return (
    <FormShell
      schema={bpaSchema}
      onSubmit={(values) => submit.mutate(values)}
    />
  );
}
