import React from "react";
import { getComponent } from "@gov/core";
import { pgProfileSchema } from "../form/pg-profile.schema";
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
function flatFromMock(pgData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: pgData?.district ? Number(pgData.district) : "",
    block: pgData?.block ? Number(pgData.block) : "",
    gp: pgData?.gp ? Number(pgData.gp) : "",
    village: pgData?.village ? Number(pgData.village) : "",
    lc: pgData?.lc ? Number(pgData.lc) : "",

    // --- PG Identification ---
    pgName: pgData?.pgName ? String(pgData.pgName) : "",
    pgNameId: pgData?.pgNameId ? Number(pgData.pgNameId) : "",
    pgCode: pgData?.pgCode ? String(pgData.pgCode) : "",
    dateOfRegistration: pgData?.dateOfRegistration ? String(pgData.dateOfRegistration) : "",
    address: pgData?.address ? String(pgData.address) : "",

    // --- Member details ---
    totalMembers: pgData?.totalMembers ? String(pgData.totalMembers) : "",
    maleMembers: pgData?.maleMembers ? String(pgData.maleMembers) : "",
    femaleMembers: pgData?.femaleMembers ? String(pgData.femaleMembers) : "",

    // --- Governance & Functionality ---
    presidentElected: pgData?.presidentElected ? String(pgData.presidentElected) : "",
    pgMeetingFrequency: pgData?.pgMeetingFrequency ? String(pgData.pgMeetingFrequency) : "",
    livelihoodCommitteeFormation: pgData?.livelihoodCommitteeFormation ? String(pgData.livelihoodCommitteeFormation) : "",

    // --- Value Chain Details ---
    valueChain1: pgData?.valueChain1 ? String(pgData.valueChain1) : "",
    valueChain2: pgData?.valueChain2 ? String(pgData.valueChain2) : "",
    valueChain3: pgData?.valueChain3 ? String(pgData.valueChain3) : "",

    // --- Financial & Training ---
    accountBooksMaintained: pgData?.accountBooksMaintained ? String(pgData.accountBooksMaintained) : "",
    monthlySavingsRate: pgData?.monthlySavingsRate ? String(pgData.monthlySavingsRate) : "",
    fsipFundReceived: pgData?.fsipFundReceived ? String(pgData.fsipFundReceived) : "",

    // --- Sakhi Information ---
    bankSakhi: pgData?.bankSakhi ? String(pgData.bankSakhi) : "",
    pashuSakhi: pgData?.pashuSakhi ? String(pgData.pashuSakhi) : "",
    krishiSakhi: pgData?.krishiSakhi ? String(pgData.krishiSakhi) : "",

    // --- Bank Details ---
    pgBankName: pgData?.pgBankName ? String(pgData.pgBankName) : "",
    pgAccountNo: pgData?.pgAccountNo ? String(pgData.pgAccountNo) : "",
    pgIfscCode: pgData?.pgIfscCode ? String(pgData.pgIfscCode) : "",

    // --- Verification ---
    meansOfVerification: pgData?.meansOfVerification ? String(pgData.meansOfVerification) : "",
  };
}



async function fetchPgData(pgId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "pg_profile", id: pgId };
  const payload = null;
  const pgData = await apiService({ method, url, params, payload });
  console.log("Fetched PG Data:", pgData);
  if (!pgData) throw new Error("PG not found");
  return pgData;
}

export default function PGProfileUpdate() {
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
    if (name !== "pgNameId") return;
    const id = typeof vals.pgNameId === "object"
      ? (vals.pgNameId?.id ?? vals.pgNameId?.value ?? vals.pgNameId?.code ?? null)
      : vals.pgNameId;
    const pgId = id;
    if (!pgId) return;
    // Optionally show loading indicator here

    try {
      show("Loading pg data — please wait...");
      // Fetch pg data from API
      const pgData = await fetchPgData(pgId);

      // Flatten or transform pgData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(pgData, true);

      // IMPORTANT: ensure the selected pg id remains what the user picked
      flat.pgId = pgId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load pg data", severity: "error" });
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating PG profile — please wait..." : "Submitting PG profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "PG_PROFILE",
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
            message: isUpdate ? "PG profile updated successfully" : "PG profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For PG Profile" : "Submission Successful For PG Profile",
            form: "PG Profile",
            body: isUpdate ? "Your PG profile has been successfully updated." : "Your PG profile has been successfully created.",
            pgName: response?.data?.data?.pgName || "Unknown",
            reference: response?.data?.data?.pgId || "00XX00",
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
      schema={pgProfileSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      onValuesChange={handleValuesChange}
      entityId="pg-profile"
      autosaveMs={800}
      ui={ui}
      validationSchema={pgProfileSchema}
      defaultsSchema={pgProfileSchema}
      output="flat"
    />
  );
}
