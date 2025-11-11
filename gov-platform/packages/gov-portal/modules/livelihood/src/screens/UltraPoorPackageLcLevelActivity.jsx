import React from "react";
import { getComponent } from "@gov/core";
import { ultraPoorPackageLcLevelActivitySchema } from "../forms/ultra-poor-package-lc-level-activity.schema";
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


async function fetchData(Id) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "ultra_poor_activity_detail", id: Id };
  const payload = null;
  const shgData = await apiService({ method, url, params, payload });
  console.log("Fetched Ultra Poor Activity Detail Data:", shgData);
  if (!shgData) throw new Error("Ultra Poor Activity Detail not found");
  return shgData;
}

export default function UltraPoorPackageLcLevelActivity() {
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
    const localId = id;
    if (!localId) return;
    // Optionally show loading indicator here

    try {
      show("Loading Ultra Poor Activity Detail for Selected Member — please wait...");
      // Fetch shg data from API
      const responseData = await fetchData(localId);

      // Flatten or transform responseData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(responseData, true);

      // IMPORTANT: ensure the selected local id remains what the user picked
      flat.localId = localId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load ultra poor activity detail", severity: "error" });
    }


  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
      show(isUpdate ? "Updating Ultra Poor LC Level Activity — please wait..." : "Submitting Ultra Poor LC Level Activity — please wait...");
      flatFormData.participantCategory = "LC_MEMBER";
      const payload = {
        module: "LIVELIHOOD_ACTIVITY_UPDATE",
        operation: isUpdate ? "UPDATE" : "CREATE",
        formType: "ULTRAPOOR_ACTIVITY",
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
              message: isUpdate ? "Ultra Poor LC Level Activity updated successfully" : "Ultra Poor LC Level Activity submitted successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: isUpdate ? "Update Successful For Ultra Poor LC Level Activity" : "Submission Successful For Ultra Poor LC Level Activity",
              form: "Ultra Poor LC Level Activity",
              body: isUpdate ? "Your Ultra Poor LC Level Activity has been successfully updated." : "Your Ultra Poor LC Level Activity has been successfully created.",
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
      schema={ultraPoorPackageLcLevelActivitySchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="ultra-poor-package-lc-level-activity"
      autosaveMs={800}
      ui={ui}
      validationSchema={ultraPoorPackageLcLevelActivitySchema}
      defaultsSchema={ultraPoorPackageLcLevelActivitySchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
