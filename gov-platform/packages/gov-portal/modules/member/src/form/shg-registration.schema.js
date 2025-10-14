export const shgRegistrationSchema = {
  $schema: "fe.v1",
  id: "shg-registration",
  version: "1.0.0",
  title: "SHG Registration",
  sections: [
    {
      id: "shg-details",
      title: "SHG Details",
      fields: [
        {
          id: "action",
          type: "radio-group",
          label: "Action",
          defaultValue: "create",
          options: {
            items: [
              { label: "Create New SHG", value: "create" },
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
            query: { type: "districts" }  // This will be sent as query params
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
            dependsOn: ["values.district", "values.block"],
            dependsOnHint: "Select District and Block first",
            queryBuilder: (deps) => ({
              type: "panchayats",
              id: deps.block
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
            dependsOn: ["values.district", "values.block", "values.gp"],
            dependsOnHint: "Select District, Block and GP first",
            queryBuilder: (deps) => ({
              type: "villages",
              id: deps.gp
            })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
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
          id: "shgId",
          type: "autocomplete",
          label: "SHG (Name)",
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
          rules: [{ when: "values.action !== 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        // ADD flow field
        {
          id: "shgCode",
          type: "text",
          label: "Enter SHG Code",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        // ADD flow field
        {
          id: "shgName",
          type: "text",
          label: "Name of SHG",
          validations: [{ type: "required" }],
          rules: [{ when: "values.action === 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "shgJoinDate",
          type: "date",
          label: "Date of SHG Registration",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "address",
          type: "text",
          label: "Address",
          description: "Format - Hamlet, GP, Block, District",
          props: { "placeholder": "Hamlet, GP, Block, District" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [{ type: "required" }]
        },
        {
          id: "totalMembers",
          type: "text",
          label: "Total Members",
          description: "Total Members In The SHG",
          grid: { span: { "xs": 12, "sm": 6, "md": 4 } },
          validations: [
            { type: "required"},
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ]
        },
        {
          id: "presidentElected",
          type: "radio-group",
          label: "President Elected",
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
          id: "meetingFrequency",
          type: "autocomplete",
          label: "SHG Meeting Frequency",
           options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "meeting_frequency" }  // This will be sent as query params
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [{ type: "required" }]
        },
        {
          id: "discussionOnUltraPoorIE",
          type: "radio-group",
          label: "Discussion About Ultra-poor/Individual Enterprises In SHG Meeting",
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
          id: "livelihoodCommitteeFormation",
          type: "radio-group",
          label: "Livelihood Committee Formation",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [{ type: "required" }]
        },

        /* SHG Key Livelihood Activities (Value Chains) */
        {
          id: "valueChain1",
          type: "autocomplete",
          label: "Value Chain 1",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
        },
        {
          id: "valueChain2",
          type: "autocomplete",
          label: "Value Chain 2",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
        },
        {
          id: "valueChain3",
          type: "autocomplete",
          label : "Value Chain 3",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
        },

        {
          id: "accountBooksMaintained",
          type: "radio-group",
          label: "Account Books Maintained",
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
          id: "monthlySavingsRate",
          type: "text",
          label: "Monthly Savings Rate (Rs)",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ]
        },
        {
          id: "interloanMemberCount",
          type: "text",
          label : "Interloan Member Count",
          // description: "Number of members who have taken inter-loan from SHG",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ]
        },
        {
          id: "revolvingFundReceived",
          type: "radio-group",
          label: "Revolving Fund Received",
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
          id: "cifUsed",
          type: "radio-group",
          label: "CIF Used",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [{ type  : "required" }]
        },

        /* If Any Member… (Sakhi / Training) */
        {
          id    : "bankSakhi",
          type: "radio-group",
          label: "Bank Sakhi",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "pashuSakhi",
          type: "radio-group",
          label: "Pashu Sakhi",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "krishiSakhi",
          type: "radio-group",
          label: "Krishi Sakhi",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "basicShgTrainingCompleted",
          type: "radio-group",
          label: "Basic SHG Training Completed",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* Banking */
        {
          id: "shgBankName",
          type: "text",
          label: "SHG Bank Name",
          description: "Name of the bank where SHG has an account.",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          validations: [{ type: "required" }]
        },
        {
          id: "shgAccountNumber",
          type: "text",
          label: "SHG Bank A/C No.",
          description: "SHG bank account number.",
          // props: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          props: { maxLength: 24 },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ]
        },
        {
          id: "shgIfsc",
          type: "text",
          label: "SHG Bank IFSC Code",
          description: "IFSC code of the bank associated with the SHG.",
          grid: { span: { xs: 12, sm: 6, md: 4 } },
      
          validations: [
            { type: "required" },
            { 
              type: "pattern", 
              value: "^[A-Z]{4}0[A-Z0-9]{6}$", 
              message: "Invalid IFSC" 
            }
          ], 
          props: { maxLength: 11 },
        },

        /* Evidence */
        {
          id: "meansOfVerification",
          type: "textarea",
          label: "Means Of Verification",
          grid: { span: { xs: 12, sm: 12, md: 12 } },
          props: { placeholder  : "Enter details of verification (e.g., passbook, resolution copy, etc.)" }
        }
      ]
    }
  ]
}
