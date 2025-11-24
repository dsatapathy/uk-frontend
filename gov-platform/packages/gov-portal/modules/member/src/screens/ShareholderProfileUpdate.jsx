import React from "react";
import { getComponent } from "@gov/core";
import { shareholderProfileSchema } from "../form/shareholder-profile.schema";
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
function flatFromMock(shareholderData, update = false) {
  return {
    // --- Basic action ---
    action: update ? "update" : "create",

    // --- Location hierarchy ---
    district: shareholderData?.district ? Number(shareholderData.district) : "",
    block: shareholderData?.block ? Number(shareholderData.block) : "",
    gp: shareholderData?.gp ? Number(shareholderData.gp) : "",
    village: shareholderData?.village ? Number(shareholderData.village) : "",

    // --- Association hierarchy ---
    clf: shareholderData?.clf ? Number(shareholderData.clf) : "",
    vo: shareholderData?.vo ? Number(shareholderData.vo) : "",
    shg: shareholderData?.shg ? Number(shareholderData.shg) : "",

    // --- Financial Year ---
    financeYear: shareholderData?.financeYear
      ? String(shareholderData.financeYear)
      : "",

    // --- Shareholder details ---
    shareholderName: shareholderData?.shareholderName
      ? String(shareholderData.shareholderName)
      : "",
    shareholderId: shareholderData?.shareholderId
      ? Number(shareholderData.shareholderId)
      : "",

    // --- Contribution details ---
    byShareholderAmount: shareholderData?.byShareholderAmount
      ? String(shareholderData.byShareholderAmount)
      : "",
    byShareholderDate: shareholderData?.byShareholderDate
      ? String(shareholderData.byShareholderDate)
      : "",
    byProjectAmount: shareholderData?.byProjectAmount
      ? String(shareholderData.byProjectAmount)
      : "",
    byProjectDate: shareholderData?.byProjectDate
      ? String(shareholderData.byProjectDate)
      : "",

    // --- Totals ---
    totalByShareholder: shareholderData?.totalByShareholder
      ? String(shareholderData.totalByShareholder)
      : "",
    totalByProject: shareholderData?.totalByProject
      ? String(shareholderData.totalByProject)
      : "",

    // --- Approval status ---
    approved:
      typeof shareholderData?.approved === "boolean"
        ? shareholderData.approved
        : "",
  };
}


async function fetchShareholderData(shareholderNameToUpdateId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "shareholder_profile", id: shareholderNameToUpdateId };
  const payload = null;
  const shareholderData = await apiService({ method, url, params, payload });
  if (!shareholderData) throw new Error("Shareholder not found");
  return shareholderData;
}

export default function ShareholderProfileUpdate() {
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
    if (name !== "shareholderId") return;
    if (name == "shareholderId" && vals.action === "update") {
    const id = typeof vals.shareholderId === "object"
      ? (vals.shareholderId?.id ?? vals.shareholderId?.value ?? vals.shareholderId?.code ?? null)
      : vals.shareholderId;
    const shareholderId = id;
    if (!shareholderId) return;
    // Optionally show loading indicator here

    try {
      show("Loading shareholder data — please wait...");
      // Fetch vo data from API
      const shareholderData = await fetchShareholderData(shareholderId);

      // Flatten or transform voData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(shareholderData, true);

      // IMPORTANT: ensure the selected vo id remains what the user picked
      flat.shareholderId = shareholderId;
      flat.district = vals.district || "";
      flat.block = vals.block || "";
      flat.gp = vals.gp || "";
      flat.clf = vals.clf || "";
      flat.vo = vals.vo || "";
      flat.shg = vals.shg || "";
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load shareholder data", severity: "error" });
    }
  }

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    const flatFormData = vals || formApiRef.current?.getValues?.() || {};
    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating Shareholder profile — please wait..." : "Submitting Shareholder profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "SHAREHOLDER_PROFILE",
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
            message: isUpdate ? "Shareholder profile updated successfully" : "Shareholder profile submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
          // or stay on page — here we redirect with an appropriate heading for both.
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For Shareholder Profile" : "Submission Successful For Shareholder Profile",
            form: "Shareholder Profile",
            body: isUpdate ? "Your Shareholder profile has been successfully updated." : "Your Shareholder profile has been successfully created.",
            shareholderName: response?.data?.data?.shareholderName || "Unknown",
            shareholderId: response?.data?.data?.shareholderId || "00XX00",
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
      schema={shareholderProfileSchema}
      onSubmit={handleSubmit}
      formApiRef={formApiRef}
      entityId="shareholder-profile"
      autosaveMs={800}
      ui={ui}
      validationSchema={shareholderProfileSchema}
      defaultsSchema={shareholderProfileSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
