import React from "react";
import { getComponent } from "@gov/core";
import { clfLcRegistrationSchema } from "../form/clf-lc-creation-updation.schema";
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

// helper: flatten shg data from API to flat form structure
function flatFromMock(clfData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",


    // --- Location hierarchy ---
    district: clfData?.district ? Number(clfData.district) : "",
    block: clfData?.block ? Number(clfData.block) : "",

    // --- CLF/LC Identification ---
    clfName: clfData?.clfName ? String(clfData.clfName) : "",
    clfToUpdateId: clfData?.clfToUpdateId ? String(clfData.clfToUpdateId) : "",
    agreementEffectiveDate: clfData?.agreementEffectiveDate
      ? String(clfData.agreementEffectiveDate)
      : "",

    // --- Coverage details ---
    panchayatsCovered: clfData?.panchayatsCovered
      ? String(clfData.panchayatsCovered)
      : "",
    revenueVillages: clfData?.revenueVillages
      ? String(clfData.revenueVillages)
      : "",
    voCount: clfData?.voCount ? String(clfData.voCount) : "",
    shgCount: clfData?.shgCount ? String(clfData.shgCount) : "",

    // --- Registration details ---
    address: clfData?.address ? String(clfData.address) : "",
    registrationNo: clfData?.registrationNo ? String(clfData.registrationNo) : "",
    registrationDate: clfData?.registrationDate
      ? String(clfData.registrationDate)
      : "",

    // --- Board of Directors ---
    presidentName: clfData?.presidentName ? String(clfData.presidentName) : "",
    secretaryName: clfData?.secretaryName ? String(clfData.secretaryName) : "",
    treasurerName: clfData?.treasurerName ? String(clfData.treasurerName) : "",
    bodNames: clfData?.bodNames ? String(clfData.bodNames) : "",

    // --- Legal & Business details ---
    panOrTan: clfData?.panOrTan ? String(clfData.panOrTan) : "",
    fssaiNo: clfData?.fssaiNo ? String(clfData.fssaiNo) : "",
    staffHeader: clfData?.staffHeader ? String(clfData.staffHeader) : "",
    businessPromoter: clfData?.businessPromoter
      ? String(clfData.businessPromoter)
      : "",
    accountantName: clfData?.accountantName
      ? String(clfData.accountantName)
      : "",
    gm1: clfData?.gm1 ? String(clfData.gm1) : "",
    gm2: clfData?.gm2 ? String(clfData.gm2) : "",

    // --- Financial details ---
    shareholders: clfData?.shareholders ? String(clfData.shareholders) : "",
    sharecapital: clfData?.sharecapital ? String(clfData.sharecapital) : "",
    associatedFpo: clfData?.associatedFpo ? String(clfData.associatedFpo) : "",
    bankAccount: clfData?.bankAccount ? String(clfData.bankAccount) : "",
    ifscCode: clfData?.ifscCode ? String(clfData.ifscCode) : "",
    bankName: clfData?.bankName ? String(clfData.bankName) : "",
    bankBranch: clfData?.bankBranch ? String(clfData.bankBranch) : "",

    // --- Assets & Value Chains ---
    totalLand: clfData?.totalLand ? String(clfData.totalLand) : "",
    grade: clfData?.grade ? String(clfData.grade) : "",
    valueChain1: clfData?.valueChain1 ? String(clfData.valueChain1) : "",
    valueChain2: clfData?.valueChain2 ? String(clfData.valueChain2) : "",
    valueChain3: clfData?.valueChain3 ? String(clfData.valueChain3) : "",

    // --- Last Dates ---
    lastAuditDate: clfData?.lastAuditDate ? String(clfData.lastAuditDate) : "",
    lastAgmDate: clfData?.lastAgmDate ? String(clfData.lastAgmDate) : "",
  };
}


async function fetchClfLcData(clfId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "clf_profile", id: clfId };
  const payload = null;
  const clfData = await apiService({ method, url, params, payload });
  if (!clfData) throw new Error("CLF/LC not found");
  return clfData;
}

export default function CLFLCProfileUpdate() {
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
    if (name !== "clfToUpdateId") return;
    const id = typeof vals.clfToUpdateId === "object"
      ? (vals.clfToUpdateId?.id ?? vals.clfToUpdateId?.value ?? vals.clfToUpdateId?.code ?? null)
      : vals.clfToUpdateId;
    const clfToUpdateId = id;

    if (!clfToUpdateId) return;
    // Optionally show loading indicator here

    try {
      show("Loading CLF/LC data — please wait...");
      // Fetch vo data from API
      const clfData = await fetchClfLcData(clfToUpdateId);
      // Flatten or transform voData as needed for your form
      const flat = flatFromMock(clfData, true);

      // IMPORTANT: ensure the selected vo id remains what the user picked
      flat.voId = clfToUpdateId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load vo data", severity: "error" });
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating CLF profile — please wait..." : "Submitting CLF profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "CLF_LC_PROFILE",
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
            message: isUpdate ? "CLF profile updated successfully" : "CLF profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For CLF Profile" : "Submission Successful For CLF Profile",
            form: "CLF Profile",
            body: isUpdate ? "Your CLF profile has been successfully updated." : "Your CLF profile has been successfully created.",
            clfName: response?.data?.data?.clfName || "Unknown",
            reference: response?.data?.data?.clfId || "00XX00",
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
      schema={clfLcRegistrationSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      entityId="clf-lc-registration"
      autosaveMs={800}
      ui={ui}
      validationSchema={clfLcRegistrationSchema}
      defaultsSchema={clfLcRegistrationSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
