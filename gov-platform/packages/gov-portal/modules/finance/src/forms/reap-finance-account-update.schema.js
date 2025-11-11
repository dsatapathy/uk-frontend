export const reapFinanceAccountUpdateSchema = {
    $schema: "fe.v1",
    id: "reap-finance-account-update-form",
    version: "1.0.0",
    title: "REAP Finance Account Update",
    sections: [
        {
            id: "reap-finance-account-update-details",
            title: "Finance Account Update Details",
            fields: [
                /* --- Form Type --- */
                {
                    id: "modeOfSelector",
                    type: "dropdown",
                    label: "Task Type",
                    options: {
                        labelKey: "label",
                        valueKey: "value",
                        items: [
                            { label: "Debit Credit Advice", value: "DEBIT_CREDIT_ADVICE" },
                            { label: "Fixed Asset Details", value: "FIXED_ASSETS_REGISTER" },
                            { label: "Approval Details", value: "APPROVAL_FOR_EXPENDITURE" },
                            { label: "Bank Reconciliation Detail", value: "BANK_RECONCILIATION" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    props: { placeholder: "Select the task to be done" },
                    grid: { span: { xs: 12 } },
                },

                // ==========================================================
                // "Debit Credit Advice" Fields
                // ==========================================================
                {
                    id: "dc_office",
                    type: "dropdown",
                    label: "Office",
                    options: {
                        items: [
                            { label: "PMU", value: "pmu" },
                            { label: "DMU", value: "dmu" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Select Office" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_financialYear",
                    type: "autocomplete",
                    label: "Financial Year",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "financial_year" },
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Select Financial Year" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_adviceIssueNo",
                    type: "text",
                    label: "Debit/Credit Advice Issue No.",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Enter Debit/Credit Advice Issue No." },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_particulars",
                    type: "text",
                    label: "Particulars",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Enter Particulars" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_amount",
                    type: "text",
                    label: "Amount (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter valid amount" },
                    ],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Enter Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_tallyEntryDMU",
                    type: "text",
                    label: "Tally Entry by DMU",
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Enter Tally Entry by DMU" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_tallyEntryPMU",
                    type: "text",
                    label: "Tally Entry by PMU",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    props: { placeholder: "Enter Tally Entry by PMU" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dc_uploadAdvice",
                    type: "file",
                    label: "Upload Debit/Credit Advice",
                    props: { accept: ".pdf,image/*" },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                // ==========================================================
                // "Fixed Asset Details" Fields
                // ==========================================================
                {
                    id: "fa_category",
                    type: "dropdown",
                    label: "Category (Individual/Multiple)",
                    options: {
                        items: [
                            { label: "Individual", value: "individual" },
                            { label: "Multiple", value: "multiple" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Category" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_office",
                    type: "dropdown",
                    label: "Office",
                    options: {
                        items: [
                            { label: "District Level", value: "district" },
                            { label: "Block Level", value: "block" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Office" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_assetName",
                    type: "text",
                    label: "Asset Name",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Asset Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_financialYear",
                    type: "autocomplete",
                    label: "Financial Year",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "financial_year" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Financial Year" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_financialMonth",
                    type: "autocomplete",
                    label: "Financial Month",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "months" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Financial Month" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_dateOfPurchase",
                    type: "date",
                    label: "Date of Purchase",
                    props: { format: "DD/MM/YYYY" },
                    config: { disableFuture: true },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Date of Purchase" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_supplierName",
                    type: "text",
                    label: "Supplier Name",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Supplier Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_perItemAmount",
                    type: "text",
                    label: "Per Item Amount (₹)",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Per Item Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_billCopyUpload",
                    type: "file",
                    label: "Bill Copy Upload",
                    props: { accept: ".pdf,image/*" },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Upload Bill Copy" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_assetIssueTo",
                    type: "text",
                    label: "Asset Issue To",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Asset Issue To" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_productId",
                    type: "text",
                    label: "Product ID",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Product ID" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_assetProcuredBy",
                    type: "dropdown",
                    label: "Asset Procured By",
                    options: {
                        items: [
                            { label: "PMU", value: "pmu" },
                            { label: "DMU", value: "dmu" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Select Asset Procured By" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fa_remarks",
                    type: "textarea",
                    label: "Remarks",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
                    props: { placeholder: "Enter Remarks" },
                    grid: { span: { xs: 12 } },
                },

                // ==========================================================
                // "Approval Details" Fields
                // ==========================================================
                {
                    id: "ap_office",
                    type: "dropdown",
                    label: "Office",
                    options: {
                        items: [
                            { label: "PMU", value: "pmu" },
                            { label: "DMU", value: "dmu" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Select Office" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_financialYear",
                    type: "autocomplete",
                    label: "Financial Year",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "financial_year" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Select Financial Year" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_financialMonth",
                    type: "autocomplete",
                    label: "Financial Month",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "months" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Select Financial Month" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_dateOfPayment",
                    type: "date",
                    label: "Date of Payment",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Select Date of Payment" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_particulars",
                    type: "text",
                    label: "Particulars",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Enter Particulars" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_amount",
                    type: "text",
                    label: "Amount (₹)",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Enter Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_approvedBy",
                    type: "text",
                    label: "Approved By",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    props: { placeholder: "Enter Approved By" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ap_uploadApprovedDocument",
                    type: "file",
                    label: "Upload Approved Document",
                    props: { accept: ".pdf,image/*" },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                // ==========================================================
                // "Bank Reconciliation Detail" Fields
                // ==========================================================
                {
                    id: "br_office",
                    type: "dropdown",
                    label: "Office",
                    options: {
                        items: [
                            { label: "PMU", value: "pmu" },
                            { label: "DMU - District Level", value: "dmu_district" },
                            { label: "Other Districts", value: "other_districts" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
                    props: { placeholder: "Select Office" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "br_financialYear",
                    type: "autocomplete",
                    label: "Financial Year",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "financial_year" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
                    props: { placeholder: "Select Financial Year" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "br_monthOfBRS",
                    type: "autocomplete",
                    label: "Month of BRS",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "months" },
                        labelKey: "label",
                        valueKey: "value",
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
                    props: { placeholder: "Select Month of BRS" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "br_uploadBRSFile",
                    type: "file",
                    label: "Upload BRS with Bank Passbook Copy",
                    props: { accept: ".pdf,image/*" },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};

// export const reapFinanceAccountUpdateSchema = {
//     $schema: "fe.v1",
//     id: "reap-finance-account-update-form",
//     version: "1.0.0",
//     title: "REAP Finance Account Update",
//     sections: [
//         {
//             id: "reap-finance-account-update-details",
//             title: "Finance Account Update Details",
//             fields: [
//                 /* --- Form Type --- */
//                 {
//                     id: "modeOfSelector",
//                     type: "dropdown",
//                     label: "Choose Form Type",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "Debit Credit Advice", value: "DEBIT_CREDIT_ADVICE" },
//                             { label: "Fixed Asset Details", value: "FIXED_ASSETS_REGISTER" },
//                             { label: "Approval Details", value: "APPROVAL_FOR_EXPENDITURE" },
//                             { label: "Bank Reconciliation Detail", value: "BANK_RECONCILIATION" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     grid: { span: { xs: 12, sm: 12, md: 12 } },
//                 },

//                 // ==========================================================
//                 // below fields are shown when "Debit Credit Advice" is selected
//                 // =====================================================
//                 /* --- Office Selection --- */
//                 {
//                     id: "office",
//                     type: "dropdown",
//                     label: "Office",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "PMU", value: "pmu" },
//                             { label: "DMU", value: "dmu" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Financial Year --- */
//                 {
//                     id: "financialYear",
//                     type: "autocomplete",
//                     label: "Financial Year",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "financial_year" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Debit/Credit Advice --- */
//                 {
//                     id: "adviceIssueNo",
//                     type: "text",
//                     label: "Debit/Credit Advice Issue No.",
//                     placeholder: "Enter unique identification number for issued advice",
//                     validations: [
//                         { type: "required" },
//                         { type: "maxLength", value: 50 },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Transaction Particulars --- */
//                 {
//                     id: "particulars",
//                     type: "text",
//                     label: "Particulars",
//                     placeholder: "Enter transaction details or purpose",
//                     validations: [
//                         { type: "required" },
//                         { type: "maxLength", value: 200 },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Amount --- */
//                 {
//                     id: "amount",
//                     type: "text",
//                     label: "Amount (₹)",
//                     placeholder: "Enter total amount (in INR)",
//                     validations: [
//                         { type: "required" },
//                         { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter valid amount" },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Tally Entry References --- */
//                 {
//                     id: "tallyEntryDMU",
//                     type: "text",
//                     label: "Tally Books of Account Entry by DMU",
//                     placeholder: "Enter Tally voucher number (if available)",
//                     validations: [{ type: "maxLength", value: 50 }],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 {
//                     id: "tallyEntryPMU",
//                     type: "text",
//                     label: "Tally Books of Account Entry by PMU",
//                     placeholder: "Enter Tally voucher number at PMU level",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- File Upload --- */
//                 {
//                     id: "uploadAdvice",
//                     type: "file",
//                     label: "Upload Debit/Credit Advice",
//                     props: {
//                         accept: ".pdf,image/*",
//                         maxFiles: 2,
//                         maxSizeMB: 5,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'DEBIT_CREDIT_ADVICE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 // ==========================================================
//                 // below fields are shown when "Fixed Asset Details" is selected
//                 // =====================================================

//                 /* --- Category Selection --- */
//                 {
//                     id: "category",
//                     type: "dropdown",
//                     label: "Category (Individual/Multiple)",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "Individual", value: "individual" },
//                             { label: "Multiple", value: "multiple" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Office Selection --- */
//                 {
//                     id: "office",
//                     type: "dropdown",
//                     label: "Office",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "District Level", value: "district" },
//                             { label: "Block Level", value: "block" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Asset Information --- */
//                 {
//                     id: "assetName",
//                     type: "text",
//                     label: "Asset Name",
//                     placeholder: "Enter asset name (e.g., Laptop, Printer, Projector)",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Financial Year and Month --- */
//                 {
//                     id: "financialYear",
//                     type: "autocomplete",
//                     label: "Financial Year",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "financial_year" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 {
//                     id: "financialMonth",
//                     type: "autocomplete",
//                     label: "Financial Month",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "months" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Purchase Details --- */
//                 {
//                     id: "dateOfPurchase",
//                     type: "date",
//                     label: "Date of Purchase",
//                     props: { format: "DD/MM/YYYY" },
//                     config: {
//                         valueKind: "iso",
//                         outputFormat: "YYYY-MM-DD",
//                         disableFuture: true,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 {
//                     id: "supplierName",
//                     type: "text",
//                     label: "Supplier Name",
//                     placeholder: "Enter supplier or vendor name",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 {
//                     id: "perItemAmount",
//                     type: "text",
//                     label: "Per Item Amount (₹)",
//                     placeholder: "Enter cost per item in INR",
//                     validations: [
//                         { type: "required" },
//                         { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter valid amount" },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- File Upload --- */
//                 {
//                     id: "billCopyUpload",
//                     type: "file",
//                     label: "Bill Copy Upload",
//                     props: {
//                         accept: ".pdf,image/*",
//                         maxFiles: 2,
//                         maxSizeMB: 5,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Asset Ownership Details --- */
//                 {
//                     id: "assetIssueTo",
//                     type: "text",
//                     label: "Asset Issue To",
//                     placeholder: "Enter name or designation of person/office",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 {
//                     id: "productId",
//                     type: "text",
//                     label: "Product ID",
//                     placeholder: "Enter serial number or unique asset code",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Procurement Information --- */
//                 {
//                     id: "assetProcuredBy",
//                     type: "dropdown",
//                     label: "Asset Procured By",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "PMU", value: "pmu" },
//                             { label: "DMU", value: "dmu" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Remarks --- */
//                 {
//                     id: "remarks",
//                     type: "textarea",
//                     label: "Remarks",
//                     placeholder: "Enter additional details or notes about the asset",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'FIXED_ASSETS_REGISTER'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 // ==========================================================
//                 // below fields are shown when "Approval Details" is selected
//                 // =====================================================
//                 /* --- Approval Information --- */
//                 /* --- Office Selection --- */
//                 {
//                     id: "office",
//                     type: "dropdown",
//                     label: "Office",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "PMU", value: "pmu" },
//                             { label: "DMU", value: "dmu" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Financial Year --- */
//                 {
//                     id: "financialYear",
//                     type: "autocomplete",
//                     label: "Financial Year",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "financial_year" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Financial Month --- */
//                 {
//                     id: "financialMonth",
//                     type: "autocomplete",
//                     label: "Financial Month",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "months" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Date of Payment --- */
//                 {
//                     id: "dateOfPayment",
//                     type: "date",
//                     label: "Date of Payment",
//                     props: { format: "DD/MM/YYYY" },
//                     config: {
//                         valueKind: "iso",
//                         outputFormat: "YYYY-MM-DD",
//                         disableFuture: true,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Payment Particulars --- */
//                 {
//                     id: "particulars",
//                     type: "text",
//                     label: "Particulars",
//                     placeholder: "Enter details of the work or service paid for",
//                     validations: [
//                         { type: "required" },
//                         { type: "maxLength", value: 250 },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Amount --- */
//                 {
//                     id: "amount",
//                     type: "text",
//                     label: "Amount (₹)",
//                     placeholder: "Enter the approved payment amount",
//                     validations: [
//                         { type: "required" },
//                         { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
//                     ],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Approved By --- */
//                 {
//                     id: "approvedBy",
//                     type: "text",
//                     label: "Approved By",
//                     placeholder: "Enter name/designation of approving authority",
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Upload Approved Document --- */
//                 {
//                     id: "uploadApprovedDocument",
//                     type: "file",
//                     label: "Upload Approved Document",
//                     props: {
//                         accept: ".pdf,image/*",
//                         maxFiles: 2,
//                         maxSizeMB: 5,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'APPROVAL_FOR_EXPENDITURE'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//                 // ==========================================================
//                 // below fields are shown when "Bank Reconciliation Detail" is selected
//                 // =====================================================
//                 /* --- Office Selection --- */
//                 {
//                     id: "office",
//                     type: "dropdown",
//                     label: "Office",
//                     options: {
//                         labelKey: "label",
//                         valueKey: "value",
//                         items: [
//                             { label: "PMU", value: "pmu" },
//                             { label: "DMU - District Level", value: "dmu_district" },
//                             { label: "Other Districts", value: "other_districts" },
//                         ],
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Financial Year --- */
//                 {
//                     id: "financialYear",
//                     type: "autocomplete",
//                     label: "Financial Year",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "financial_year" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- Month of BRS --- */
//                 {
//                     id: "monthOfBRS",
//                     type: "autocomplete",
//                     label: "Month of BRS",
//                     options: {
//                         endpointKey: "v1/master/data",
//                         labelKey: "label",
//                         valueKey: "value",
//                         query: { type: "months" },
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },

//                 /* --- File Upload (BRS + Passbook Copy) --- */
//                 {
//                     id: "uploadBRSFile",
//                     type: "file",
//                     label: "Upload BRS with Bank Passbook Copy",
//                     props: {
//                         accept: ".pdf,image/*",
//                         maxFiles: 2,
//                         maxSizeMB: 10,
//                     },
//                     validations: [{ type: "required" }],
//                     rules: [{ when: "values.modeOfSelector !== 'BANK_RECONCILIATION'", action: "hide" }],
//                     grid: { span: { xs: 12, sm: 6, md: 4 } },
//                 },
//             ],
//         },
//     ],
// };
