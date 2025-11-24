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
function flatFromMock(data, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy (convert to numbers) ---
    districtId: data?.districtId ? Number(data.districtId) : "",
    blockId: data?.blockId ? Number(data.blockId) : "",
    panchayatId: data?.panchayatId ? Number(data.panchayatId) : "",
    villageId: data?.villageId ? Number(data.villageId) : "",

    // --- LC details ---
    lcId: data?.lcId ? Number(data.lcId) : "",
    lcAddress: data?.lcAddress ? String(data.lcAddress) : "",

    // --- Member details ---
    memberName: data?.memberName ? String(data.memberName) : "",
    mobileNo: data?.mobileNo ? String(data.mobileNo) : "",
    fatherOrHusband: data?.fatherOrHusband ? String(data.fatherOrHusband) : "",
    socialCategory: data?.socialCategory ? String(data.socialCategory) : "",
    pwd: data?.pwd ? String(data.pwd) : "",
    widow: data?.widow ? String(data.widow) : "",

    // --- Activity details ---
    currentActivity: data?.currentActivity ? String(data.currentActivity) : "",
    noCurrentActivity: data?.noCurrentActivity ? String(data.noCurrentActivity) : "",
    proposedActivity: data?.proposedActivity ? String(data.proposedActivity) : "",
    noOfProposedActivity: data?.noOfProposedActivity ? String(data.noOfProposedActivity) : "",
    financeYear: data?.financeYear ? String(data.financeYear) : "",

    // --- Project cost details ---
    benefContribution: data?.benefContribution ? String(data.benefContribution) : "",
    projectSupport: data?.projectSupport ? String(data.projectSupport) : "",
    convergence: data?.convergence ? String(data.convergence) : "",
    bank: data?.bank ? String(data.bank) : "",
    totalCost: data?.totalCost ? String(data.totalCost) : "",

    // --- Fund details ---
    fundRecievedDate: data?.fundRecievedDate ? String(data.fundRecievedDate) : "",
    fundBenefContribution: data?.fundBenefContribution ? String(data.fundBenefContribution) : "",
    fundProjectSupport: data?.fundProjectSupport ? String(data.fundProjectSupport) : "",
    fundConvergence: data?.fundConvergence ? String(data.fundConvergence) : "",
    fundBank: data?.fundBank ? String(data.fundBank) : "",
    fundTotalCost: data?.fundTotalCost ? String(data.fundTotalCost) : "",

    // --- Status details ---
    statusOfActivity: data?.statusOfActivity ? String(data.statusOfActivity) : "",

    // --- Uploaded files ---
    uploadImagesOfActivity: data?.uploadImagesOfActivity
      ? {
          id: data.uploadImagesOfActivity.id || "",
          name: data.uploadImagesOfActivity.name || "",
          size: data.uploadImagesOfActivity.size || "",
        }
      : {},

    meansOfVerification: data?.meansOfVerification
      ? {
          id: data.meansOfVerification.id || "",
          name: data.meansOfVerification.name || "",
          size: data.meansOfVerification.size || "",
        }
      : {},

    uploadUppIlipDocs: data?.uploadUppIlipDocs
      ? {
          id: data.uploadUppIlipDocs.id || "",
          name: data.uploadUppIlipDocs.name || "",
          size: data.uploadUppIlipDocs.size || "",
        }
      : {},

    // --- Category ---
    participantCategory: data?.participantCategory ? String(data.participantCategory) : "",
  };
}


async function fetchData(Id) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "ultra_poor_activity_detail", id: Id };
  const payload = null;
  let response = await apiService({ method, url, params, payload });
  console.log("Fetched Ultra Poor Activity Detail Data:", response);
  response = response[0];
  if (!response) throw new Error("Ultra Poor Activity Detail not found");
  return response;
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
      const flatFormData = formApiRef.current?.getValues?.() || vals || {};
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
