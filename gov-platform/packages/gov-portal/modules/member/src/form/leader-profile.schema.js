export const leaderProfileSchema = {
    $schema: "fe.v1",
    id: "leader-profile-update",
    version: "1.0.0",
    title: "Leader Profile Update",
    sections: [
        {
            id: "leader-details",
            title: "Leader Details",
            fields: [
                {
                    id: "action",
                    type: "radio-group",
                    label: "Action",
                    defaultValue: "create",
                    options: {
                        items: [
                            { label: "Create New", value: "create" },
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
                        query: { type: "districts" }
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
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
                        queryBuilder: (deps) => ({ type: "blocks", id: deps.district })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "clfLc",
                    type: "autocomplete",
                    label: "CLF/LC Name",
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
                    id: "presidentName",
                    type: "text",
                    label: "President Name",
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "presidentNameId",
                    type: "autocomplete",
                    label: "Select President Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "leader_profiles" },
                        dependsOn: ["values.clfLc"],
                        dependsOnHint: "Select CLF/LC first",
                        queryBuilder: (deps) => ({
                            type: "leader_profiles",
                            id: deps.clfLc
                        })
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
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
                    id: "registrationNumber",
                    type: "text",
                    label: "Registration Number",
                    validations: [{ type: "required" }],
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
                    id: "address",
                    type: "text",
                    label: "Address",
                    props: { placeholder: "Residential address of the representative" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "contactNo",
                    type: "text",
                    label: "Contact No.",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile number" }
                    ],
                    props: { maxLength: 10, placeholder: "10-digit number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "designation",
                    type: "autocomplete",
                    label: "Designation",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "designations" }
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "dateElected",
                    type: "date",
                    label: "Date of Elected Representative",
                    validations: [{ type: "required" }],
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "socialCategory",
                    type: "autocomplete",
                    label: "Social Category",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "social_categories" }
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "economicCategory",
                    type: "autocomplete",
                    label: "Economic Category",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "ration_types" }
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "gender",
                    type: "autocomplete",
                    label: "Gender",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "gender"}
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "dob",
                    type: "date",
                    label: "Date of Birth",
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "seccCriteria",
                    type: "autocomplete",
                    label: "SECC Criteria",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "poor_sec_categories" }
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                }
            ]
        }
    ]
}

