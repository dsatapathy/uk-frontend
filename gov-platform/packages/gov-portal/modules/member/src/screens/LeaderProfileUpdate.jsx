import React from "react";
import { getComponent } from "@gov/core";
import { leaderProfileSchema } from "../form/leader-profile.schema";
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

function flatFromMock(leaderData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: leaderData?.district ? Number(leaderData.district) : "",
    block: leaderData?.block ? Number(leaderData.block) : "",

    // --- CLF/LC Reference ---
    clfLc: leaderData?.clfLc ? Number(leaderData.clfLc) : "",

    // --- Leader Identification ---
    presidentName: leaderData?.presidentName ? String(leaderData.presidentName) : "",
    presidentNameId: leaderData?.presidentNameId ? Number(leaderData.presidentNameId) : "",

    // --- Registration details ---
    yearOfRegistration: leaderData?.yearOfRegistration
      ? String(leaderData.yearOfRegistration)
      : "",
    registrationNumber: leaderData?.registrationNumber
      ? String(leaderData.registrationNumber)
      : "",
    yearTakenInReap: leaderData?.yearTakenInReap
      ? String(leaderData.yearTakenInReap)
      : "",

    // --- Contact & Address ---
    address: leaderData?.address ? String(leaderData.address) : "",
    contactNo: leaderData?.contactNo ? String(leaderData.contactNo) : "",

    // --- Role details ---
    designation: leaderData?.designation ? String(leaderData.designation) : "",
    dateElected: leaderData?.dateElected ? String(leaderData.dateElected) : "",

    // --- Demographic details ---
    socialCategory: leaderData?.socialCategory ? String(leaderData.socialCategory) : "",
    economicCategory: leaderData?.economicCategory ? String(leaderData.economicCategory) : "",
    gender: leaderData?.gender ? String(leaderData.gender) : "",
    dob: leaderData?.dob ? String(leaderData.dob) : "",
    seccCriteria: leaderData?.seccCriteria ? String(leaderData.seccCriteria) : "",
  };
}



async function fetchLeaderData(presidentNameToUpdateId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "leader_profile", id: presidentNameToUpdateId };
  const payload = null;
  const leaderData = await apiService({ method, url, params, payload });
  if (!leaderData) throw new Error("Leader not found");
  return leaderData;
}

export default function LeaderProfileUpdate() {
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
    if (name !== "presidentNameId") return;
    const id = typeof vals.presidentNameId === "object"
      ? (vals.presidentNameId?.id ?? vals.presidentNameId?.value ?? vals.presidentNameId?.code ?? null)
      : vals.presidentNameId ;
    const presidentNameId = id;
    if (!presidentNameId) return;
    // Optionally show loading indicator here

    try {
      show("Loading leader data — please wait...");
      // Fetch vo data from API
      const leaderData = await fetchLeaderData(presidentNameId);

      // Flatten or transform voData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(leaderData, true);

      // IMPORTANT: ensure the selected vo id remains what the user picked
      flat.presidentNameId = presidentNameId;
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
    show(isUpdate ? "Updating Leader profile — please wait..." : "Submitting Leader profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "REPRESENTATIVE_PROFILE",
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
            message: isUpdate ? "Leader profile updated successfully" : "Leader profile submitted successfully",
            severity: "success",
            duration: 6000,
          });

          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For Leader Profile" : "Submission Successful For Leader Profile",
            form: "Leader Profile",
            body: isUpdate ? "Your Leader profile has been successfully updated." : "Your Leader profile has been successfully created.",
            leaderName: response?.data?.data?.presidentName || "Unknown",
            reference: response?.data?.data?.presidentNameId || "00XX00",
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
      schema={leaderProfileSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      entityId="leader-profile"
      autosaveMs={800}
      ui={ui}
      validationSchema={leaderProfileSchema}
      defaultsSchema={leaderProfileSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
