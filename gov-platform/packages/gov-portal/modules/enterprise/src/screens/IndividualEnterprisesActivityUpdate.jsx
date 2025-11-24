import React from "react";
import { getComponent } from "@gov/core";
import { individualEnterpriseActivityUpdateSchema } from "../forms/individual-enterprises-activity-update.schema";
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
function flatFromMock(individualData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy (convert to numbers) ---
    district: individualData?.district ? Number(individualData.district) : "",
    block: individualData?.block ? Number(individualData.block) : "",
    gp: individualData?.gp ? Number(individualData.gp) : "",
    village: individualData?.village ? Number(individualData.village) : "",

    // --- Association (convert to numbers) ---
    clf: individualData?.clf ? Number(individualData.clf) : "",
    vo: individualData?.vo ? Number(individualData.vo) : "",
    shg: individualData?.shg ? Number(individualData.shg) : "",
    memberId: individualData?.memberId ? Number(individualData.memberId) : "",

    // --- Identification & personal details ---
    localId: individualData?.localId ? String(individualData.localId) : "",
    fatherOrHusband: individualData?.fatherOrHusband ? String(individualData.fatherOrHusband) : "",
    aadharNo: individualData?.aadharNo ? String(individualData.aadharNo) : "",
    mobileNumber: individualData?.mobileNumber ? String(individualData.mobileNumber) : "",
    financeYear: individualData?.financeYear ? String(individualData.financeYear) : "",

    // --- Enterprise details ---
    enterpriseType: individualData?.enterpriseType ? String(individualData.enterpriseType) : "",
    currentLivelihoodActivity: individualData?.currentLivelihoodActivity ? String(individualData.currentLivelihoodActivity) : "",
    proposedEnterprise: individualData?.proposedEnterprise ? String(individualData.proposedEnterprise) : "",

    // --- Cost & contribution details ---
    beneficiaryContribution: individualData?.beneficiaryContribution ? String(individualData.beneficiaryContribution) : "",
    projectSupport: individualData?.projectSupport ? String(individualData.projectSupport) : "",
    convergence: individualData?.convergence ? String(individualData.convergence) : "",
    bankAmount: individualData?.bankAmount ? String(individualData.bankAmount) : "",
    totalCost: individualData?.totalCost ? String(individualData.totalCost) : "",

    // --- Beneficiary bank details ---
    beneficiaryBankName: individualData?.beneficiaryBankName ? String(individualData.beneficiaryBankName) : "",
    beneficiaryAccountNo: individualData?.beneficiaryAccountNo ? String(individualData.beneficiaryAccountNo) : "",
    ifscCode: individualData?.ifscCode ? String(individualData.ifscCode) : "",

    // --- Fund details ---
    fundReceivedDate: individualData?.fundReceivedDate ? String(individualData.fundReceivedDate) : "",
    fundBeneficiaryContribution: individualData?.fundBeneficiaryContribution ? String(individualData.fundBeneficiaryContribution) : "",
    fundProjectSupport: individualData?.fundProjectSupport ? String(individualData.fundProjectSupport) : "",
    fundConvergence: individualData?.fundConvergence ? String(individualData.fundConvergence) : "",
    fundBank: individualData?.fundBank ? String(individualData.fundBank) : "",
    fundTotalCost: individualData?.fundTotalCost ? String(individualData.fundTotalCost) : "",

    // --- Beneficiary loan details ---
    beneficiaryLoanBankName: individualData?.beneficiaryLoanBankName ? String(individualData.beneficiaryLoanBankName) : "",
    beneficiaryLoanAccount: individualData?.beneficiaryLoanAccount ? String(individualData.beneficiaryLoanAccount) : "",
    beneficiaryLoanIfsc: individualData?.beneficiaryLoanIfsc ? String(individualData.beneficiaryLoanIfsc) : "",

    // --- File attachments (object safe handling) ---
    uploadProposal: individualData?.uploadProposal
      ? {
        id: individualData.uploadProposal.id || "",
        name: individualData.uploadProposal.name || "",
        size: individualData.uploadProposal.size || "",
      }
      : "",

    fundUploadProposal: individualData?.fundUploadProposal
      ? {
        id: individualData.fundUploadProposal.id || "",
        name: individualData.fundUploadProposal.name || "",
        size: individualData.fundUploadProposal.size || "",
      }
      : "",

    enterpriseImage: individualData?.enterpriseImage
      ? {
        id: individualData.enterpriseImage.id || "",
        name: individualData.enterpriseImage.name || "",
        size: individualData.enterpriseImage.size || "",
      }
      : "",

    meansOfVerification: individualData?.meansOfVerification
      ? {
        id: individualData.meansOfVerification.id || "",
        name: individualData.meansOfVerification.name || "",
        size: individualData.meansOfVerification.size || "",
      }
      : "",
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

export default function IndividualEnterprisesActivityUpdate() {
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
    const individualEnterpriseId = id;
    if (!individualEnterpriseId) return;
    // Optionally show loading indicator here

    try {
      show("Loading Individual Enterprise data — please wait...");
      // Fetch individual enterprise data from API
      const individualEnterpriseData = await fetchIndividualEnterpriseData(individualEnterpriseId);

      // Flatten or transform individualEnterpriseData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(individualEnterpriseData, true);

      // IMPORTANT: ensure the selected individual enterprise id remains what the user picked
      flat.localId = individualEnterpriseId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load Individual Enterprise data", severity: "error" });
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
      show(isUpdate ? "Updating Individual Enterprise Activity — please wait..." : "Submitting Individual Enterprise Activity — please wait...");
      const payload = {
        module: "ENTERPRISE_ACTIVITY_UPDATE",
        operation: isUpdate ? "UPDATE" : "CREATE",
        formType: "INDIVIDUAL_ENTERPRISE_ACTIVITY",
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
              message: isUpdate ? "Individual Enterprise Activity updated successfully" : "Individual Enterprise Activity submitted successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: isUpdate ? "Update Successful For Individual Enterprise Activity" : "Submission Successful For Individual Enterprise Activity",
              form: "Individual Enterprise Activity",
              body: isUpdate ? "Your Individual Enterprise Activity has been successfully updated." : "Your Individual Enterprise Activity has been successfully created.",
              reference: response?.data?.data?.localId || "00XX00",
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
      schema={individualEnterpriseActivityUpdateSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="individual-enterprise-activity-update"
      autosaveMs={800}
      ui={ui}
      validationSchema={individualEnterpriseActivityUpdateSchema}
      defaultsSchema={individualEnterpriseActivityUpdateSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
