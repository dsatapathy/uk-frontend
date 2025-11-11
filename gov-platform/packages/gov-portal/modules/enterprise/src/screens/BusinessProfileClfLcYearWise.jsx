import React from "react";
import { getComponent } from "@gov/core";
import { businessProfileClfLcYearWiseSchema } from "../forms/business-profile-clf-lc-yearwise.schema";
import { useSubmitData } from "@gov/data";
import { useSnackbar } from "@gov/library";
import { useLoader } from "@gov/library";
import { apiService } from "@gov/data";

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

// helper: flatten individual enterprise data from API to flat form structure
function flatFromMock(data) {
  return {
    district: data?.district || "",
    block: data?.block || "",
    yearOfRegistration: data?.registrationDate || "",
    registrationNumber: data?.registrationNo || "",
    yearOfTakenInReap: data?.yearOfTakenInReap || "",
    totalVillageCovered: data?.revenueVillages || "",
    totalShg: data?.shgCount || "",
    shareholdersAgainstShgMembers: data?.shareholders || "",
    yearToUpdate: "",
    monthToUpdate:"",
    salesTurnoverCurrentMonth: "",
    grossProfitCurrentMonth: "",
    shareholdersInvolvedCurrentMonth: "",
  };
}
async function fetchData(Id) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "clf_profile", id: Id };
  const payload = null;
  const clfData = await apiService({ method, url, params, payload });
  if (!clfData) throw new Error("CLF/LC not found");
  return clfData;
}
export default function BusinessProfileClfLcYearWise() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;
    // --- Fetch data when clfLcName changes ---
    if (name === "clfLcName") {
      const id = typeof vals.clfLcName === "object"
        ? (vals.clfLcName?.id ?? vals.clfLcName?.value ?? vals.clfLcName?.code ?? null)
        : vals.clfLcName;

      const clfLcId = id;
      if (!clfLcId) return;

      try {
        show("Loading LC CLF data — please wait...");
        const clfLcData = await fetchData(clfLcId);
        const flat = flatFromMock(clfLcData);
        flat.clfLcName = clfLcId;
        formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        hide();
      } catch (err) {
        hide();
        enqueue({ message: "Failed to load CLF-LC data", severity: "error" });
      }
      return;
    }
  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      show("Updating Business Profile of CLF-LCs (Year wise) — please wait...");
      const payload = {
        module: "ENTERPRISE_ACTIVITY_UPDATE",
        operation: "CREATE",
        formType: "CLF_LC_BUSINESS_PROFILE_YEAR_WISE",
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
              message: "Business Profile of CLF-LCs (Year wise) updated successfully.",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: "Submission Successful Business Profile of CLF-LCs (Year wise)",
              form: "Business Profile of CLF-LCs (Year wise)",
              body: "Your Updation for Business Profile of CLF-LCs (Year wise) has been successfully updated.",
              reference: response?.data?.data?.id || response?.data?.id || "00XX00",
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
      schema={businessProfileClfLcYearWiseSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="business-profile-clf-lc-year-wise"
      autosaveMs={800}
      ui={ui}
      validationSchema={businessProfileClfLcYearWiseSchema}
      defaultsSchema={businessProfileClfLcYearWiseSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
