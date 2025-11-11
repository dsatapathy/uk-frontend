import React from "react";
import { getComponent } from "@gov/core";
import { cboEnterpriseActivityUpdateSchema } from "../forms/cbo-enterprise-activity-update.schema";
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
function flatFromMock(cboData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: cboData?.district ? Number(cboData.district) : "",
    block: cboData?.block ? Number(cboData.block) : "",
    gp: cboData?.gp ? Number(cboData.gp) : "",
    village: cboData?.village ? Number(cboData.village) : "",

    // --- Association ---
    clf: cboData?.clf ? Number(cboData.clf) : "",

    // --- Identification & enterprise details ---
    localId: cboData?.localId ? String(cboData.localId) : "",
    enterpriseType: cboData?.enterpriseType ? String(cboData.enterpriseType) : "",
    currentLivelihoodActivity: cboData?.currentLivelihoodActivity ? String(cboData.currentLivelihoodActivity) : "",
    proposedEnterprise: cboData?.proposedEnterprise ? String(cboData.proposedEnterprise) : "",
    clfPanTan: cboData?.clfPanTan ? String(cboData.clfPanTan) : "",
    financeYear: cboData?.financeYear ? String(cboData.financeYear) : "",

    // --- Cost & contribution details ---
    clfContribution: cboData?.clfContribution ? String(cboData.clfContribution) : "",
    projectSupport: cboData?.projectSupport ? String(cboData.projectSupport) : "",
    convergence: cboData?.convergence ? String(cboData.convergence) : "",
    bank: cboData?.bank ? String(cboData.bank) : "",
    totalCost: cboData?.totalCost ? String(cboData.totalCost) : "",

    // --- CLF bank details ---
    clfBankName: cboData?.clfBankName ? String(cboData.clfBankName) : "",
    clfAccountNumber: cboData?.clfAccountNumber ? String(cboData.clfAccountNumber) : "",
    clfIfscCode: cboData?.clfIfscCode ? String(cboData.clfIfscCode) : "",
    clfMobileNumber: cboData?.clfMobileNumber ? String(cboData.clfMobileNumber) : "",

    // --- Fund details ---
    fundReceivedDate: cboData?.fundReceivedDate ? String(cboData.fundReceivedDate) : "",
    fundLcfContribution: cboData?.fundLcfContribution ? String(cboData.fundLcfContribution) : "",
    fundProjectSupport: cboData?.fundProjectSupport ? String(cboData.fundProjectSupport) : "",
    fundConvergence: cboData?.fundConvergence ? String(cboData.fundConvergence) : "",
    fundBank: cboData?.fundBank ? String(cboData.fundBank) : "",
    fundTotalCost: cboData?.fundTotalCost ? String(cboData.fundTotalCost) : "",

    // --- Loan details ---
    loanBankName: cboData?.loanBankName ? String(cboData.loanBankName) : "",
    loanBankAccount: cboData?.loanBankAccount ? String(cboData.loanBankAccount) : "",
    loanBankIfcs: cboData?.loanBankIfcs ? String(cboData.loanBankIfcs) : "",

    // --- File attachments ---
    uploadProposal: cboData?.uploadProposal
      ? {
          id: cboData.uploadProposal.id || "",
          name: cboData.uploadProposal.name || "",
          size: cboData.uploadProposal.size || "",
        }
      : "",

    enterpriseImage: cboData?.enterpriseImage
      ? {
          id: cboData.enterpriseImage.id || "",
          name: cboData.enterpriseImage.name || "",
          size: cboData.enterpriseImage.size || "",
        }
      : "",

    meansOfVerification: cboData?.meansOfVerification
      ? {
          id: cboData.meansOfVerification.id || "",
          name: cboData.meansOfVerification.name || "",
          size: cboData.meansOfVerification.size || "",
        }
      : "",
  };
}




async function fetchCboEnterpriseData(cboEnterpriseId) {
  const url = "v1/update-info";
  const method = "get";
  const params = { type: "cbo_enterprise_activity", id: cboEnterpriseId };
  const payload = null;
  const cboEnterpriseData = await apiService({ method, url, params, payload });
  if (!cboEnterpriseData) throw new Error("CBO Enterprise not found");
  return cboEnterpriseData;
}

export default function CboEnterpriseActivityUpdate() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
// Handler for form value changes
const handleValuesChange = React.useCallback(async (vals, meta) => {
  const name = meta?.name;
  if (!name) return;

  // --- Helper: reset form to create defaults ---
  const resetToCreate = (actionVal) => {
    const defaults = flatFromMock({}, false);
    defaults.action = actionVal;
    formApiRef.current?.patch?.(defaults, { shouldValidate: false, shouldDirty: false });
  };

  // --- Reset form when action changes ---
  if (name === "action") {
    const actionVal = String(vals.action ?? "").toLowerCase();
    if (actionVal === "create" || actionVal === "update") {
      resetToCreate(actionVal);
      return;
    }
  }

  // --- Fetch data when localId changes ---
  if (name === "localId") {
    const id = typeof vals.localId === "object"
      ? (vals.localId?.id ?? vals.localId?.value ?? vals.localId?.code ?? null)
      : vals.localId;

    const cboEnterpriseId = id;
    if (!cboEnterpriseId) return;

    try {
      show("Loading CBO Enterprise data — please wait...");
      const cboEnterpriseData = await fetchCboEnterpriseData(cboEnterpriseId);
      const flat = flatFromMock(cboEnterpriseData, true);
      flat.localId = cboEnterpriseId;
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load CBO Enterprise data", severity: "error" });
    }
    return;
  }

  // --- Define contribution field groups ---
  const normalFields = ["clfContribution", "projectSupport", "convergence", "bank"];
  const fundFields = ["fundLcfContribution", "fundProjectSupport", "fundConvergence", "fundBank"];

  // --- Calculate and patch totalCost ---
  if (normalFields.includes(name)) {
    const clf = Number(vals.clfContribution || 0);
    const proj = Number(vals.projectSupport || 0);
    const conv = Number(vals.convergence || 0);
    const bank = Number(vals.bank || 0);

    const totalCost = clf + proj + conv + bank;

    formApiRef.current?.patch?.(
      { totalCost },
      { shouldValidate: false, shouldDirty: true }
    );
  }

  // --- Calculate and patch fundTotalCost ---
  if (fundFields.includes(name)) {
    const fClf = Number(vals.fundLcfContribution || 0);
    const fProj = Number(vals.fundProjectSupport || 0);
    const fConv = Number(vals.fundConvergence || 0);
    const fBank = Number(vals.fundBank || 0);

    const fundTotalCost = fClf + fProj + fConv + fBank;

    formApiRef.current?.patch?.(
      { fundTotalCost },
      { shouldValidate: false, shouldDirty: true }
    );
  }

}, []);


  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
      show(isUpdate ? "Updating CBO Enterprise Activity — please wait..." : "Submitting CBO Enterprise Activity — please wait...");
      const payload = {
        module: "ENTERPRISE_ACTIVITY_UPDATE",
        operation: isUpdate ? "UPDATE" : "CREATE",
        formType: "CBO_ENTERPRISE_ACTIVITY",
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
              message: isUpdate ? "CBO Enterprise Activity updated successfully" : "CBO Enterprise Activity submitted successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: isUpdate ? "Update Successful For CBO Enterprise Activity" : "Submission Successful For CBO Enterprise Activity",
              form: "CBO Enterprise Activity",
              body: isUpdate ? "Your CBO Enterprise Activity has been successfully updated." : "Your CBO Enterprise Activity has been successfully created.",
              reference: response?.data?.data?.localId || "00XX00",
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
      schema={cboEnterpriseActivityUpdateSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="cbo-enterprise-activity-update"
      autosaveMs={800}
      ui={ui}
      validationSchema={cboEnterpriseActivityUpdateSchema}
      defaultsSchema={cboEnterpriseActivityUpdateSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
