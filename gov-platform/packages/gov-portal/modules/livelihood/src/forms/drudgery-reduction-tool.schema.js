export const drudgeryReductionToolSchema = {
    $schema: "fe.v1",
    id: "drudgery-reduction-tool",
    version: "1.0.0",
    title: "Drudgery Reduction Tool Details",
    sections: [
        {
            id: "drudgery-reduction-tool-details",
            title: "Drudgery Reduction Tool Information",
            fields: [
                /* --- Location Hierarchy --- */
                {
                    id: "districtId",
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
                    id: "blockId",
                    type: "autocomplete",
                    label: "Block Name",
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
                // {
                //     id: "vo",
                //     type: "autocomplete",
                //     label: "VO Name",
                //     options: {
                //         endpointKey: "v1/master/data",
                //         labelKey: "name",
                //         valueKey: "id",
                //         query: { type: "vo_profiles" },
                //         dependsOn: ["values.clf"],
                //         dependsOnHint: "Select CLF first",
                //         queryBuilder: (deps) => ({
                //             type: "vo_profiles",
                //             id: deps.clf,
                //         }),
                //     },
                //     validations: [{ type: "required" }],
                //     grid: { span: { xs: 12, sm: 6, md: 4 } },
                // },

                /* --- Financial Details --- */
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

                /* --- Tool Details --- */
                {
                    id: "nameOfTool",
                    type: "text",
                    label: "Name of Tool",
                    placeholder: "Enter the name of the tool (e.g., Trolley, Paddy Thresher)",
                    validations: [
                        { type: "required" },
                        { type: "maxLength", value: 100 },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "dateOfPurchase",
                    type: "date",
                    label: "Date of Purchase",
                    validations: [{ type: "required" }],
                    props: { format: "DD/MM/YYYY" },
                    config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "toolQuantity",
                    type: "text",
                    label: "Tool Quantity",
                    placeholder: "Enter total number of units purchased",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Enter a valid number" },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "toolPricePerUnit",
                    type: "text",
                    label: "Tool Price per Unit (₹)",
                    placeholder: "Enter cost per unit in INR",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalToolPrice",
                    type: "text",
                    label: "Total Price of Tool (₹)",
                    placeholder: "Enter total cost (quantity × unit price)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- File Uploads --- */
                {
                    id: "toolPhoto",
                    type: "file",
                    label: "Tools Photograph",
                    props: {
                        accept: "image/*",
                        maxFiles: 3,
                        maxSizeMB: 5,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "document",
                    type: "file",
                    label: "Original Bill / Receipted Invoice",
                    props: {
                        accept: ".pdf,image/*",
                        maxFiles: 2,
                        maxSizeMB: 5,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                // {
                //     id: "tools",
                //     type: "repeater",
                //     label: "Tools Purchased",
                //     min: 1,
                //     max: 20,
                //     addLabel: "Add Tool",
                //     removeLabel: "Remove Tool",
                //     grid: { span: { xs: 12 } },
                //     item: {
                //         // layout of one row/item in the repeater
                //         fields: [
                //             {
                //                 id: "nameOfTool",
                //                 type: "text",
                //                 label: "Name of Tool",
                //                 placeholder: "e.g. Trolley",
                //                 validations: [{ type: "required" }],
                //                 grid: { span: { xs: 12, sm: 6, md: 4 } },
                //             },
                //             {
                //                 id: "dateOfPurchase",
                //                 type: "date",
                //                 label: "Date of Purchase",
                //                 props: { format: "DD/MM/YYYY" },
                //                 config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
                //                 validations: [{ type: "required" }],
                //                 grid: { span: { xs: 12, sm: 6, md: 4 } },
                //             },
                //             {
                //                 id: "toolQuantity",
                //                 type: "text", // or "number" if your renderer supports it
                //                 label: "Tool Quantity",
                //                 placeholder: "Enter number of units",
                //                 validations: [
                //                     { type: "required" },
                //                     { type: "pattern", value: "^\\d+$", message: "Enter a valid integer" },
                //                 ],
                //                 grid: { span: { xs: 12, sm: 6, md: 4 } },
                //             },
                //             {
                //                 id: "toolPricePerUnit",
                //                 type: "text", // or "number"
                //                 label: "Tool Price per Unit (₹)",
                //                 placeholder: "e.g. 1200.00",
                //                 validations: [
                //                     { type: "required" },
                //                     { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
                //                 ],
                //                 grid: { span: { xs: 12, sm: 6, md: 4 } },
                //             },
                //             {
                //                 id: "totalPriceOfTool",
                //                 type: "text", // read-only calculated field
                //                 label: "Total Price of Tool (₹)",
                //                 props: { readOnly: true },
                //                 validations: [{ type: "required" }],
                //                 grid: { span: { xs: 12, sm: 6, md: 4 } },
                //             },
                //         ],
                //     },
                // },
            ],
        },
    ],
};
