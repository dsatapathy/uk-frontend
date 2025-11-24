import React from "react";
import { getComponent } from "@gov/core";
import { otherEnterpriseActivityUpdateSchema } from "../forms/other-enterprise-activity-update.schema";
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
function flatFromMock(otherData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: otherData?.district ? Number(otherData.district) : "",
    block: otherData?.block ? Number(otherData.block) : "",
    gp: otherData?.gp ? Number(otherData.gp) : "",
    village: otherData?.village ? Number(otherData.village) : "",

    // --- Department & federation details ---
    departmentName: otherData?.departmentName ? String(otherData.departmentName) : "",
    federationName: otherData?.federationName ? String(otherData.federationName) : "",

    // --- Basic identifiers ---
    localId: otherData?.localId ? String(otherData.localId) : "",
    schemeName: otherData?.schemeName ? String(otherData.schemeName) : "",
    memberName: otherData?.memberName ? String(otherData.memberName) : "",

    // --- Enterprise details ---
    financeYear: otherData?.financeYear ? String(otherData.financeYear) : "",
    enterpriseType: otherData?.enterpriseType ? String(otherData.enterpriseType) : "",
    currentLivelihoodActivity: otherData?.currentLivelihoodActivity ? String(otherData.currentLivelihoodActivity) : "",
    proposedEnterprise: otherData?.proposedEnterprise ? String(otherData.proposedEnterprise) : "",

    // --- Personal details ---
    aadharNo: otherData?.aadharNo ? String(otherData.aadharNo) : "",
    mobileNumber: otherData?.mobileNumber ? String(otherData.mobileNumber) : "",

    // --- Cost & contribution details ---
    beneficiaryContribution: otherData?.beneficiaryContribution ? String(otherData.beneficiaryContribution) : "",
    projectSupport: otherData?.projectSupport ? String(otherData.projectSupport) : "",
    convergence: otherData?.convergence ? String(otherData.convergence) : "",
    bankAmount: otherData?.bankAmount ? String(otherData.bankAmount) : "",
    totalCost: otherData?.totalCost ? String(otherData.totalCost) : "",

    // --- Beneficiary bank details ---
    beneficiaryBankName: otherData?.beneficiaryBankName ? String(otherData.beneficiaryBankName) : "",
    beneficiaryAccountNo: otherData?.beneficiaryAccountNo ? String(otherData.beneficiaryAccountNo) : "",
    ifscCode: otherData?.ifscCode ? String(otherData.ifscCode) : "",

    // --- File attachments ---
    uploadProposal: otherData?.uploadProposal
      ? {
          id: otherData.uploadProposal.id || "",
          name: otherData.uploadProposal.name || "",
          size: otherData.uploadProposal.size || "",
        }
      : "",
  };
}





async function fetchOtherEnterpriseData(otherEnterpriseId) {
  const url = "v1/update-info";
  const method = "get";
  const params = { type: "other_enterprise_activity", id: otherEnterpriseId };
  const payload = null;
  const otherEnterpriseData = await apiService({ method, url, params, payload });
  if (!otherEnterpriseData) throw new Error("Other Enterprise not found");
  return otherEnterpriseData;
}

export default function OtherEnterpriseActivityUpdate() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;

    // helper: reset form to create defaults
    const resetToCreate = (actionVal) => {
      const defaults = flatFromMock({}, false);
      defaults.action = actionVal;
      formApiRef.current?.patch?.(defaults, { shouldValidate: false, shouldDirty: false });
    };
    // if action changed, reset to blank/create or clear form
    if (name === "action") {
      const actionVal = String(vals.action ?? "").toLowerCase();
      if (actionVal === "create" || actionVal === "update") {
        // reset entire form for a fresh "/create" or "/update" flow
        resetToCreate(actionVal);
        return;
      }
    }
    if (name !== "localId") return;
    const id = typeof vals.localId === "object"
      ? (vals.localId?.id ?? vals.localId?.value ?? vals.localId?.code ?? null)
      : vals.localId;
    const otherEnterpriseId = id;
    if (!otherEnterpriseId) return;
    // Optionally show loading indicator here

    try {
      show("Loading Other Enterprise data — please wait...");
      // Fetch other enterprise data from API
      const otherEnterpriseData = await fetchOtherEnterpriseData(otherEnterpriseId);

      // Flatten or transform otherEnterpriseData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(otherEnterpriseData, true);

      // IMPORTANT: ensure the selected other enterprise id remains what the user picked
      flat.localId = otherEnterpriseId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load Other Enterprise data", severity: "error" });
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
      show(isUpdate ? "Updating Other/Private Enterprise Activity — please wait..." : "Submitting Other/Private Enterprise Activity — please wait...");
      const payload = {
        module: "ENTERPRISE_ACTIVITY_UPDATE",
        operation: isUpdate ? "UPDATE" : "CREATE",
        formType: "OTHER_ENTERPRISE_ACTIVITY",
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
              message: isUpdate ? "Other/Private Enterprise Activity updated successfully" : "Other/Private Enterprise Activity submitted successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: isUpdate ? "Update Successful For Other/Private Enterprise Activity" : "Submission Successful For Other/Private Enterprise Activity",
              form: "Other/Private Enterprise Activity",
              body: isUpdate ? "Your Other/Private Enterprise Activity has been successfully updated." : "Your Other/Private Enterprise Activity has been successfully created.",
              reference: response?.data?.data?.reapId || "00XX00",
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
      schema={otherEnterpriseActivityUpdateSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="other-enterprise-activity-update"
      autosaveMs={800}
      ui={ui}
      validationSchema={otherEnterpriseActivityUpdateSchema}
      defaultsSchema={otherEnterpriseActivityUpdateSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
