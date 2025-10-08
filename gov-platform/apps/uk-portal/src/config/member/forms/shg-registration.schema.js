const shgRegistrationSchema = {
  "$schema": "fe.v1",
  "id": "shg-registration",
  "version": "1.0.0",
  "title": "SHG Registration",
  "sections": [
    {
      "id": "shg-details",
      "title": "SHG Details",
      "fields": [
        {
          id: "action",
          type: "radio-group",
          label: "Action",
          defaultValue: "add",
          options: {
            items: [
              { label: "Add New Member", value: "add" },
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
            endpointKey: "districts",
            labelKey: "name",
            valueKey: "code"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
        },
        {
          id: "block",
          type: "autocomplete",
          label: "Block",
          options: {
            endpointKey: "blocks",
            labelKey: "name",
            valueKey: "code",
            dependsOn: ["values.district"],
            dependsOnHint: "Select District first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
        },
        {
          id: "gp",
          type: "autocomplete",
          label: "Gram Panchayat",
          options: {
            endpointKey: "gps",
            labelKey: "name",
            valueKey: "code",
            dependsOn: ["values.district", "values.block"],
            dependsOnHint: "Select District and Block first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
        },
        {
          id: "village",
          type: "autocomplete",
          label: "Village",
          options: {
            endpointKey: "villages",
            labelKey: "name",
            valueKey: "code",
            dependsOn: ["values.district", "values.block", "values.gp"],
            dependsOnHint: "Select District, Block and GP first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 }, }
        },
        {
          id: "clf",
          type: "autocomplete",
          label: "CLF",
          options: {
            endpointKey: "clfs",
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.block"],
            dependsOnHint: "Select Block first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "vo",
          type: "autocomplete",
          label: "VO",
          options: {
            endpointKey: "vos",
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.clf"],
            dependsOnHint: "Select CLF first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shg",
          type: "autocomplete",
          label: "SHG",
          options: {
            endpointKey: "shgs",
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.vo"],
            dependsOnHint: "Select VO first"
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shgCode",
          type: "number",
          label: "SHG Code",
          validations: [{ type: "required" }],
          props: { min: 0, step: 1 },
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        // ADD flow field
        {
          id: "memberName",
          type: "text",
          label: "Name of Member",
          validations: [{ type: "required" }],
          rules: [{ when: "values.action === 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        // UPDATE flow field
        {
          id: "memberToUpdate",
          type: "autocomplete",
          label: "Select Member to Update",
          options: {
            endpointKey: "shgMembers", labelKey: "name", valueKey: "id",
            dependsOn: ["values.shg"], dependsOnHint: "Select SHG first",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.action !== 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "shgJoinDate",
          type: "date",
          label: "Date of SHG Joining",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          "id": "address",
          "type": "text",
          "label": "Address",
          "description": "Format - Hamlet, GP, Block, District",
          "props": { "placeholder": "Hamlet, GP, Block, District" },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "totalMembers",
          "type": "number",
          "label": "Total Members",
          "description": "Total Members In The SHG",
          "props": { "min": 0, "step": 1, "inputMode": "numeric" },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "presidentElected",
          "type": "radio-group",
          "label": "President Elected",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "meetingFrequency",
          "type": "dropdown",
          "label": "SHG Meeting Frequency",
          "options": {
            "items": [
              { "label": "Week", "value": "week" },
              { "label": "Bi-Weekly", "value": "biweekly" },
              { "label": "Monthly", "value": "monthly" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "discussionOnUltraPoorIE",
          "type": "radio-group",
          "label": "Discussion About Ultra-poor/Individual Enterprises In SHG Meeting",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "livelihoodCommitteeFormation",
          "type": "radio-group",
          "label": "Livelihood Committee Formation",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },

        /* SHG Key Livelihood Activities (Value Chains) */
        {
          "id": "valueChain1",
          "type": "dropdown",
          "label": "Value Chain 1",
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "options": { "endpointKey": "valueChains", "labelKey": "name", "valueKey": "code" }
        },
        {
          "id": "valueChain2",
          "type": "dropdown",
          "label": "Value Chain 2",
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "options": { "endpointKey": "valueChains", "labelKey": "name", "valueKey": "code" }
        },
        {
          "id": "valueChain3",
          "type": "dropdown",
          "label": "Value Chain 3",
            "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "options": { "endpointKey": "valueChains", "labelKey": "name", "valueKey": "code" }
        },

        {
          "id": "accountBooksMaintained",
          "type": "radio-group",
          "label": "Account Books Maintained",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
            "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "monthlySavingsRate",
          "type": "number",
          "label": "Monthly Savings Rate (Rs)",
          "props": { "min": 0, "step": 1, "inputMode": "numeric" },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "interloanMemberCount",
          "type": "number",
          "label": "Interloan Member Count",
          "props": { "min": 0, "step": 1, "inputMode": "numeric" },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "revolvingFundReceived",
          "type": "radio-group",
          "label": "Revolving Fund Received",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "cifUsed",
          "type": "radio-group",
          "label": "CIF Used",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },

        /* If Any Member… (Sakhi / Training) */
        {
          "id": "bankSakhi",
          "type": "radio-group",
          "label": "Bank Sakhi",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
        },
        {
          "id": "pashuSakhi",
          "type": "radio-group",
          "label": "Pashu Sakhi",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
        },
        {
          "id": "krishiSakhi",
          "type": "radio-group",
          "label": "Krishi Sakhi",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
        },
        {
          "id": "basicShgTrainingCompleted",
          "type": "radio-group",
          "label": "Basic SHG Training Completed",
          "options": {
            "items": [
              { "label": "Yes", "value": "Yes" },
              { "label": "No", "value": "No" }
            ]
          },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
        },

        /* Banking */
        {
          "id": "shgBankName",
          "type": "text",
          "label": "SHG Bank Name",
          "description": "Name of the bank where SHG has an account.",
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "shgAccountNumber",
          "type": "text",
          "label": "SHG A/C No.",
          "description": "SHG bank account number.",
          "props": { "inputMode": "numeric" },
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },
        {
          "id": "shgIfsc",
          "type": "text",
          "label": "SHG IFSC Code",
          "description": "IFSC code of the bank associated with the SHG.",
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "validations": [{ "type": "required" }]
        },

        /* Evidence */
        {
          "id": "meansOfVerification",
          "type": "textarea",
          "label": "Means Of Verification",
          "grid": { "span": { "xs": 12, "sm": 6, "md": 4 } },
          "props": { "placeholder": "Enter details of verification (e.g., passbook, resolution copy, etc.)" }
        }
      ]
    }
  ]
};

export default shgRegistrationSchema;
