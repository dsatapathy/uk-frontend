export const pashuSakhiKitFormSchema = {
    $schema: "fe.v1",
    id: "pashu-sakhi-kit-form",
    version: "1.0.0",
    title: "Pashu Sakhi Kit Details",
    sections: [
        {
            id: "pashu-sakhi-kit-details",
            title: "Pashu Sakhi Kit  Information",
            fields: [
                /* --- Basic Details --- */
                {
                    id: "categoryOfParticipants",
                    type: "autocomplete",
                    label: "Category of Participants",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "category_of_participants" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Location Hierarchy --- */
                {
                    id: "district",
                    type: "autocomplete",
                    label: "District Name",
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
                    label: "Block Name",
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
                    id: "gramPanchayat",
                    type: "autocomplete",
                    label: "Gram Panchayat Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "gram_panchayats" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "gram_panchayats",
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "village",
                    type: "autocomplete",
                    label: "Village Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "villages" },
                        dependsOn: ["values.gramPanchayat"],
                        dependsOnHint: "Select Gram Panchayat first",
                        queryBuilder: (deps) => ({
                            type: "villages",
                            id: deps.gramPanchayat,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                {
                    id: "clf",
                    type: "autocomplete",
                    label: "CLF Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "clf_profiles" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "clf_profiles",
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "vo",
                    type: "autocomplete",
                    label: "VO Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "vo_profiles" },
                        dependsOn: ["values.clf"],
                        dependsOnHint: "Select CLF first",
                        queryBuilder: (deps) => ({
                            type: "vo_profiles",
                            id: deps.clf,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
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
                            id: deps.vo,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Training Details --- */
                {
                    id: "pashuSakhiKitDetailsHeading",
                    type: "subHeading",
                    label: "Details of Pashu Sakhi Kit Received",
                    grid: { span: { xs: 12, sm: 12, md: 12 } },
                },
                {
                    id: "pashuSakhiName",
                    type: "text",
                    label: "Pashu Sakhi Name",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "psMobileNumber",
                    type: "text",
                    label: "PS Mobile Number",
                    validations: [
                        { type: "required" },
                        {
                            type: "pattern",
                            value: "^[6-9]\\d{9}$",
                            message: "Enter a valid 10-digit mobile number",
                        },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "kitReceived",
                    type: "radio-group",
                    label: "Kit Received",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                    validations: [{ type: "required" }]
                },
                {
                    id: "kitReceivedDate",
                    type: "date",
                    label: "Kit Received Date",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "smartPhoneReceived",
                    type: "radio-group",
                    label: "Smart Phone Received",
                    options: {
                        items: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                    validations: [{ type: "required" }]
                },
                {
                    id: "smartPhoneReceivedDate",
                    type: "date",
                    label: "Smart Phone Received Date",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- File Uploads --- */
                {
                    id: "uploadSupportingDocuments",
                    type: "subHeading",
                    label: "Upload Supporting Documents",
                    grid: { span: { xs: 12, sm: 12, md: 12 } },
                },
                {
                    id: "kitPhotograph",
                    type: "file",
                    label: "Kit Photograph",
                    props: {
                        accept: "image/*",
                        maxFiles: 3,
                        maxSizeMB: 5,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "smartPhonePhotograph",
                    type: "file",
                    label: "Smart Phone Photograph",
                    props: {
                        accept: "image/*",
                        maxFiles: 3,
                        maxSizeMB: 5,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
