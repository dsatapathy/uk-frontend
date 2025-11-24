import React from "react";
import { getComponent } from "@gov/core";
import { clfBusinessMonthlyFormSchema } from "../forms/clf-bussines-monthly.schema";
import { useSubmitData } from "@gov/data";
import { useSnackbar } from "@gov/library";
import { useLoader } from "@gov/library";

const ui = {
  padding: 2,
  grid: {
    cols: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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


export default function ClfBussinessMonthly() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      show("CLF Business Monthly Data Updating — please wait...");
      const payload = {
        module: "ENTERPRISE_ACTIVITY_UPDATE",
        operation: "CREATE",
        formType: "CLF_MONTHLY_BUSINESS",
        formData: flatFormData,
      };
      const Url = "v1/reap/operations";
      const method = "post";
      submitMutation.mutate(
        { method, url: Url, payload },
        {
          onSuccess: (response) => {
            hide();
            enqueue({
              message: "CLF Business Monthly Data Updating successfully.",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: "Submission Successful For CLF Business Monthly Data Updating",
              form: "LC Activity",
              body: "Your CLF Business Monthly Data Updating has been successfully Updated.",
              reference: response?.data?.data?.localId ||  response?.data?.localId ||"00XX00",
            }).toString();
            const target = `${window.location.origin}/reap-mis/common/acknowledgement_page?${params}`;
            window.location.href = target;
          },
          onError: (error) => {
            hide();
            const errMsg =
              error?.response?.data?.error?.message ||
              error?.message ||
              "Error submitting form.";
            console.log("SUBMIT ERROR", error);
            enqueue({ message: errMsg, severity: "error", duration: 6000 });
          },
        }
      );
    } catch (err) {
      hide();
      const errMsg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Error submitting form.";
      enqueue({ message: errMsg, severity: "error", duration: 6000 });
    }
  };
  return (
    <DynamicForm
      schema={clfBusinessMonthlyFormSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="clf-business-monthly"
      autosaveMs={800}
      ui={ui}
      validationSchema={clfBusinessMonthlyFormSchema}
      defaultsSchema={clfBusinessMonthlyFormSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
