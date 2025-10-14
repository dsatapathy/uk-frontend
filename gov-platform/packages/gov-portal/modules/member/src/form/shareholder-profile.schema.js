export const shareholderProfileSchema = {
  $schema: "fe.v1",
  id: "shareholder-profile",
  version: "1.0.0",
  title: "Shareholder Profile",
  sections: [
    {
      id: "shareholder-details",
      title: "Shareholder Details",
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
            dependsOnHint: "Select District first",
            queryBuilder: (deps) => ({
              type: "blocks",
              id: deps.district
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "gp",
          type: "autocomplete",
          label: "Gram Panchayat",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "panchayats" },
            dependsOn: ["values.block"],
            dependsOnHint: "Select Block first",
            queryBuilder: (deps) => ({
              type: "panchayats",
              id: deps.block
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
         {
          id: "village",
          type: "autocomplete",
          label: "Village",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "villages" },
            dependsOn: ["values.gp"],
            dependsOnHint: "Select Gram Panchayat first",
            queryBuilder: (deps) => ({
              type: "villages",
              id: deps.gp
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "clf",
          type: "autocomplete",
          label: "CLF",
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
          id: "vo",
          type: "autocomplete",
          label: "VO",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "vo_profiles" },
            dependsOn: ["values.clf"],
            dependsOnHint: "Select CLF first",
            queryBuilder: (deps) => ({
              type: "vo_profiles",
              id: deps.clf
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
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
              id: deps.vo
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "financeYear",
          type: "autocomplete",
          label: "Finance Year",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "financial_year"}
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shareholderName",
          type: "text",
          label: "Name of Shareholder",
          validations: [{ type: "required" }],
          rules: [{ when: "values.action === 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shareholderId",
          type: "autocomplete",
          label: "Choose Shareholder to Update",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "shareholder_profiles" },
            dependsOn: ["values.shg"],
            dependsOnHint: "Select SHG first",
            queryBuilder: (deps) => ({
              type: "shareholder_profiles",
              id: deps.shg
            })
          },
          rules: [{ when: "values.action !== 'update'", action: "hide" }],
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "byShareholderAmount",
          type: "text",
          label: "By Shareholder (Rs. 500)",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "byShareholderDate",
          type: "date",
          label: "By Shareholder Deposit Date",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "byProjectAmount",
          type: "text",
          label: "By Project (Equity Matching Grant Rs. 500)",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "byProjectDate",
          type: "date",
          label: "By Project Deposit Date",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "totalByShareholder",
          type: "text",
          label: "Total by Shareholder",
          validations: [{ type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "totalByProject",
          type: "text",
          label: "Total by Project (Matching Grant)",
          validations: [{ type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "approved",
          type: "checkbox",
          label: "Approved",
          options: {
            items: [
              { label: "Yes", value: true },
              { label: "No", value: false }
            ]
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    }
  ]
};
