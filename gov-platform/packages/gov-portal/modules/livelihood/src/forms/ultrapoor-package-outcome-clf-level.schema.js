export const ultraPoorPackageOutcomeClfLevelActivitySchema = {
    $schema: "fe.v1",
    id: "ultra-poor-package-outcome-clf-level-activity",
    version: "1.0.0",
    title: "Ultra Poor Package CLF Level Activity",
    sections: [
        {
            id: "ultra-poor-package-outcome-clf-level-details",
            title: "Ultra Poor Package Outcome CLF Level",
            fields: [
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
                    id: "clfCode",
                    type: "autocomplete",
                    label: "CLF",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "clf_profiles" },
                        dependsOn: ["values.blockId"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "clf_profiles",
                            id: deps.blockId,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "voCode",
                    type: "autocomplete",
                    label: "VO",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "vo_profiles" },
                        dependsOn: ["values.clfCode"],
                        dependsOnHint: "Select CLF first",
                        queryBuilder: (deps) => ({
                            type: "vo_profiles",
                            id: deps.clfCode,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "shgCode",
                    type: "autocomplete",
                    label: "SHG",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "shg_profiles" },
                        dependsOn: ["values.voCode"],
                        dependsOnHint: "Select VO first",
                        queryBuilder: (deps) => ({
                            type: "shg_profiles",
                            id: deps.voCode,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Beneficiary Details --- */
                {
                    id: "memberId",
                    type: "autocomplete",
                    label: "Member Name",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "ultra_poor_member_profiles" },
                        labelKey: "memberName",
                        valueKey: "memberId",
                        dependsOn: ["values.shgCode"],
                        dependsOnHint: "Select SHG first",
                        queryBuilder: (deps) => ({
                            type: "ultra_poor_clf_member_profiles",
                            shgId: deps.shgCode,
                        }),
                    },
                    validations: [{ type: "required" }],
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
                        query: { type: "ilip_activities" },
                    },
                    validations: [{ type: "required" }],
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
                    id: "frequency",
                    type: "autocomplete",
                    label: "Data Entry Frequency",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "data_entry_frequency" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id:"financeMonth",
                    type: "autocomplete",
                    label: "Month",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "months" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dataEntryHeader",
                    type: "subHeading",
                    label: "FREQUENCY DATA ENTRY IN THE MONTHLY QUARTERLY AS WELL AS YEARLY",
                    grid: { span: { xs: 12, sm: 12, md: 12 } },
                },
                {
                    id: "productName",
                    type: "text",
                    label: "Name Of Production",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Please enter name of production" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "productUnit",
                    type: "autocomplete",
                    label: "Product Unit",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "product_units" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalProduction",
                    type: "text",
                    label: "Total Production",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Total Production" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalProductPrice",
                    type: "text",
                    label: "Total Production Price (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Total Production Sales" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "typeOfConsuming",
                    type: "autocomplete",
                    label: "Type Of Consuming",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "type_of_consuming" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "pricePerUnit",
                    type: "text",
                    label: "Price Per Unit",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Price Per Unit" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalProductSale",
                    type: "text",
                    label: "Total Sale value in (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Total Sale Value" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "expenditure",
                    type: "text",
                    label: "Expenditure",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Expenditure" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "incomeBeneficiary",
                    type: "text",
                    label: "Beneficiary Income Value in (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Beneficiary Income" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalProductionValue",
                    type: "text",
                    label: "Total Production Value in (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$" }
                    ],
                    props: { placeholder: "Enter Total Production Value" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                /* --- Financial Details --- */
                {
                    id: "costDetailsSection",
                    type: "subHeading",
                    label: "Cost of ultra Poor package (as per ILIP )",
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
                    props: { placeholder: `Enter ${label}` },
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
                    props: { placeholder: `Enter ${label}` },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                })),
            ],
        },
    ],
};
