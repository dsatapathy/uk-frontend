export const staffPerformanceRecordSchema = {
  $schema: "fe.v1",
  id: "staff-performance-record-form",
  version: "1.0.0",
  title: "Staff Performance Record Form",
  sections: [
    {
      id: "staff-performance-details",
      title: "Staff Performance Information",
      fields: [
        /* --- Office Type --- */
        {
          id: "officeType",
          type: "autocomplete",
          label: "Office Type",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "office_types" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- District Selection --- */
        {
          id: "district",
          type: "autocomplete",
          label: "District Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Block Selection --- */
        {
          id: "block",
          type: "autocomplete",
          label: "Block Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "blocks" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.district"],
            dependsOnHint: "Select District first",
            queryBuilder: (deps) => ({ type: "blocks", id: deps.district }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Gram Panchayat Name --- */
        {
          id: "gp",
          type: "autocomplete",
          label: "Gram Panchayat Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "panchayats" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.block"],
            dependsOnHint: "Select Block first",
            queryBuilder: (deps) => ({ type: "panchayats", id: deps.block }),
          },
          placeholder: "Select or enter Gram Panchayat name",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Place of Visit --- */
        {
          id: "vplaceVisit",
          type: "text",
          label: "Place of Visit",
          validations: [{ type: "required" }],
          props: {placeholder: "Enter village/site/training location visited",},    
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Designation --- */
        {
          id: "designation",
          type: "autocomplete",
          label: "Designation",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "designations" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Name of Staff --- */
        {
          id: "staffName",
          type: "text",
          label: "Name of Staff",          
          validations: [{ type: "required" }],
          props: { placeholder: "Enter full name of the staff member" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Mobile Number --- */
        {
          id: "mobile",
          type: "text",
          label: "Mobile Number",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile number" },
          ],
          props: { maxLength: 10, placeholder: "Enter contact number of the staff" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Financial Year --- */
        {
          id: "financeYear",
          type: "autocomplete",
          label: "Financial Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Month --- */
        {
          id: "month",
          type: "autocomplete",
          label: "Month",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "months" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- From Date --- */
        {
          id: "fromDate",
          type: "date",
          label: "FROM",
          props: { format: "DD/MM/YYYY" },
          config: {
            valueKind: "iso",
            outputFormat: "YYYY-MM-DD",
            disableFuture: true,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- To Date --- */
        {
          id: "toDate",
          type: "date",
          label: "TO",
          props: { format: "DD/MM/YYYY" },
          config: {
            valueKind: "iso",
            outputFormat: "YYYY-MM-DD",
            disableFuture: true,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Upload Report --- */
        {
          id: "docUpload",
          type: "file",
          label: "Upload Report",
          props: {
            accept: ".pdf,.doc,.docx,image/*",
            maxFiles: 2,
            maxSizeMB: 10,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Key Points of Report --- */
        {
          id: "keyPoints",
          type: "textarea",
          label: "Key Points of Report",
          props: { placeholder: "Briefly summarize main observations, activities done, and key outcomes" },
          validations: [{ type: "required" }, { type: "maxLength", value: 1000 }],
          grid: { span: { xs: 12 } },
        },
      ],
    },
  ],
};
