export const individualEnterpriseActivityUpdateSchema = {
    $schema: "fe.v1",
    id: "individual-enterprise-activity-update",
    version: "1.0.0",
    title: "Individual Enterprise Activity Update",
    sections: [
        {
            id: "enterprise-activity-details",
            title: "Individual Enterprise Activity Details",
            fields: [
                {
                    id: "action",
                    type: "radio-group",
                    label: "Action",
                    defaultValue: "create",
                    options: {
                        items: [
                            { label: "Add New", value: "create" },
                            { label: "Update Existing", value: "update" },
                        ],
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Location Hierarchy */
                {
                    id: "district",
                    type: "autocomplete",
                    label: "District",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "districts" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "block",
                    type: "autocomplete",
                    label: "Block",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "blocks" },
                        dependsOn: ["values.district"],
                        dependsOnHint: "Select District first",
                        queryBuilder: (deps) => ({
                            type: "blocks",
                            id: deps.district,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "gp",
                    type: "autocomplete",
                    label: "Gram Panchayat",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "panchayats" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "panchayats",
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "village",
                    type: "autocomplete",
                    label: "Village",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "villages" },
                        dependsOn: ["values.gp"],
                        dependsOnHint: "Select Gram Panchayat first",
                        queryBuilder: (deps) => ({
                            type: "villages",
                            id: deps.gp,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* SHG Hierarchy Info */
                {
                    id: "clf",
                    type: "autocomplete",
                    label: "CLF",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "clf_profiles" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "clf_profiles",
                            id: deps.block
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "vo",
                    type: "autocomplete",
                    label: "VO",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "vo_profiles" },
                        dependsOn: ["values.clf"],
                        dependsOnHint: "Select CLF first",
                        queryBuilder: (deps) => ({
                            type: "vo_profiles",
                            id: deps.clf
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "shg",
                    type: "autocomplete",
                    label: "SHG",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "shg_profiles" },
                        dependsOn: ["values.vo"],
                        dependsOnHint: "Select VO first",
                        queryBuilder: (deps) => ({
                            type: "shg_profiles",
                            id: deps.vo
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },

                /* Beneficiary Info */
                {
                    id: "memberId",
                    type: "autocomplete",
                    label: "Select Member",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "member_profiles" },
                        labelKey: "memberName",
                        valueKey: "memberId",
                        dependsOn: ["values.shg"],
                        dependsOnHint: "Select SHG first",
                        queryBuilder: (deps) => ({
                            type: "member_profiles",
                            id: deps.shg
                        }),
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "localId",
                    type: "autocomplete",
                    label: "Select Member to Update",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "ind_enterprise_activities" },
                        labelKey: "name",
                        valueKey: "id",
                        dependsOn: ["values.shg"],
                        dependsOnHint: "Select SHG first",
                        queryBuilder: (deps) => ({
                            type: "ind_enterprise_activities",
                            id: deps.shg
                        }),
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fatherOrHusband",
                    type: "text",
                    label: "Father / Husband Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Father / Husband Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "enterpriseType",
                    type: "autocomplete",
                    label: "Type of Enterprise",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "enterprise_type" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "currentLivelihoodActivity",
                    type: "autocomplete",
                    label: "Current Livelihood Activity",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "enterprise_type" },
                        dependsOn: ["values.enterpriseType"],
                        dependsOnHint: "Select Enterprise Type first",
                        queryBuilder: (deps) => ({
                            type: "enterprise_type",
                            id: deps.enterpriseType === "Farm Based - Individual Enterprise" ? 1 : 2,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "proposedEnterprise",
                    type: "autocomplete",
                    label: "Proposed Enterprise",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "enterprise_type" },
                        dependsOn: ["values.enterpriseType"],
                        dependsOnHint: "Select Enterprise Type first",
                        queryBuilder: (deps) => ({
                            type: "enterprise_type",
                            id: deps.enterpriseType === "Farm Based - Individual Enterprise" ? 1 : 2,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "aadharNo",
                    type: "text",
                    label: "Beneficiary Aadhar No.",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d{12}$", message: "Enter valid 12-digit Aadhar number" },
                    ],
                    props: { maxLength: 12 ,placeholder: "Enter Beneficiary Aadhar No."},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "financeYear",
                    type: "autocomplete",
                    label: "Finance Year",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "financial_year" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Financial Details */
                {
                    id: "financialDetailsSection",
                    type: "subHeading",
                    label: "Project Cost Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "beneficiaryContribution",
                    type: "text",
                    label: "Beneficiary Contribution (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Beneficiary Contribution" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "projectSupport",
                    type: "text",
                    label: "Project Support (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Project Support" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "convergence",
                    type: "text",
                    label: "Convergence (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Convergence" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bankAmount",
                    type: "text",
                    label: "Bank (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Bank Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalCost",
                    type: "text",
                    label: "Total Cost (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Banking Information */
                {
                    id: "beneficiaryBankSection",
                    type: "subHeading",
                    label: "Beneficiary Bank Account Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "beneficiaryBankName",
                    type: "text",
                    label: "Beneficiary Bank Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Beneficiary Bank Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiaryAccountNo",
                    type: "text",
                    label: "Beneficiary Account No.",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { maxLength: 24, placeholder: "Enter Beneficiary Account No." },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "ifscCode",
                    type: "text",
                    label: "IFSC Code",
                    validations: [
                        { type: "required" },
                        {
                            type: "pattern",
                            value: "^[A-Z]{4}0[A-Z0-9]{6}$",
                            message: "Invalid IFSC",
                        },
                    ],
                    props: { maxLength: 11, placeholder: "Enter IFSC Code" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "mobileNumber",
                    type: "text",
                    label: "Mobile Number",
                    validations: [
                        { type: "required" },
                        {
                            type: "pattern",
                            value: "^[6-9]\\d{9}$",
                            message: "Enter valid 10-digit mobile number",
                        },
                    ],
                    props: { maxLength: 10, placeholder: "Enter Mobile Number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Fund Details */
                 {
                    id: "fundDetailsSection",
                    type: "subHeading",
                    label: "Fund Received Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "fundReceivedDate",
                    type: "date",
                    label: "Fund Received Date",
                    validations: [{ type: "required" }],
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundBeneficiaryContribution",
                    type: "text",
                    label: "Fund Beneficiary Contribution",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    props: { placeholder: "Enter Beneficiary Contribution" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundProjectSupport",
                    type: "text",
                    label: "Fund Project Support",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    props: { placeholder: "Enter Project Support" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundConvergence",
                    type: "text",
                    label: "Fund Convergence",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    props: { placeholder: "Enter Convergence" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundBank",
                    type: "text",
                    label: "Fund Bank",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    props: { placeholder: "Enter Bank Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundTotalCost",
                    type: "text",
                    label: "Total Fund Cost",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiaryBankLoanSection",
                    type: "subHeading",
                    label: "Beneficiary Bank Loan Account Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "beneficiaryLoanBankName",
                    type: "text",
                    label: "Beneficiary Loan Bank Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Beneficiary Loan Bank Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiaryLoanAccount",
                    type: "text",
                    label: "Beneficiary Loan A/C",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { maxLength: 24, placeholder: "Enter Beneficiary Loan A/C" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiaryLoanIfsc",
                    type: "text",
                    label: "Beneficiary Loan IFSC Code",
                    validations: [
                        { type: "required" },
                        {
                            type: "pattern",
                            value: "^[A-Z]{4}0[A-Z0-9]{6}$",
                            message: "Invalid IFSC",
                        },
                    ],
                    props: { maxLength: 11, placeholder: "Enter IFSC Code" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fileUploads",
                    type: "subHeading",
                    label: "File Uploads (Upload all relevant documents)",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "uploadProposal",
                    type: "file",
                    label: "Upload Proposal (PDF)",
                    props: { accept: ".pdf" },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fundUploadProposal",
                    type: "file",
                    label: "Upload Proposal (PDF)",
                    props: { accept: ".pdf" },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "enterpriseImage",
                    type: "file",
                    label: "Enterprise Image",
                    props: { accept: "image/*" },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "meansOfVerification",
                    type: "file",
                    label: "Means of Verification",
                    props: {
                        accept: ".pdf,image/*",
                        maxFiles: 5,
                        maxSizeMB: 5
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
