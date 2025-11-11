export const otherEnterpriseActivityUpdateSchema = {
    $schema: "fe.v1",
    id: "other-enterprise-activity-update-form",
    version: "1.0.0",
    title: "Other Enterprise Activity Update",
    sections: [
        {
            id: "other-enterprise-activity",
            title: "Other/Private Enterprise Activity Details",
            fields: [
                /* Action */
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

                /* Department Info */
                {
                    id: "departmentName",
                    type: "text",
                    label: "Department Name",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Federation & Scheme Info */
                {
                    id: "federationName",
                    type: "text",
                    label: "Federation Name",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                 {
                    id: "localId",
                    type: "autocomplete",
                    label: "Select Federation Name to Update",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "other_enterprise_activities" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "other_enterprise_activities",
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "schemeName",
                    type: "text",
                    label: "Scheme Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Scheme Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Beneficiary Info */
                {
                    id: "memberName",
                    type: "text",
                    label: "Member/Entrepreneur Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Member/Entrepreneur Name" },
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
                    label: "Benef. Aadhar No",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d{12}$", message: "Enter valid 12-digit Aadhar number" },
                    ],
                    props: { maxLength: 12, placeholder: "Enter Aadhar Number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "mobileNumber",
                    type: "text",
                    label: "Benef. Mobile No",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile number" },
                    ],
                    props: { maxLength: 10, placeholder: "Enter Mobile Number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* Financial Details */
                {
                    id: "beneficiaryContribution",
                    type: "text",
                    label: "Benef. Contribution (₹)",
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

                /* Bank Info */
                {
                    id: "beneficiaryBankDetailSection",
                    type: "subHeading",
                    label: "Beneficiary Bank Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "beneficiaryBankName",
                    type: "text",
                    label: "Benef. Bank Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Beneficiary Bank Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiaryAccountNo",
                    type: "text",
                    label: "Benef. Account No",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { maxLength: 24, placeholder: "Enter Beneficiary Account No" },
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
                /* Upload */
                {
                    id: "fileUploadsSection",
                    type: "subHeading",
                    label: "File Uploads",
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
            ],
        },
    ],
};
