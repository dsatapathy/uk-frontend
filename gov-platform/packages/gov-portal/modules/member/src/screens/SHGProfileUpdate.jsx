import React from "react";
import { getComponent } from "@gov/core";
import { shgRegistrationSchema } from "../form/shg-registration.schema";
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
function flatFromMock(shgData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy (convert to numbers) ---
    district: shgData?.district ? Number(shgData.district) : "",
    block: shgData?.block ? Number(shgData.block) : "",
    gp: shgData?.gp ? Number(shgData.gp) : "",
    village: shgData?.village ? Number(shgData.village) : "",

    // --- Association (convert to numbers) ---
    clf: shgData?.clf ? Number(shgData.clf) : "",
    vo: shgData?.vo ? Number(shgData.vo) : "",

    // --- SHG identification ---
    shgCode: shgData?.shgCode ? String(shgData.shgCode) : "",
    shgName: shgData?.shgName ? String(shgData.shgName) : "",
    shgId: shgData?.shgId ? Number(shgData?.shgId) : "",
    shgJoinDate: shgData?.shgJoinDate ? String(shgData.shgJoinDate) : "",

    // --- Basic details ---
    address: shgData?.address ? String(shgData.address) : "",
    totalMembers: shgData?.totalMembers ? String(shgData.totalMembers) : "",

    // --- Functionality & governance ---
    presidentElected: shgData?.presidentElected ? String(shgData.presidentElected) : "",
    meetingFrequency: shgData?.meetingFrequency ? String(shgData.meetingFrequency) : "",
    discussionOnUltraPoorIE: shgData?.discussionOnUltraPoorIE ? String(shgData.discussionOnUltraPoorIE) : "",
    livelihoodCommitteeFormation: shgData?.livelihoodCommitteeFormation ? String(shgData.livelihoodCommitteeFormation) : "",

    // --- Value chains (multiple) ---
    valueChain1: shgData?.valueChain1 ? String(shgData.valueChain1) : "",
    valueChain2: shgData?.valueChain2 ? String(shgData.valueChain2) : "",
    valueChain3: shgData?.valueChain3 ? String(shgData.valueChain3) : "",

    // --- Financial details ---
    accountBooksMaintained: shgData?.accountBooksMaintained ? String(shgData.accountBooksMaintained) : "",
    monthlySavingsRate: shgData?.monthlySavingsRate ? String(shgData.monthlySavingsRate) : "",
    interloanMemberCount: shgData?.interloanMemberCount ? String(shgData.interloanMemberCount) : "",
    revolvingFundReceived: shgData?.revolvingFundReceived ? String(shgData.revolvingFundReceived) : "",
    cifUsed: shgData?.cifUsed ? String(shgData.cifUsed) : "",

    // --- Sakhi involvement ---
    bankSakhi: shgData?.bankSakhi ? String(shgData.bankSakhi) : "",
    pashuSakhi: shgData?.pashuSakhi ? String(shgData.pashuSakhi) : "",
    krishiSakhi: shgData?.krishiSakhi ? String(shgData.krishiSakhi) : "",

    // --- Training details ---
    basicShgTrainingCompleted: shgData?.basicShgTrainingCompleted ? String(shgData.basicShgTrainingCompleted) : "",

    // --- Bank details ---
    shgBankName: shgData?.shgBankName ? String(shgData.shgBankName) : "",
    shgAccountNumber: shgData?.shgAccountNumber ? String(shgData.shgAccountNumber) : "",
    shgIfsc: shgData?.shgIfsc ? String(shgData.shgIfsc) : "",

    // --- Misc ---
    meansOfVerification: shgData?.meansOfVerification ? String(shgData.meansOfVerification) : "",
  };
}


async function fetchShgData(shgId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "shg_profile", id: shgId };
  const payload = null;
  const shgData = await apiService({ method, url, params, payload });
  console.log("Fetched SHG Data:", shgData);
  if (!shgData) throw new Error("SHG not found");
  return shgData;
}

export default function SHGProfileUpdate() {
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
        const defaults = flatFromMock({},false);
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
      if (name !== "shgId") return;
      const id = typeof vals.shgId === "object"
        ? (vals.shgId?.id ?? vals.shgId?.value ?? vals.shgId?.code ?? null)
        : vals.shgId;
      const shgId = id;
      if (!shgId) return;
      // Optionally show loading indicator here
  
      try {
        show("Loading SHG data — please wait...");
        // Fetch shg data from API
        const shgData = await fetchShgData(shgId);
  
        // Flatten or transform shgData as needed for your form
        // If your API returns flat data, use it directly
        const flat = flatFromMock(shgData,true);

        // IMPORTANT: ensure the selected shg id remains what the user picked
        flat.shgId = shgId;
        // Patch the form with the fetched data
        formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        hide();
      } catch (err) {
        hide();
        enqueue({ message: "Failed to load shg data", severity: "error" });
      }
  
    }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating SHG profile — please wait..." : "Submitting SHG profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "SHG_PROFILE",
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
            message: isUpdate ? "SHG profile updated successfully" : "SHG profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For SHG Profile" : "Submission Successful For SHG Profile",
            form: "SHG Profile",
            body: isUpdate ? "Your SHG profile has been successfully updated." : "Your SHG profile has been successfully created.",
            shgName: response?.data?.data?.shgName || "Unknown",
            reference: response?.data?.data?.shgId || "00XX00",
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
      schema={shgRegistrationSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="shg-registration"
      autosaveMs={800}
      ui={ui}
      validationSchema={shgRegistrationSchema}
      defaultsSchema={shgRegistrationSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
