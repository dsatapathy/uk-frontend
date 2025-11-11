export const pgProfileSchema = {
  $schema: "fe.v1",
  id: "pg-profile-update",
  version: "1.0.0",
  title: "PG Profile Update",
  sections: [
    {
      id: "pg-details",
      title: "PG Profile Details",
      fields: [
        {
          id: "action",
          type: "radio-group",
          label: "Action",
          defaultValue: "create",
          options: {
            items: [
              { label: "Create New PG", value: "create" },
              { label: "Update Existing PG", value: "update" }
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
            query: { type: "districts" }  // This will be sent as query params
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
          id: "lc",
          type: "autocomplete",
          label: "LC",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "lc_profiles" },
            dependsOn: ["values.block"],
            queryBuilder: (deps) => ({ type: "lc_profiles", id: deps.block })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pgName",
          type: "text",
          label: "PG Name",
          validations: [{ type: "required" }],
          rules: [{ when: "values.action === 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
       {
          id: "pgId",
          type: "autocomplete",
          label: "Select PG Name to update",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "name",
            valueKey: "id",
            query: { type: "pg_profiles" },
            dependsOn: ["values.lc"],
            queryBuilder: (deps) => ({ type: "pg_profiles", id: deps.lc })
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.action !== 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pgCode",
          type: "text",
          label: "PG Code",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "registrationDate",
          type: "date",
          label: "Date of Registration",
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "address",
          type: "text",
          label: "Address",
          props: { placeholder: "Hamlet, GP, Block, District" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "totalMembers",
          type: "text",
          label: "Total Members",
          validations: [{ type: "required" },
            { type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "maleMembers",
          type: "text",
          label: "Male Members",
          validations: [{ type: "required" },
            { type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "femaleMembers",
          type: "text",
          label: "Female Members",
          validations: [{ type: "required" },
            { type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
         {
          id: "presidentElected",
          type: "radio-group",
          label: "President Elected",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "meetingFrequency",
          type: "autocomplete",
          label: "PG Meeting Frequency",
           options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "meeting_frequency" }  // This will be sent as query params
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "livelihoodCommitteeFormed",
          type: "radio-group",
          label: "Livelihood Committee Formation",
          validations: [{ type: "required" }],
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "valueChain1",
          type: "autocomplete",
          label: "Value Chain 1",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "valueChain2",
          type: "autocomplete",
          label: "Value Chain 2",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "valueChain3",
          type: "autocomplete",
          label: "Value Chain 3",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "accountBooksMaintained",
          type: "radio-group",
          label: "Account Books Maintained",
          validations: [{ type: "required" }],
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "monthlySavingsRate",
          type: "text",
          label: "Monthly Savings Rate (Rs)",
          validations: [{ type: "required" },
            { type: "pattern", value: "^(|\\d+)$", message: "Only numbers allowed" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "fsipFundReceived",
          type: "radio-group",
          label: "FSIP Fund Received",
          validations: [{ type: "required" }],
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "bankSakhi",
          type: "radio-group",
          label: "Bank Sakhi",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pashuSakhi",
          type: "radio-group",
          label: "Pashu Sakhi",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "krishiSakhi",
          type: "radio-group",
          label: "Krishi Sakhi",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pgBankName",
          type: "text",
          label: "PG Bank Name",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pgAccountNumber",
          type: "text",
          label: "PG A/C No.",
          validations: [{ type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Only numbers allowed" }
          ],
          props: { maxLength: 24 },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pgIfscCode",
          type: "text",
          label: "PG IFSC Code",
          validations: [{ type: "required" },
            { type: "pattern", value: "^[A-Z]{4}0[A-Z0-9]{6}$", message: "Invalid IFSC code format" }
          ],
          props: { maxLength: 11, placeholder: "e.g., HDFC0001234"  },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "meansOfVerification",
          type: "text",
          label: "Means of Verification",
          props: { placeholder: "Enter verification details" },
          grid: { span: { xs: 12, sm: 12, md: 8 } }
        }
      ]
    }
  ]
};

