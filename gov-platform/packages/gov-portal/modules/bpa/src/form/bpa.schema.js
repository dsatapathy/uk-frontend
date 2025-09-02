// packages/bpa/src/forms/bpa.schema.js
export const bpaSchema = {
    $schema: "fe.v1",
    id: "bpa-apply",
    version: "1.0.0",
    title: "Building Plan Approval – Application",
    sections: [
        {
            id: "applicant",
            title: "Applicant Details",
            fields: [
                {
                    id: "applicantName",
                    type: "text",
                    label: "Applicant Name",
                    props: { maxLength: 80, placeholder: "Full name as per records" },
                    validations: [{ type: "required" }, { type: "minLength", value: 3 }]
                  },
                  {
                    id: "remarks",
                    type: "textarea",
                    label: "Additional Remarks",
                    props: {
                      rows: 4,
                      maxLength: 500,
                      autoResize: true,
                      maxRows: 12, // optional if you want to cap growth
                    },
                    // purely visual overrides:
                    config: {
                      marginY: "sm",
                      allowResize: "vertical",
                      charCountAlign: "end",
                    }
                  },
                  {
                    id: "amenities",
                    type: "checkboxGroup",
                    label: "Amenities",
                    options: {
                      items: [
                        { value: "water", label: "Water" },
                        { value: "electricity", label: "Electricity" },
                        { value: "sewage", label: "Sewage Connection" },
                      ]
                    },
                    config: {
                      showSelectAll: true,
                      orientation: "horizontal",
                      gap: "sm",
                      columns: { xs: 1, sm: 2, md: 3 },
                    },
                    // RHF default should be an array:
                    defaultValue: []
                  },
                  {
                    id: "buildingUse",
                    type: "radioGroup",
                    label: "Building Use",
                    options: {
                      items: [
                        { value: "res", label: "Residential" },
                        { value: "com", label: "Commercial" },
                        { value: "ind", label: "Industrial" },
                      ]
                    },
                    defaultValue: "res",
                    config: {
                      orientation: "horizontal",
                      gap: "sm",
                      columns: { xs: 1, sm: 2, md: 3 }
                    }
                  },
                  {
                    id: "amenities",
                    type: "multiSelect",
                    label: "Amenities",
                    options: {
                      items: [
                        { value: "water", label: "Water" },
                        { value: "electricity", label: "Electricity" },
                        { value: "sewage", label: "Sewage Connection" },
                        { value: "parking", label: "Parking" },
                      ]
                    },
                    defaultValue: ["water"],
                    config: {
                      limitTags: 2,
                      chipColor: "primary",
                      chipVariant: "outlined",
                      chipSize: "sm",
                      showCheckboxes: true,
                      showSelectAll: true,
                      maxSelected: 3,
                    },
                    props: { placeholder: "Select amenities" }
                  },
                  {
                    id: "applicationDate",
                    type: "datePicker",
                    label: "Application Date",
                    props: { format: "DD/MM/YYYY" },
                    config: {
                      valueKind: "iso",
                      outputFormat: "YYYY-MM-DD",
                      disableFuture: true,
                    },
                    defaultValue: null
                  },
                  
                  // Rare single-radio (acts like a boolean for a fixed value)
                  {
                    id: "ackRules",
                    type: "radio",
                    label: "I accept updated building rules",
                    props: { value: "yes" },
                    defaultValue: "yes"
                  },
                { id: "mobile", type: "text", label: "Mobile Number", validations: [{ type: "required" }, { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile" }] },
                { id: "email", type: "text", label: "Email", validations: [{ type: "email" }] },
            ],
        },
        {
            id: "location",
            title: "Site Location",
            fields: [
                {
                    id: "state", type: "autocomplete", label: "State",
                    options: { source: "api", endpointKey: "states", valueKey: "code", labelKey: "name" },
                    validations: [{ type: "required" }]
                },
                {
                    id: "city", type: "autocomplete", label: "City",
                    options: { source: "api", endpointKey: "cities", valueKey: "code", labelKey: "name", dependsOn: ["values.state"] },
                    rules: [{ action: "disable", when: "!values.state" }],
                    validations: [{ type: "required" }]
                },
                { id: "mobile", type: "text", label: "Mobile Number",
  validations: [
    { type: "required" },
    { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile" }
  ]
},
                {
                    id: "ward", type: "autocomplete", label: "Ward",
                    options: { source: "api", endpointKey: "wards", valueKey: "code", labelKey: "name", dependsOn: ["values.city"] },
                    rules: [{ action: "disable", when: "!values.city" }],
                },
                { id: "plotNo", type: "text", label: "Plot Number" },
                { id: "pincode", type: "text", label: "PIN Code", validations: [{ type: "pattern", value: "^\\d{6}$", message: "Enter 6-digit PIN" }] },
            ],
        },
        {
            id: "building",
            title: "Building Details",
            fields: [
                {
                    id: "useType", type: "autocomplete", label: "Building Use Type",
                    options: { source: "api", endpointKey: "buildingUseTypes", valueKey: "code", labelKey: "name" },
                    validations: [{ type: "required" }]
                },
                {
                    id: "plotArea",
                    type: "number",
                    label: "Plot Area (sq.m.)",
                    props: { min: 1, step: 1, format: "decimal" }, // behavior for InputNumber
                    config: { unitSuffix: "sq.m." }                // UI for InputNumber
                  },
                  {
                    id: "builtUpArea",
                    type: "number",
                    label: "Built-up Area (sq.m.)",
                    props: { min: 1, step: 1, format: "decimal" },
                    config: { unitSuffix: "sq.m." }
                  },
                  {
                    id: "fsi",
                    type: "number",
                    label: "FSI (auto)",
                    props: { min: 0, step: 0.01, format: { locale: "en-IN", options: { maximumFractionDigits: 2 } } },
                    config: { unitSuffix: "", readOnly: true },      // shown as read-only in UI
                    rules: [
                      { action: "derive", value: "Number(values.builtUpArea||0)/Number(values.plotArea||1)" }
                    ]
                  }
            ],
        },
        {
            id: "attachments",
            title: "Documents",
            fields: [
                // If you already have FileUpload molecule, place it here. Otherwise keep a placeholder:
                { id: "ownershipDoc", type: "text", label: "Ownership Document (URL or ref)" },
            ],
        },
    ],
};
