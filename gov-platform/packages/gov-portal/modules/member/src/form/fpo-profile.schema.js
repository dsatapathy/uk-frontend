export const fpoProfileSchema = {
    $schema: "fe.v1",
    id: "fpo-profile-update",
    version: "1.0.0",
    title: "FPO Profile Update",
    sections: [
        {
            id: "fpo-details",
            title: "FPO Profile Details",
            fields: [
                {
                    id: "action",
                    type: "radio-group",
                    label: "Action",
                    defaultValue: "create",
                    options: {
                        items: [
                            { label: "Create new FPO", value: "create" },
                            { label: "Update existing FPO", value: "update" }
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
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                // {
                //     id: "block",
                //     type: "autocomplete",
                //     label: "Block",
                //     options: {
                //         endpointKey: "v1/master/data",
                //         labelKey: "name",
                //         valueKey: "id",
                //         query: { type: "blocks" },
                //         dependsOn: ["values.district"],
                //         dependsOnHint: "Select District first",
                //         queryBuilder: (deps) => ({
                //             type: "blocks",
                //             id: deps.district
                //         })
                //     },
                //     validations: [{ type: "required" }],
                //     grid: { span: { xs: 12, sm: 6, md: 4 } }
                // },
                // {
                //     id: "gp",
                //     type: "autocomplete",
                //     label: "Gram Panchayat",
                //     options: {
                //         endpointKey: "v1/master/data",
                //         labelKey: "name",
                //         valueKey: "id",
                //         query: { type: "panchayats" },
                //         dependsOn: ["values.block"],
                //         dependsOnHint: "Select Block first",
                //         queryBuilder: (deps) => ({
                //             type: "panchayats",
                //             id: deps.block
                //         })
                //     },
                //     validations: [{ type: "required" }],
                //     grid: { span: { xs: 12, sm: 6, md: 4 } }
                // },
                // {
                //     id: "clf",
                //     type: "autocomplete",
                //     label: "CLF",
                //     options: {
                //         endpointKey: "v1/master/data",
                //         labelKey: "name",
                //         valueKey: "id",
                //         query: { type: "clf_profiles" },
                //         dependsOn: ["values.block"],
                //         dependsOnHint: "Select Block first",
                //         queryBuilder: (deps) => ({
                //             type: "clf_profiles",
                //             id: deps.block
                //         })
                //     },
                //     validations: [{ type: "required" }],
                //     grid: { span: { xs: 12, sm: 6, md: 4 } }
                // },
                {
                    id: "fpoName",
                    type: "text",
                    label: "FPO Name",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "fpoId",
                    type: "autocomplete",
                    label: "Select FPO Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "fpo_profiles" },
                        dependsOn: ["values.district"],
                        dependsOnHint: "Select District first",
                        queryBuilder: (deps) => ({
                            type: "fpo_profiles",
                            id: deps.district
                        })  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "registrationType",
                    type: "autocomplete",
                    label: "Registration Type",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "registration_type" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "yearOfRegistration",
                    type: "date",
                    label: "Year of Registration",
                    validations: [{ type: "required" }],
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "yearTakenInReap",
                    type: "autocomplete",
                    label: "Year Taken in REAP",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "reap_year" }
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "registrationNumber",
                    type: "text",
                    label: "Registration Number",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "institutionalMembers",
                    type: "text",
                    label: "Institutional Members No.",
                    validations: [{ type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "bankAccountNo",
                    type: "text",
                    label: "Bank Account No",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }
                    ],
                    props: { maxLength: 24 },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
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
                            message: "Invalid IFSC"
                        }
                    ],
                    props: { maxLength: 11, placeholder: "e.g., HDFC0001234" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "gstNo",
                    type: "text",
                    label: "GST No",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "panNo",
                    type: "text",
                    label: "PAN No",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "presidentName",
                    type: "text",
                    label: "President/Chairman Name",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "presidentAddress",
                    type: "text",
                    label: "Address (President)",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "presidentContact",
                    type: "text",
                    label: "Contact No. (President)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "10-digit number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "secretaryName",
                    type: "text",
                    label: "Secretary Name",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "secretaryAddress",
                    type: "text",
                    label: "Address (Secretary)",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "secretaryContact",
                    type: "text",
                    label: "Contact No. (Secretary)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "10-digit number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "treasurerName",
                    type: "text",
                    label: "Treasurer Name",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "treasurerAddress",
                    type: "text",
                    label: "Address (Treasurer)",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "treasurerContact",
                    type: "text",
                    label: "Contact No. (Treasurer)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "10-digit number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "ceoName",
                    type: "text",
                    label: "CEO Name",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "ceoAddress",
                    type: "text",
                    label: "Address (CEO)",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "ceoContact",
                    type: "text",
                    label: "Contact No. (CEO)",
                    validations: [
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "10-digit number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "fpoFurniture",
                    type: "radio-group",
                    label: "FPO Furniture Procured",
                    options: {
                        items: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "workingCapital",
                    type: "radio-group",
                    label: "Working Capital Transferred",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "governanceTraining",
                    type: "radio-group",
                    label: "Governance Training",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "businessTraining",
                    type: "radio-group",
                    label: "Business Training",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "staffRecruited",
                    type: "radio-group",
                    label: "Staff Recruited",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                }
            ]
        }
    ]
};

