import React from "react";
import { getComponent } from "@gov/core";
import { ultraPoorPackageOutcomeLcLevelActivitySchema } from "../forms/ultrapoor-package-outcome-lc-level.schema";
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
function flatFromMock(data) {
  return {
    // --- Location hierarchy ---
    districtId: data?.districtId ? Number(data.districtId) : "",
    blockId: data?.blockId ? Number(data.blockId) : "",
    panchayatId: data?.panchayatId ? Number(data.panchayatId) : "",
    villageId: data?.villageId ? Number(data.villageId) : "",

    // --- LC details ---
    lcId: data?.lcId ? Number(data.lcId) : "",
    lcAddress: data?.lcAddress ? String(data.lcAddress) : "",

    // --- Member details ---
    memberId: data?.memberId ? Number(data.memberId) : "",

    // --- Activity details ---
    proposedActivity: data?.proposedActivity ? String(data.proposedActivity) : "",
    financeYear: data?.financeYear ? String(data.financeYear) : "",
    frequency: data?.frequency ? String(data.frequency) : "",
    financeMonth: data?.financeMonth ? String(data.financeMonth) : "",
    dataEntryHeader: data?.dataEntryHeader ? String(data.dataEntryHeader) : "",

    // --- Product details ---
    productName: data?.productName ? String(data.productName) : "",
    productUnit: data?.productUnit ? String(data.productUnit) : "",
    totalProduction: data?.totalProduction ? String(data.totalProduction) : "",
    totalProductPrice: data?.totalProductPrice ? String(data.totalProductPrice) : "",
    typeOfConsuming: data?.typeOfConsuming ? String(data.typeOfConsuming) : "",
    pricePerUnit: data?.pricePerUnit ? String(data.pricePerUnit) : "",
    totalProductSale: data?.totalProductSale ? String(data.totalProductSale) : "",
    expenditure: data?.expenditure ? String(data.expenditure) : "",
    incomeBeneficiary: data?.incomeBeneficiary ? String(data.incomeBeneficiary) : "",
    totalProductionValue: data?.totalProductionValue ? String(data.totalProductionValue) : "",

    // --- Cost details ---
    costDetailsSection: data?.costDetailsSection ? String(data.costDetailsSection) : "",
    benefContribution: data?.benefContribution ? String(data.benefContribution) : "",
    projectSupport: data?.projectSupport ? String(data.projectSupport) : "",
    convergence: data?.convergence ? String(data.convergence) : "",
    bank: data?.bank ? String(data.bank) : "",
    totalCost: data?.totalCost ? String(data.totalCost) : "",

    // --- Fund details ---
    fundReceivedDetailsSection: data?.fundReceivedDetailsSection ? String(data.fundReceivedDetailsSection) : "",
    fundRecievedDate: data?.fundRecievedDate ? String(data.fundRecievedDate) : "",
    fundBenefContribution: data?.fundBenefContribution ? String(data.fundBenefContribution) : "",
    fundProjectSupport: data?.fundProjectSupport ? String(data.fundProjectSupport) : "",
    fundConvergence: data?.fundConvergence ? String(data.fundConvergence) : "",
    fundBank: data?.fundBank ? String(data.fundBank) : "",
    fundTotalCost: data?.fundTotalCost ? String(data.fundTotalCost) : "",

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

export default function UltraPoorPackageOutcomeLcLevelActivity() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;
    if (name !== "memberId") return;
    const id = typeof vals.memberId === "object"
      ? (vals.memberId?.id ?? vals.memberId?.value ?? vals.memberId?.code ?? null)
      : vals.memberId;
    const memberId = id;
    if (!memberId) return;
    // Optionally show loading indicator here

    try {
      show("Loading Ultra Poor Activity Detail for Selected Member — please wait...");
      // Fetch shg data from API
      const responseData = await fetchData(memberId);

      // Flatten or transform responseData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(responseData);

      // IMPORTANT: ensure the selected member id remains what the user picked
      flat.memberId = memberId;
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
      const flatFormData =  formApiRef.current?.getValues?.() || vals || {};

      show("Updating Ultra Poor Activity Outcome — please wait...");
      flatFormData.participantCategory = "LC_MEMBER";
      const payload = {
        module: "LIVELIHOOD_ACTIVITY_UPDATE",
        operation: "CREATE",
        formType: "ULTRAPOOR_LIVELIHOOD_OUTCOME",
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
              message: "Ultra Poor Activity Outcome for LC Level updated successfully",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: "Update Successful For Ultra Poor Activity Outcome Lc Level",
              form: "Ultra Poor Activity Outcome",
              body: "Your Ultra Poor Activity Outcome for Lc level has been successfully updated.",
              reference: response?.data?.data?.localId || response?.data?.localId || "00XX00",
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
      schema={ultraPoorPackageOutcomeLcLevelActivitySchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="ultra-poor-package-outcome-lc-level-activity"
      autosaveMs={800}
      ui={ui}
      validationSchema={ultraPoorPackageOutcomeLcLevelActivitySchema}
      defaultsSchema={ultraPoorPackageOutcomeLcLevelActivitySchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
