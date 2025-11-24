import React from "react";
import { getComponent } from "@gov/core";
import { fpoProfileSchema } from "../form/fpo-profile.schema";
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

function flatFromMock(fpoData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: fpoData?.district ? Number(fpoData.district) : "",
    // block: fpoData?.block ? Number(fpoData.block) : "",
    // gp: fpoData?.gp ? Number(fpoData.gp) : "",
    // clf: fpoData?.clf ? Number(fpoData.clf) : "",

    // --- FPO Identification ---
    fpoName: fpoData?.fpoName ? String(fpoData.fpoName) : "",
    fpoId: fpoData?.fpoId ? Number(fpoData.fpoId) : "",
    registrationType: fpoData?.registrationType ? String(fpoData.registrationType) : "",
    yearOfRegistration: fpoData?.yearOfRegistration ? String(fpoData.yearOfRegistration) : "",
    yearTakenInReap: fpoData?.yearTakenInReap ? String(fpoData.yearTakenInReap) : "",
    registrationNumber: fpoData?.registrationNumber ? String(fpoData.registrationNumber) : "",

    // --- Member details ---
    institutionalMembers: fpoData?.institutionalMembers ? String(fpoData.institutionalMembers) : "",

    // --- Bank & Legal details ---
    bankAccountNo: fpoData?.bankAccountNo ? String(fpoData.bankAccountNo) : "",
    ifscCode: fpoData?.ifscCode ? String(fpoData.ifscCode) : "",
    gstNo: fpoData?.gstNo ? String(fpoData.gstNo) : "",
    panNo: fpoData?.panNo ? String(fpoData.panNo) : "",

    // --- President details ---
    presidentName: fpoData?.presidentName ? String(fpoData.presidentName) : "",
    presidentAddress: fpoData?.presidentAddress ? String(fpoData.presidentAddress) : "",
    presidentContact: fpoData?.presidentContact ? String(fpoData.presidentContact) : "",

    // --- Secretary details ---
    secretaryName: fpoData?.secretaryName ? String(fpoData.secretaryName) : "",
    secretaryAddress: fpoData?.secretaryAddress ? String(fpoData.secretaryAddress) : "",
    secretaryContact: fpoData?.secretaryContact ? String(fpoData.secretaryContact) : "",

    // --- Treasurer details ---
    treasurerName: fpoData?.treasurerName ? String(fpoData.treasurerName) : "",
    treasurerAddress: fpoData?.treasurerAddress ? String(fpoData.treasurerAddress) : "",
    treasurerContact: fpoData?.treasurerContact ? String(fpoData.treasurerContact) : "",

    // --- CEO details ---
    ceoName: fpoData?.ceoName ? String(fpoData.ceoName) : "",
    ceoAddress: fpoData?.ceoAddress ? String(fpoData.ceoAddress) : "",
    ceoContact: fpoData?.ceoContact ? String(fpoData.ceoContact) : "",

    // --- Capacity & Resource details ---
    fpoFurniture: fpoData?.fpoFurniture ? String(fpoData.fpoFurniture) : "",
    workingCapital: fpoData?.workingCapital ? String(fpoData.workingCapital) : "",
    governanceTraining: fpoData?.governanceTraining ? String(fpoData.governanceTraining) : "",
    businessTraining: fpoData?.businessTraining ? String(fpoData.businessTraining) : "",
    staffRecruited: fpoData?.staffRecruited ? String(fpoData.staffRecruited) : "",
  };
}




async function fetchFPOData(fpoUpdateId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "fpo_profile", id: fpoUpdateId };
  const payload = null;
  const fpoData = await apiService({ method, url, params, payload });
  if (!fpoData) throw new Error("FPO not found");
  return fpoData;
}
export default function FPOProfileUpdate() {
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
    if (name !== "fpoId") return;
    if (name == "fpoId" && vals.action === "update") {
      const id = typeof vals.fpoId === "object"
        ? (vals.fpoId?.id ?? vals.fpoId?.value ?? vals.fpoId?.code ?? null)
        : vals.fpoId;
      const fpoId = id;
      if (!fpoId) return;
      // Optionally show loading indicator here

      try {
        show("Loading FPO data — please wait...");
        // Fetch vo data from API
        const fpoData = await fetchFPOData(fpoId);

        // Flatten or transform voData as needed for your form
        // If your API returns flat data, use it directly
        const flat = flatFromMock(fpoData, true);

        // IMPORTANT: ensure the selected vo id remains what the user picked
        flat.fpoId = fpoId;
        // Patch the form with the fetched data
        formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        hide();
      } catch (err) {
        hide();
        enqueue({ message: "Failed to load FPO data", severity: "error" });
      }
    }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating FPO profile — please wait..." : "Submitting FPO profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "FPO_PROFILE_MAPPING",
      formData: flatFormData,
    };
    const Url = "v1/reap/operations";
    const method = "post";
    // API Simulation: wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));
    submitMutation.mutate(
      { method, url: Url, payload },
      {
        onSuccess: (response) => {
          hide();
          enqueue({
            message: isUpdate ? "FPO profile updated successfully" : "FPO profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For FPO Profile" : "Submission Successful For FPO Profile",
            form: "FPO Profile",
            body: isUpdate ? "Your FPO profile has been successfully updated." : "Your FPO profile has been successfully created.",
            fpoName: response?.data?.data?.fpoName || "Unknown",
            reference: response?.data?.data?.fpoId || "00XX00",
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
      schema={fpoProfileSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="fpo-profile"
      autosaveMs={800}
      ui={ui}
      validationSchema={fpoProfileSchema}
      defaultsSchema={fpoProfileSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
