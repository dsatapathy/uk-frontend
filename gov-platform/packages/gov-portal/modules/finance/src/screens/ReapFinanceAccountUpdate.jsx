import React from "react";
import { getComponent } from "@gov/core";
import { reapFinanceAccountUpdateSchema } from "../forms/reap-finance-account-update.schema";
import { useSubmitData } from "@gov/data";
import { useSnackbar } from "@gov/library";
import { useLoader } from "@gov/library";

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

const payloadHandler = async (flatFormData) => {
  switch (flatFormData.modeOfSelector) {
    case "DEBIT_CREDIT_ADVICE":  
    // process payload for Debit Credit Advice
    return {
      modeOfSelector: flatFormData.modeOfSelector||"",
      office: flatFormData.dc_office||"",
      financialYear: flatFormData.dc_financialYear||"",
      issueNo: flatFormData.dc_adviceIssueNo||"",
      particulars: flatFormData.dc_particulars||"",
      amount: flatFormData.dc_amount||"",
      tallyByDmu: flatFormData.dc_tallyEntryDMU||"",
      tallyByPmu: flatFormData.dc_tallyEntryPMU||"",
      document: flatFormData.dc_uploadAdvice||{},
    };
    case "FIXED_ASSETS_REGISTER":
    // process payload for Fixed Asset Details
    return {
      modeOfSelector: flatFormData.modeOfSelector||"",
      category: flatFormData.fa_category||"",
      office: flatFormData.fa_office||"",
      assetName: flatFormData.fa_assetName||"",
      financialYear: flatFormData.fa_financialYear||"",
      month: flatFormData.fa_financialMonth||"",
      dateOfPurchase: flatFormData.fa_dateOfPurchase||"",
      supplierName: flatFormData.fa_supplierName||"",
      perItemAmount: flatFormData.fa_perItemAmount||"",
      assetIssueTo: flatFormData.fa_assetIssueTo||"",
      productId: flatFormData.fa_productId||"",
      assetProcuredBy: flatFormData.fa_assetProcuredBy||"",
      remarks: flatFormData.fa_remarks||"",
      document: flatFormData.fa_billCopyUpload||{},
    };
    case "APPROVAL_FOR_EXPENDITURE":
    // process payload for Approval Details
    return {
      modeOfSelector: flatFormData.modeOfSelector||"",
      office: flatFormData.ap_office||"",
      financialYear: flatFormData.ap_financialYear||"",
      month: flatFormData.ap_financialMonth||"",
      dateOfPayment: flatFormData.ap_dateOfPayment||"",
      particulars: flatFormData.ap_particulars||"",
      amount: flatFormData.ap_amount||"",
      approvedBy: flatFormData.ap_approvedBy||"",
      document: flatFormData.ap_uploadApprovedDocument||{},
    };
    case "BANK_RECONCILIATION":
    // process payload for Bank Reconciliation Detail
    return {
      modeOfSelector: flatFormData.modeOfSelector||"",
      office: flatFormData.br_office||"",
      financialYear: flatFormData.br_financialYear||"",
      month: flatFormData.br_monthOfBRS||"",
      document: flatFormData.br_uploadBRSFile||{},
    };
    default:
      return flatFormData;
  }
}
export default function ReapFinanceAccountUpdate() {
  const DynamicForm = getComponent("DynamicForm");
  const formApiRef = React.useRef(null);
  const submitMutation = useSubmitData();
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;

  }, []);
  // Handler for form submit
  const handleSubmit = async (vals) => {
    try {
      const flatFormData = vals || formApiRef.current?.getValues?.() || {};
      const formPayload = await payloadHandler(flatFormData);
      show("Adding Reap Finance Account Update Activity...");
      const payload = {
        module: "FINANCE_DATA_UPDATE",
        operation: "CREATE",
        formType: "REAP_ACCOUNTS_UPDATE",
        formData: formPayload,
      };
      const Url = "v1/reap/operations";
      const method = "post";
      submitMutation.mutate(
        { method, url: Url, payload },
        {
          onSuccess: (response) => {
            hide();
            enqueue({
              message: "Reap Finance Account Update successfully.",
              severity: "success",
              duration: 6000,
            });
            console.log("SUBMIT SUCCESS", response);
            // redirect to acknowledgement page for CREATE; for UPDATE you can either redirect
            // or stay on page — here we redirect with an appropriate heading for both.
            const params = new URLSearchParams({
              status: "success",
              heading: "Submission Successful For Reap Finance Account Update",
              form: "Reap Finance Account Update",
              body: "Your Reap Finance Account Update has been successfully created.",
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
      schema={reapFinanceAccountUpdateSchema}
      formApiRef={formApiRef}
      onSubmit={handleSubmit}
      entityId="reap-finance-account-update"
      autosaveMs={800}
      ui={ui}
      validationSchema={reapFinanceAccountUpdateSchema}
      defaultsSchema={reapFinanceAccountUpdateSchema}
      output="flat"
      onValuesChange={handleValuesChange}
    />
  );
}
