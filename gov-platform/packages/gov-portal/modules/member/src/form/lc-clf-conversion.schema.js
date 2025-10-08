export const lcClfConversionSchema = {
  $schema: "fe.v1",
  id: "lc-clf-conversion",
  version: "1.0.0",
  title: "LC to CLF Conversion",
  sections: [
    {
      id: "lc-clf-conversion-details",
      title: "LC to CLF Conversion Details",
      fields: [
       {
          id: "action",
          type: "radio-group",
          label: "Action",
          defaultValue: "add",
          options: {
            items: [
              { label: "Convert LC to CLF", value: "add" },
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
            dependsOnHint: "Select District first",
            queryBuilder: (deps) => ({ type: "blocks", id: deps.district })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "lcName",
          type: "text",
          label: "LC Name",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "convertedToClf",
          type: "radio-group",
          label: "If LC converted into CLF",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "clfRegistrationNumber",
          type: "text",
          label: "CLF Registration Number",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "dateOfRegistration",
          type: "date",
          label: "Date of Registration",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "clfNewName",
          type: "text",
          label: "CLF New Name",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "voCount",
          type: "text",
          label: "No of VOs",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shgCount",
          type: "text",
          label: "No. of SHGs",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    }
  ]
};