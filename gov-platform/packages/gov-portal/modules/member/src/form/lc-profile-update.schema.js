export const lcRegistrationSchema = {
    $schema: "fe.v1",
    id: "lc-registration",
    version: "1.0.0",
    title: "LC Registration",
    sections: [
        {
            id: "lc-details",
            title: "LC Profile Details",
            fields: [
                /* --- Action: Create or Update --- */
                {
                    id: "action",
                    type: "radio-group",
                    label: "Action",
                    defaultValue: "create",
                    options: {
                        items: [
                            { label: "Create New LC", value: "create" },
                            { label: "Update Existing", value: "update" }
                        ]
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                /* --- District --- */
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

                /* --- Block --- */
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
                        queryBuilder: (deps) => ({ type: "blocks", id: deps.district }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- LC Name --- */
                {
                    id: "lcName",
                    type: "text",
                    label: "LC Name",
                    props: { placeholder: "Enter LC name" },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action === 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "lcId",
                    type: "autocomplete",
                    label: "Select LC to Update",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_profiles" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "lc_profiles",
                            id: deps.block,
                        }
                        )
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.action !== 'update'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Adoption Agreement Date --- */
                {
                    id: "adoptionEffectiveDate",
                    type: "date",
                    label: "LC Adoption Agreement (Effective) Date",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                        valueKind: "iso",
                        outputFormat: "YYYY-MM-DD",
                        disableFuture: true,
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Coverage Details --- */
                {
                    id: "panchayatsCovered",
                    type: "text",
                    label: "No of Panchayats Covered",
                    validations: [{ type: "pattern", value: "^\\d+$", message: "Enter valid number" }],
                    props: { placeholder: "Enter number of Panchayats Covered" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "revenueVillages",
                    type: "text",
                    label: "No of Revenue Villages",
                    validations: [{ type: "pattern", value: "^\\d+$", message: "Enter valid number" }],
                    props: { placeholder: "Enter number of Revenue Villages" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "voCount",
                    type: "text",
                    label: "No of VOs",
                    validations: [{ type: "pattern", value: "^\\d+$", message: "Enter valid number" }],
                    props: { placeholder: "Enter number of VOs" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "shgCount",
                    type: "text",
                    label: "No of SHGs",
                    validations: [{ type: "pattern", value: "^\\d+$", message: "Enter valid number" }],
                    props: { placeholder: "Enter number of SHGs" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Address --- */
                {
                    id: "address",
                    type: "text",
                    label: "Address of CLF/LC",
                    props: { placeholder: "Enter official address" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Registration --- */
                {
                    id: "registrationNo",
                    type: "text",
                    label: "LC Registration No.",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter LC registration number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "registrationDate",
                    type: "date",
                    label: "LC Date of Registration",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                        valueKind: "iso",
                        outputFormat: "YYYY-MM-DD",
                        disableFuture: true,
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- BOD Details --- */
                {
                    id: "presidentName",
                    type: "text",
                    label: "LC BOD's Name: President",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter name of President" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "secretaryName",
                    type: "text",
                    label: "LC BOD's Name: Secretary",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter name of Secretary" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "treasurerName",
                    type: "text",
                    label: "LC BOD's Name: Treasurer",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter name of Treasurer" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bodNames",
                    type: "textarea",
                    label: "LC BOD Names (Others)",
                    description: "Enter multiple names (up to 10)",
                    props: { placeholder: "Enter names of other BOD members" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Legal Info --- */
                {
                    id: "panOrTan",
                    type: "text",
                    label: "PAN / TAN No",
                    props: { placeholder: "Enter PAN or TAN number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "fssaiNo",
                    type: "text",
                    label: "FSSAI No.",
                    props: { placeholder: "Enter FSSAI number" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Staff Header --- */
                {
                    id: "staffHeader",
                    type: "subHeading",
                    label: "Names of Staff in CLF/LC",
                    grid: { span: { xs: 12 } },
                },
                {
                    id: "businessPromoter",
                    type: "text",
                    label: "Name of Business Promoter",
                    props: { placeholder: "Enter name of Business Promoter" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "accountantName",
                    type: "text",
                    label: "Name of Accountant/Data Entry Operator",
                    props: { placeholder: "Enter name of Accountant/Data Entry Operator" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "gm1",
                    type: "text",
                    label: "Name of Group Mobiliser -1",
                    props: { placeholder: "Enter name of Group Mobiliser -1" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "gm2",
                    type: "text",
                    label: "Name of Group Mobiliser -2",
                    props: { placeholder: "Enter name of Group Mobiliser -2" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Shareholding --- */
                {
                    id: "shareholders",
                    type: "text",
                    label: "Shareholders (No’s)",
                    validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
                    props: { placeholder: "Enter number of shareholders" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "sharecapital",
                    type: "text",
                    label: "Sharecapital Amount (INR)",
                    validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
                    props: { placeholder: "Enter sharecapital amount" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Associated FPO --- */
                {
                    id: "associatedFpo",
                    type: "text",
                    label: "Name of Associated FPO",
                    props: { placeholder: "If any" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Bank Details --- */
                {
                    id: "bankAccount",
                    type: "text",
                    label: "LC Bank A/C No.",
                    validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
                    props: { maxLength: 24, placeholder: "Enter bank account number" },
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
                            message: "Invalid IFSC format",
                        },
                    ],
                    props: { maxLength: 11, placeholder: "Enter IFSC code" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bankName",
                    type: "text",
                    label: "Name of Bank",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter bank name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bankBranch",
                    type: "text",
                    label: "Name of Bank Branch",
                    validations: [{ type: "required" }],
                    props: { placeholder: "Enter bank branch name" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Miscellaneous --- */
                {
                    id: "totalLand",
                    type: "text",
                    label: "Total Land of CLF/LC Members",
                    validations: [{ type: "pattern", value: "^\\d+$" }],
                    props: { placeholder: "Enter total land (in acres)" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "grade",
                    type: "text",
                    label: "Grade of CLF / LC",
                    props: { placeholder: "Enter grade (e.g., A, B, C)" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Value Chain --- */
                {
                    id: "valueChain1",
                    type: "text",
                    label: "CLF/LC Key Value Chain: 1",
                    props: { placeholder: "If any" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "valueChain2",
                    type: "text",
                    label: "CLF/LC Key Value Chain: 2",
                    props: { placeholder: "If any" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "valueChain3",
                    type: "text",
                    label: "CLF/LC Key Value Chain: 3",
                    props: { placeholder: "If any" },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Audit and AGM --- */
                {
                    id: "lastAuditDate",
                    type: "date",
                    label: "Last Audit Date",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                        valueKind: "iso",
                        outputFormat: "YYYY-MM-DD",
                        disableFuture: true,
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "lastAgmDate",
                    type: "date",
                    label: "Last AGM Date",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                        valueKind: "iso",
                        outputFormat: "YYYY-MM-DD",
                        disableFuture: true,
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
