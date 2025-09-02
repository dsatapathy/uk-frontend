// packages/bpa/src/forms/bpa.schema.js
export const bpaSchema = {
  $schema: "fe.v1",
  id: "bpa-apply",
  version: "1.0.0",
  title: "Building Plan Approval – Application",
  sections: [
    /* ───────────────────────── Applicant ───────────────────────── */
    {
      id: "applicant",
      title: "Applicant Details",
      fields: [
        {
          id: "applicantName",
          type: "text",
          label: "Applicant Name",
          props: { maxLength: 80, placeholder: "Full name as per records" },
          validations: [{ type: "required" }, { type: "minLength", value: 3 }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "mobile",
          type: "text",
          label: "Mobile Number",
          props: { maxLength: 10, placeholder: "10-digit mobile" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile" }
          ],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "email",
          type: "text",
          label: "Email",
          props: { placeholder: "name@example.com" },
          validations: [{ type: "email" }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "remarks",
          type: "textarea",
          label: "Additional Remarks",
          props: {
            rows: 4,
            maxLength: 500,
            autoResize: true,
            maxRows: 12
          },
          config: {
            marginY: "sm",
            allowResize: "vertical",
            charCountAlign: "end"
          },
          grid: { span: { xs: 12 } }
        },
        {
          id: "buildingUse",
          type: "radio-group",               // ✅ matches FieldController
          label: "Building Use",
          options: {
            items: [
              { value: "res", label: "Residential" },
              { value: "com", label: "Commercial" },
              { value: "ind", label: "Industrial" }
            ]
          },
          defaultValue: "res",
          config: { orientation: "horizontal", gap: "sm", columns: { xs: 1, sm: 3 } },
          grid: { span: { xs: 12 } }
        },
        {
          id: "amenitiesMulti",
          type: "multiselect",               // ✅ use "multiselect" (no duplicate id)
          label: "Amenities",
          options: {
            items: [
              { value: "water", label: "Water" },
              { value: "electricity", label: "Electricity" },
              { value: "sewage", label: "Sewage Connection" },
              { value: "parking", label: "Parking" }
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
            maxSelected: 3
          },
          props: { placeholder: "Select amenities" },
          grid: { span: { xs: 12 } }
        },
        {
          id: "ackRules",
          type: "radio",                     // single radio acting like a boolean
          label: "I accept updated building rules",
          props: { value: "yes" },
          defaultValue: "yes",
          grid: { span: { xs: 12 } }
        },
        {
          id: "applicationDate",
          type: "datepicker",                // ✅ "date" or "datepicker"
          label: "Application Date",
          props: { format: "DD/MM/YYYY" },
          config: {
            valueKind: "iso",
            outputFormat: "YYYY-MM-DD",
            disableFuture: true
          },
          defaultValue: null,
          grid: { span: { xs: 12, sm: 6 } }
        }
      ]
    },

    /* ───────────────────────── Location ───────────────────────── */
    {
      id: "location",
      title: "Site Location",
      fields: [
        {
          id: "state",
          type: "autocomplete",
          label: "State",
          options: { source: "api", endpointKey: "states", valueKey: "code", labelKey: "name" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "city",
          type: "autocomplete",
          label: "City",
          options: {
            source: "api",
            endpointKey: "cities",
            valueKey: "code",
            labelKey: "name",
            dependsOn: ["values.state"]      // ✅ FieldController gates fetch until resolved
          },
          rules: [{ action: "disable", when: "!values.state" }],
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "ward",
          type: "autocomplete",
          label: "Ward",
          options: {
            source: "api",
            endpointKey: "wards",
            valueKey: "code",
            labelKey: "name",
            dependsOn: ["values.city"]       // ✅ chained dependency
          },
          rules: [{ action: "disable", when: "!values.city" }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "plotNo",
          type: "text",
          label: "Plot Number",
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "pincode",
          type: "text",
          label: "PIN Code",
          validations: [{ type: "pattern", value: "^\\d{6}$", message: "Enter 6-digit PIN" }],
          grid: { span: { xs: 12, sm: 6 } }
        }
      ]
    },

    /* ───────────────────────── Building ───────────────────────── */
    {
      id: "building",
      title: "Building Details",
      fields: [
        {
          id: "useType",
          type: "autocomplete",
          label: "Building Use Type",
          options: { source: "api", endpointKey: "buildingUseTypes", valueKey: "code", labelKey: "name" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "plotArea",
          type: "number",
          label: "Plot Area (sq.m.)",
          props: { min: 1, step: 1, format: "decimal" },
          config: { unitSuffix: "sq.m." },
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "builtUpArea",
          type: "number",
          label: "Built-up Area (sq.m.)",
          props: { min: 1, step: 1, format: "decimal" },
          config: { unitSuffix: "sq.m." },
          grid: { span: { xs: 12, sm: 6 } }
        },
        {
          id: "fsi",
          type: "number",
          label: "FSI (auto)",
          props: { min: 0, step: 0.01, format: { locale: "en-IN", options: { maximumFractionDigits: 2 } } },
          config: { unitSuffix: "", readOnly: true },
          rules: [
            { action: "derive", value: "Number(values.builtUpArea||0)/Number(values.plotArea||1)" }
          ],
          grid: { span: { xs: 12, sm: 6 } }
        }
      ]
    },

    /* ───────────────────────── Attachments ───────────────────────── */
    {
      id: "attachments",
      title: "Documents",
      fields: [
        { id: "ownershipDoc", type: "text", label: "Ownership Document (URL or ref)", grid: { span: { xs: 12 } } },
        {
      id: "owners",
      type: "repeater",
      label: "Owners",
      min: 1,
      max: 5,
      addLabel: "Add another owner",
      item: {
        title: "Owner #$n",                     // $n => 1-based row number
        description: "Provide details for each owner.",
        fields: [
          { id: "name", type: "text", label: "Full Name", validations: [{ type: "required" }] },
          { id: "mobile", type: "text", label: "Mobile", validations: [{ type: "pattern", value: "^[6-9]\\d{9}$" }] },
          { id: "email", type: "text", label: "Email", validations: [{ type: "email" }] },
          {
            id: "share",
            type: "number",
            label: "Ownership Share (%)",
            props: { min: 0, max: 100, step: 0.01, format: "decimal" }
          },
          // Example of using index in rules/dependsOn:
          // rules: [{ action: "disable", when: "!values.owners[$index].name" }]
        ]
      },
      // Optional: dynamic header per row
      getItemLabel: (row, idx) => row?.name ? `${row.name} (Owner #${idx + 1})` : `Owner #${idx + 1}`,
      defaultValue: []   // important: RHF expects an array for repeaters
    }
      ]
    },
    

  ]
};
