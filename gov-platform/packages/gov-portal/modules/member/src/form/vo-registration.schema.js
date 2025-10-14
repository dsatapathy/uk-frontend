// VO Registration Form Schema
export const voRegistrationFormSchema = {
    $schema: "fe.v1",
    id: "vo-registration",
    version: "1.0.0",
    title: "VO Registration Form",
    sections: [
        {
            id: "vo-details",
            title: "VO Registration Details",
            fields: [
                {
                    id: "action",
                    type: "radio-group",
                    label: "Action",
                    defaultValue: "create",
                    options: {
                        items: [
                            { label: "Create New VO", value: "create" },
                            { label: "Update Existing", value: "update" }
                        ]
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "district",
                    type: "autocomplete",
                    label: "District",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "districts" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
                            id: deps.district
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
                        dependsOn: ["values.district", "values.block"],
                        dependsOnHint: "Select District and Block first",
                        queryBuilder: (deps) => ({
                            type: "panchayats",
                            id: deps.block
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "clf",
                    type: "autocomplete",
                    label: "Parent CLF",
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
                    type: "text",
                    label: "Enter VO Name",
                    validations: [{ type: "required" }],
                    description: "Enter the VO under the CLF",
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "voId",
                    type: "autocomplete",
                    label: "Choose VO to Update",
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
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "vo_registration_code",
                    type: "text",
                    label: "VO Registration Code",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]*$", message: "Only numbers are allowed" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                    description: "Select VO code in the CLF from the dropdown"
                },
                {
                    id: "date_of_registration",
                    type: "date",
                    label: "Date Of Registration",
                    validations: [{ type: "required" }],
                    description: "Select date of VO registration (dd-mm-yyyy)",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                },
                {
                    id: "address",
                    type: "text",
                    label: "Address",
                    validations: [{ type: "required" }],
                    description: "Format - Hamlet, GP, Block, District",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                },
                {
                    id: "shg_mapped",
                    type: "text",
                    label: "No. of SHGs Mapped",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    description: "Total SHGs under the VO",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                },
                {
                    id: "members_in_ec_committee",
                    type: "text",
                    label: "Members In EC Committee",
                    validations: [
                        { type: "required" }
                        , { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                    description: "Total members in the Executive Committee"
                },
                {
                    id: "monitoring_committee_formed",
                    type: "radio-group",
                    label: "Monitoring Committee Formed",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    description: "Select if monitoring committee is formed",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "livelihood_committee_formation",
                    type: "radio-group",
                    label: "Livelihood Committee Formation",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    description: "Select if livelihood committee is formed",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "seed_revolving_fund_received",
                    type: "radio-group",
                    label: "Seed Revolving Fund Received",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    description: "Select if seed revolving fund received",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "seed_revolving_fund_receiving_date",
                    type: "date",
                    label: "Seed Revolving Fund Receiving Date",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    description: "Select date when seed revolving fund was received (dd-mm-yyyy)"
                },
                {
                    id: "seed_revolving_fund_utilised",
                    type: "radio-group",
                    label: "Seed Revolving Fund Utilised",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    description: "Select if seed revolving fund utilised",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "storage_for_drudgery_reduction_tools",
                    type: "radio-group",
                    label: "Storage For Drudgery Reduction Tools",
                    options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
                    validations: [{ type: "required" }],
                    description: "Select if storage for drudgery reduction tools available",
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "vo_bank_name",
                    type: "text",
                    label: "VO Bank Name",
                    validations: [{ type: "required" }],
                    description: "Enter VO bank name",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "vo_account_no",
                    type: "text",
                    label: "VO A/C No.",
                    validations: [{ type: "required" },
                    { type: "pattern", pattern: "^[0-9]*$", message: "Only numbers are allowed" }
                    ],
                    description: "Enter VO account number",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "vo_ifsc_code",
                    type: "text",
                    label: "VO IFSC Code",
                    validations: [{ type: "required" }],
                    description: "Enter VO IFSC code",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "means_of_verification",
                    type: "file",
                    label: "Means Of Verification",
                    description: "Upload means of verification document",
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                }
            ]
        }
    ]
}
