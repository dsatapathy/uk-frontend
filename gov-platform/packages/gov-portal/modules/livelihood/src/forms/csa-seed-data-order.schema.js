export const csaSeedOrderFormSchema = {
    $schema: "fe.v1",
    id: "csa-seed-order-form",
    version: "1.0.0",
    title: "CSA Seed Order Form",
    sections: [
        {
            id: "csa-seed-order-details",
            title: "Seed Procurement Order Details",
            fields: [
                /* --- Participant Category --- */
                {
                    id: "participantCategory",
                    type: "autocomplete",
                    label: "Category of Participants",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_participants" },
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
                        query: { type: "districts" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
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
                            id: deps.districtId 
                        })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "clfCode",
                    type: "autocomplete",
                    label: "CLF Name",
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

                /* --- Financial Year & Season --- */
                {
                    id: "financialYear",
                    type: "autocomplete",
                    label: "Financial Year",
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
                    id: "cropSeasonName",
                    type: "autocomplete",
                    label: "Crop Season",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_crops_seasons" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Seed Details --- */
                {
                    id: "typeOfSeed",
                    type: "autocomplete",
                    label: "Type of Seed",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_types" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "nameOfSeed",
                    type: "text",
                    label: "Name/Crop of Seed",
                    
                    validations: [
                        { type: "required" },
                    ],
                    props: {placeholder: "Enter name of the seed or crop", maxLength: 100 },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "seedDemand",
                    type: "text",
                    label: "Total Seed Demand",                   
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter total seed demand", maxLength: 100 },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "demandUnit",
                    type: "autocomplete",
                    label: "Demand Unit",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "orderPlace",
                    type: "text",
                    label: "Order Place",                  
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Enter a valid number" },
                    ],
                    props: { placeholder: "Enter order quantity",},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "orderUnit",
                    type: "autocomplete",
                    label: "Order Unit",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" }  // This will be sent as query params
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "agancyName",
                    type: "text",
                    label: "Name of Agency",                    
                    validations: [
                        { type: "required" },
                    ],
                    props: { placeholder: "Enter agency name", maxLength: 100 },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Order Details --- */
                {
                    id: "orderDate",
                    type: "date",
                    label: "Order Date",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                        valueKind: "iso",
                        outputFormat: "YYYY-MM-DD",
                        disableFuture: true,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- File Upload --- */
                {
                    id: "orderFile",
                    type: "file",
                    label: "Document/Bill",
                    props: {
                        accept: ".pdf,image/*",
                        maxFiles: 2,
                        maxSizeMB: 5,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
