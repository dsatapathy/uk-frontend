export const ultraPoorPackageLcLevelActivitySchema = {
    $schema: "fe.v1",
    id: "ultra-poor-package-lc-level-activity",
    version: "1.0.0",
    title: "Ultra Poor Package LC Level Activity",
    sections: [
        {
            id: "ultra-poor-package-lc-level-details",
            title: "Ultra Poor Package LC Level Activity Details",
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

                /* --- Location Hierarchy --- */
                {
                    id: "districtId",
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
                    id: "blockId",
                    type: "autocomplete",
                    label: "Block",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "blocks" },
                        dependsOn: ["values.districtId"],
                        dependsOnHint: "Select District first",
                        queryBuilder: (deps) => ({
                            type: "blocks",
                            id: deps.districtId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "panchayatId",
                    type: "autocomplete",
                    label: "Gram Panchayat",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "panchayats" },
                        dependsOn: ["values.blockId"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "panchayats",
                            id: deps.blockId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "villageId",
                    type: "autocomplete",
                    label: "Village",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "villages" },
                        dependsOn: ["values.panchayatId"],
                        dependsOnHint: "Select Gram Panchayat first",
                        queryBuilder: (deps) => ({
                            type: "villages",
                            id: deps.panchayatId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- SHG Hierarchy --- */
                {
                    id: "lcId",
                    type: "autocomplete",
                    label: "LC Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_profiles" },
                        dependsOn: ["values.blockId"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "lc_profiles",
                            id: deps.blockId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "lcAddress",
                    type: "text",
                    label: "LC Address",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter LC Address" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Beneficiary Details --- */
                {
                    id: "memberName",
                    type: "text",
                    label: "Member Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Member Name" },
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "localId",
                    type: "autocomplete",
                    label: "Select Member to Update",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "ultra_poor_clf_member_profiles" },
                        labelKey: "name",
                        valueKey: "id",
                        dependsOn: ["values.lcId"],
                        dependsOnHint: "Select LC first",
                        queryBuilder: (deps) => ({
                            type: "ultra_poor_lc_member_profiles",
                            id: deps.lcId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "mobileNo",
                    type: "text",
                    label: "Mobile Number",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: /^[0-9]{10}$/, message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "Enter 10-digit Mobile Number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fatherOrHusband",
                    type: "text",
                    label: "Father/Husband Name",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter Father/Husband Name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "socialCategory",
                    type: "autocomplete",
                    label: "Social Category",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "social_categories" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "pwd",
                    type: "radio-group",
                    label: "Person with Disability (PWD)",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "widow",
                    type: "radio-group",
                    label: "Widow",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },

                /* --- Activity Details --- */
                {
                    id: "currentActivity",
                    type: "autocomplete",
                    label: "Current Livelihood Activity",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "current_livelihood_activity" },
                        queryBuilder: (deps) => ({
                            type: "current_livelihood_activity",
                            id: 2, // LC Level
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "noCurrentActivity",
                    type: "text",
                    label: "No. of Current Activity",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Enter a valid number" },
                    ],
                    props: { placeholder: "Enter No. of Current Activity" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "proposedActivity",
                    type: "autocomplete",
                    label: "Proposed Activity under ILIP",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "proposed_activity_under_ilip" },
                        queryBuilder: (deps) => ({
                            type: "proposed_activity_under_ilip",
                            id: 2, // LC Level
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "noOfProposedActivity",
                    type: "text",
                    label: "No. of Proposed Activity",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Enter a valid number" },
                    ],
                    props: { placeholder: "Enter No. of Proposed Activity" },
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

                /* --- Financial Details --- */
                {
                    id: "costDetailsSection",
                    type: "subHeading",
                    label: "Cost of Ultra Poor package (as per ILIP )",
                    grid: { span: { xs: 12 } },
                },
                ...[
                    ["benefContribution", "Beneficiary Contribution (₹)"],
                    ["projectSupport", "Project Support (₹)"],
                    ["convergence", "Convergence (₹)"],
                    ["bank", "Bank (₹)"],
                    ["totalCost", "Total Cost (₹)"],
                ].map(([id, label]) => ({
                    id,
                    type: "text",
                    label,
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                })),

                /* --- Fund Details --- */
                {
                    id: "fundReceivedDetailsSection",
                    type: "subHeading",
                    label: "Fund Received Details",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "fundRecievedDate",
                    type: "date",
                    label: "Fund Received Date",
                    validations: [{ type: "required" }],
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                ...[
                    ["fundBenefContribution", "Fund Beneficiary Contribution  (₹)"],
                    ["fundProjectSupport", "Fund Project Support  (₹)"],
                    ["fundConvergence", "Fund Convergence  (₹)"],
                    ["fundBank", "Fund Bank  (₹)"],
                    ["fundTotalCost", "Fund Total Cost  (₹)"],
                ].map(([id, label]) => ({
                    id,
                    type: "text",
                    label,
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" },
                    ],
                    props: { placeholder: "Enter Amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                })),

                /* --- Status & Uploads --- */
                {
                    id: "statusSection",
                    type: "subHeading",
                    label: "Status & Document Uploads",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "statusOfActivity",
                    type: "autocomplete",
                    label: "Status of Ultra Poor Activity",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "status_of_ultra_poor_activity" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "uploadImagesOfActivity",
                    type: "file",
                    label: "Upload Images of Activity",
                    props: { accept: "image/*" },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "meansOfVerification",
                    type: "file",
                    label: "Means of Verification",
                    props: { accept: ".pdf,image/*", maxFiles: 5, maxSizeMB: 5 },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "uploadUppIlipDocs",
                    type: "file",
                    label: "Upload UPP-ILIP Docs",
                    props: { accept: ".pdf" },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
