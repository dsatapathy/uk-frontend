import React from "react";
import { getComponent } from "@gov/core";
import { individualEnterpriseOutcomeDetailsSchema } from "../forms/individual-enterprise-outcome.schema";
import { useSubmitData } from "@gov/data";
import { useSnackbar } from "@gov/library";
import { useLoader } from "@gov/library";
import {apiService} from "@gov/data";

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
// helper: flatten shg data from API to flat form structure
function flatFromMock(individualEnterprizeData) {
  return {
    
    district: individualEnterprizeData.district||"",
    block: individualEnterprizeData.block||"",
    gp: individualEnterprizeData.gp ||"",
    village: individualEnterprizeData.village,
    clf: individualEnterprizeData.clf || "",
    vo: individualEnterprizeData.vo || "",
    shg: individualEnterprizeData.shg || "",
    memberId: individualEnterprizeData.memberId||"",
    proposedEnterprise: individualEnterprizeData.proposedEnterprise||"",
    financialYear: individualEnterprizeData.financeYear||"",
    dataEntryFrequency: "",
    monthToUpdate: "",
    activityHeading1: "",
    activityName1: "",
    activityRevenue1: "",
    activityGrossProfit1: "",
    activityHeading2: "",
    activityName2: "",
    activityRevenue2: "",
    activityGrossProfit2: "",
    activityHeading3: "",
    activityName3: "",
    activityRevenue3: "",
    activityGrossProfit3: "",

  };
}


async function fetchIndividualEnterpriseData(individualEnterpriseId) {
  const url = "v1/update-info";
  const method = "get";
  const params = { type: "ind_enterprise_activity", id: individualEnterpriseId };
  const payload = null;
  const individualEnterpriseData = await apiService({ method, url, params, payload });
  if (!individualEnterpriseData) throw new Error("Individual Enterprise not found");
  return individualEnterpriseData;
}

export default function IndividualEnterpriseOutcome() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
      const name = meta?.name;
      if (!name) return;
      if (name !== "memberId") return;
      const id = typeof vals.shgId === "object"
        ? (vals.memberId?.id ?? vals.memberId?.value ?? vals.memberId?.code ?? null)
        : vals.memberId;
      const memberId = id;
      if (!memberId) return;
      // Optionally show loading indicator here
  
      try {
        show("Loading Individual Enterprise data for selected member — please wait...");
        const individualEnterprizeData = await fetchIndividualEnterpriseData(memberId);
        const flat = flatFromMock(individualEnterprizeData,true);
        flat.memberId = memberId;
        formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        hide();
      } catch (err) {
        hide();
        enqueue({ message: "Failed to Individual Enterprise data", severity: "error" });
      }
  
    }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    
    show("Updating Individual Enterprise Outcome — please wait...");
    const payload = {
      module: "ENTERPRISE_ACTIVITY_UPDATE",
      operation:"CREATE",
      formType: "INDIVIDUAL_ENTERPRISE_OUTCOME",
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
            message: "Individual Enterprise Outcome updated successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading:"Update Successful For Individual Enterprise Outcome",
            body:  "Outcome for Individual Enterprise has been successfully updated.",
            reference: response?.data?.data?.localId || response?.data?.localId || "00XX00",
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
  };
  return (
    <DynamicForm
      schema={individualEnterpriseOutcomeDetailsSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="individual-enterprise-outcome"
      autosaveMs={800}
      ui={ui}
      validationSchema={individualEnterpriseOutcomeDetailsSchema}
      defaultsSchema={individualEnterpriseOutcomeDetailsSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
