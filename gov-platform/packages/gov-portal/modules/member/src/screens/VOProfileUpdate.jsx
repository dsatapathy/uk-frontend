import React from "react";
import { getComponent } from "@gov/core";
import { voRegistrationFormSchema } from "../form/vo-registration.schema";
import { useSubmitData } from "@gov/data";
import { useSnackbar } from "../../../../library/src/atoms/Snackbar";
import { useLoader } from "../../../../library/src/atoms/Loader";
import {apiService} from "@gov/data";

const ui = {
  padding: 2,
  grid: {
    cols:{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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
function flatFromMock(voData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: voData?.district ? Number(voData.district) : "",
    block: voData?.block ? Number(voData.block) : "",
    gp: voData?.gp ? Number(voData.gp) : "",

    // --- Association ---
    clf: voData?.clf ? Number(voData.clf) : "",

    // --- VO identification ---
    vo: voData?.vo ? String(voData.vo) : "",
    voNameToUpdate: voData?.voNameToUpdate ? Number(voData.voNameToUpdate) : "",
    vo_registration_code: voData?.vo_registration_code
      ? String(voData.vo_registration_code)
      : "",
    date_of_registration: voData?.date_of_registration
      ? String(voData.date_of_registration)
      : "",

    // --- Basic details ---
    address: voData?.address ? String(voData.address) : "",
    shg_mapped: voData?.shg_mapped ? String(voData.shg_mapped) : "",
    members_in_ec_committee: voData?.members_in_ec_committee
      ? String(voData.members_in_ec_committee)
      : "",

    // --- Committees & funds (normalize yes/no) ---
    monitoring_committee_formed: voData?.monitoring_committee_formed
      ? String(voData.monitoring_committee_formed).toLowerCase() === "yes"
        ? "Yes"
        : "No"
      : "",
    livelihood_committee_formation: voData?.livelihood_committee_formation
      ? String(voData.livelihood_committee_formation).toLowerCase() === "yes"
        ? "Yes"
        : "No"
      : "",
    seed_revolving_fund_received: voData?.seed_revolving_fund_received
      ? String(voData.seed_revolving_fund_received).toLowerCase() === "yes"
        ? "Yes"
        : "No"
      : "",
    seed_revolving_fund_receiving_date: voData?.seed_revolving_fund_receiving_date
      ? String(voData.seed_revolving_fund_receiving_date)
      : "",
    seed_revolving_fund_utilised: voData?.seed_revolving_fund_utilised
      ? String(voData.seed_revolving_fund_utilised).toLowerCase() === "yes"
        ? "Yes"
        : "No"
      : "",
    storage_for_drudgery_reduction_tools: voData?.storage_for_drudgery_reduction_tools
      ? String(voData.storage_for_drudgery_reduction_tools).toLowerCase() === "yes"
        ? "Yes"
        : "No"
      : "",

    // --- Bank details ---
    vo_bank_name: voData?.vo_bank_name ? String(voData.vo_bank_name) : "",
    vo_account_no: voData?.vo_account_no ? String(voData.vo_account_no) : "",
    vo_ifsc_code: voData?.vo_ifsc_code ? String(voData.vo_ifsc_code) : "",

    // --- Documents (only ID/name retained, skip file blob) ---
    means_of_verification: voData?.means_of_verification
      ? {
          id: voData.means_of_verification.id || "Ankit",
          name: voData.means_of_verification.name || "Testing.pdf",
          size: voData.means_of_verification.size || "12345",
        }
      : "",
  };
}


async function fetchVoData(voId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "vo", id: voId };
  const payload = null;
  const voData = await apiService({ method, url, params, payload });
  if (!voData) throw new Error("VO not found");
  return voData;
}

export default function VOProfileUpdate() {
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
        if (name !== "voId") return;
        const id = typeof vals.voId === "object"
          ? (vals.voId?.id ?? vals.voId?.value ?? vals.voId?.code ?? null)
          : vals.voId;
        const voIdToUpdate = id;
        if (!voIdToUpdate) return;
        // Optionally show loading indicator here
    
        try {
          // Fetch vo data from API
          const voData = await fetchVoData(voIdToUpdate);

          // Flatten or transform voData as needed for your form
          // If your API returns flat data, use it directly
          const flat = flatFromMock(voData,true);

          // IMPORTANT: ensure the selected vo id remains what the user picked
          flat.voId = voIdToUpdate;
          // Patch the form with the fetched data
          formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
        } catch (err) {
          enqueue({ message: "Failed to load vo data", severity: "error" });
        }
    
      }, []);
    // Handler for form submit
    const handleSubmit = async (vals) => {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
      show(isUpdate ? "Updating VO profile — please wait..." : "Submitting VO profile — please wait...");
      const payload = {
        module: "USER_DATA_UPDATE",
        operation: isUpdate ? "UPDATE" : "CREATE",
        formType: "VO_PROFILE",
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
              message: isUpdate ? "VO profile updated successfully" : "VO profile submitted successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: isUpdate ? "Update Successful For VO Profile" : "Submission Successful For VO Profile",
              form: "VO Profile",
              body: isUpdate ? "Your VO profile has been successfully updated." : "Your VO profile has been successfully created.",
              voName: response?.data?.data?.vo || "Unknown",
              voId: response?.data?.data?.voId   || "00XX00",
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
      schema={voRegistrationFormSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      entityId="vo-registration"
      autosaveMs={800}
      ui={ui}
      validationSchema={voRegistrationFormSchema}
      defaultsSchema={voRegistrationFormSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
