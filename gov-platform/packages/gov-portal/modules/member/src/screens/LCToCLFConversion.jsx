import React from "react";
import { getComponent } from "@gov/core";
import { lcClfConversionSchema } from "../form/lc-clf-conversion.schema";
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

export default function LCToCLFConversion() {
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
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    show("Converting LC to CLF — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "LC_TO_CLF_PROFILE",
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
            message:  "LC to CLF conversion successful",
            severity: "success",
            duration: 6000,
          });
          const params = new URLSearchParams({
            status: "success",
            heading: "Update Successful For LC to CLF Conversion",
            form: "LC to CLF Conversion",
            body: "Your LC to CLF Conversion has been successfully updated.",
            reference: response?.data?.data?.id || "00XX00",
          }).toString();
          const target = `${window.location.origin}/common/acknowledgement_page?${params}`;
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
  };
  return (
    <DynamicForm
      schema={lcClfConversionSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      onValuesChange={handleValuesChange}
      entityId="lc-clf-conversion"
      autosaveMs={800}
      ui={ui}
      validationSchema={lcClfConversionSchema}
      defaultsSchema={lcClfConversionSchema}
      output="flat"
    />
  );
}
