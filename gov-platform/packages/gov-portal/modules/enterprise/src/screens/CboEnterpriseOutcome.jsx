import React from "react";
import { getComponent } from "@gov/core";
import { cboEnterpriseOutcomeSchema } from "../forms/cbo-enterprise-outcome.schema";
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
function flatFromMock(EnterprizeData) {
  return {
    
    district: EnterprizeData.district||"",
    block: EnterprizeData.block||"",
    gp: EnterprizeData.gp ||"",
    village: EnterprizeData.village,
    clf: EnterprizeData.clf || "",
    vo: EnterprizeData.vo || "",
    shg: EnterprizeData.shg || "",
    localId: EnterprizeData.localId||"",
    proposedEnterprise: EnterprizeData.proposedEnterprise||"",
    financialYear: EnterprizeData.financeYear||"",
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

async function fetchData(ids) {
  const url = "v1/update-info";
  const method = "get";
  const params = { type: "cbo_enterprise_activity", id: ids };
  const payload = null;
  const individualEnterpriseData = await apiService({ method, url, params, payload });
  if (!individualEnterpriseData) throw new Error("CBO Enterprise not found");
  return individualEnterpriseData;
}

export default function CboEnterpriseOutcome() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
      const name = meta?.name;
      if (!name) return;
      if (name !== "localId") return;
      const id = typeof vals.shgId === "object"
        ? (vals.localId?.id ?? vals.localId?.value ?? vals.localId?.code ?? null)
        : vals.localId;
      const localId = id;
      if (!localId) return;
      // Optionally show loading indicator here
  
      try {
        show("Loading CBO Enterprise data for selected member — please wait...");
        const responseData = await fetchData(localId);
        const flat = flatFromMock(responseData,true);
        flat.localId = localId;
        formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        hide();
      } catch (err) {
        hide();
        enqueue({ message: "Failed to CBO Enterprise data", severity: "error" });
      }
  }, []);
// Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    
    show("Updating CBO Enterprise Outcome — please wait...");
    const payload = {
      module: "ENTERPRISE_ACTIVITY_UPDATE",
      operation:"CREATE",
      formType: "CBO_ENTERPRISE_OUTCOME",
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
            message: "CBO Enterprise Outcome updated successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading:"Update Successful For CBO Enterprise Outcome",
            body:  "Outcome for CBO Enterprise has been successfully updated.",
            reference: response?.data?.data?.localId || response?.data?.localId || "00XX00",
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
      schema={cboEnterpriseOutcomeSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="cbo-enterprise-outcome"
      autosaveMs={800}
      ui={ui}
      validationSchema={cboEnterpriseOutcomeSchema}
      defaultsSchema={cboEnterpriseOutcomeSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
