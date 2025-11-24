import React from "react";
import { getComponent } from "@gov/core";
import { lcRegistrationSchema } from "../form/lc-profile-update.schema";
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
function flatFromMock(lcData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: lcData?.district ? Number(lcData.district) : "",
    block: lcData?.block ? Number(lcData.block) : "",

    // --- LC Identification ---
    lcName: lcData?.lcName ? String(lcData.lcName) : "",
    lcId: lcData?.lcId ? String(lcData.lcId) : "",
    adoptionEffectiveDate: lcData?.adoptionEffectiveDate
      ? String(lcData.adoptionEffectiveDate)
      : "",
    agreementEffectiveDate: lcData?.agreementEffectiveDate
      ? String(lcData.agreementEffectiveDate)
      : "",

    // --- Coverage details ---
    panchayatsCovered: lcData?.panchayatsCovered
      ? String(lcData.panchayatsCovered)
      : "",
    revenueVillages: lcData?.revenueVillages
      ? String(lcData.revenueVillages)
      : "",
    voCount: lcData?.voCount ? String(lcData.voCount) : "",
    shgCount: lcData?.shgCount ? String(lcData.shgCount) : "",

    // --- Registration details ---
    address: lcData?.address ? String(lcData.address) : "",
    registrationNo: lcData?.registrationNo ? String(lcData.registrationNo) : "",
    registrationDate: lcData?.registrationDate
      ? String(lcData.registrationDate)
      : "",

    // --- Board of Directors ---
    presidentName: lcData?.presidentName ? String(lcData.presidentName) : "",
    secretaryName: lcData?.secretaryName ? String(lcData.secretaryName) : "",
    treasurerName: lcData?.treasurerName ? String(lcData.treasurerName) : "",
    bodNames: lcData?.bodNames ? String(lcData.bodNames) : "",

    // --- Legal & Business details ---
    panOrTan: lcData?.panOrTan ? String(lcData.panOrTan) : "",
    fssaiNo: lcData?.fssaiNo ? String(lcData.fssaiNo) : "",
    staffHeader: lcData?.staffHeader ? String(lcData.staffHeader) : "",
    businessPromoter: lcData?.businessPromoter
      ? String(lcData.businessPromoter)
      : "",
    accountantName: lcData?.accountantName
      ? String(lcData.accountantName)
      : "",
    gm1: lcData?.gm1 ? String(lcData.gm1) : "",
    gm2: lcData?.gm2 ? String(lcData.gm2) : "",

    // --- Financial details ---
    shareholders: lcData?.shareholders ? String(lcData.shareholders) : "",
    sharecapital: lcData?.sharecapital ? String(lcData.sharecapital) : "",
    associatedFpo: lcData?.associatedFpo ? String(lcData.associatedFpo) : "",
    bankAccount: lcData?.bankAccount ? String(lcData.bankAccount) : "",
    ifscCode: lcData?.ifscCode ? String(lcData.ifscCode) : "",
    bankName: lcData?.bankName ? String(lcData.bankName) : "",
    bankBranch: lcData?.bankBranch ? String(lcData.bankBranch) : "",

    // --- Assets & Value Chains ---
    totalLand: lcData?.totalLand ? String(lcData.totalLand) : "",
    grade: lcData?.grade ? String(lcData.grade) : "",
    valueChain1: lcData?.valueChain1 ? String(lcData.valueChain1) : "",
    valueChain2: lcData?.valueChain2 ? String(lcData.valueChain2) : "",
    valueChain3: lcData?.valueChain3 ? String(lcData.valueChain3) : "",

    // --- Last Dates ---
    lastAuditDate: lcData?.lastAuditDate ? String(lcData.lastAuditDate) : "",
    lastAgmDate: lcData?.lastAgmDate ? String(lcData.lastAgmDate) : "",
  };
}



async function fetchLcData(lcId) {
  const url = "v1/update-info";
  const method = "get";
  const params = { type: "lc_profile", id: lcId };
  const payload = null;
  const lcData = await apiService({ method, url, params, payload });
  if (!lcData) throw new Error("LC not found");
  return lcData;
}

export default function LcProfileUpdate() {
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
    if (name !== "lcId") return;
    const id = typeof vals.lcId === "object"
      ? (vals.lcId?.id ?? vals.lcId?.value ?? vals.lcId?.code ?? null)
      : vals.lcId;
    const lcId = id;
    if (!lcId) return;
    // Optionally show loading indicator here

    try {
      show("Loading LC data — please wait...");
      // Fetch vo data from API
      const lcData = await fetchLcData(lcId);
      // Flatten or transform voData as needed for your form
      const flat = flatFromMock(lcData, true);

      // IMPORTANT: ensure the selected vo id remains what the user picked
      flat.lcId = lcId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load LC data", severity: "error" });
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating LC profile — please wait..." : "Submitting LC profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "LC_MEMBER_MAPPING",
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
            message: isUpdate ? "LC profile updated successfully" : "LC profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For LC Profile" : "Submission Successful For LC Profile",
            form: "LC Profile",
            body: isUpdate ? "Your LC profile has been successfully updated." : "Your LC profile has been successfully created.",
            reference: response?.data?.data?.lcId || response?.data?.lcId || "00XX00",
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
      schema={lcRegistrationSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      entityId="lc-registration"
      autosaveMs={800}
      ui={ui}
      validationSchema={lcRegistrationSchema}
      defaultsSchema={lcRegistrationSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
