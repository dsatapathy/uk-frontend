export const awpbRawpbFinanceDataUpdateSchema = {
  $schema: "fe.v1",
  id: "awpb-rawpb-finance-data-update-form",
  version: "1.0.0",
  title: "AWPB / RAWPB Finance Data Update",
  sections: [
    {
      id: "awpb-rawpb-finance-data-update-section",
      title: "AWPB / RAWPB Finance Update Details",
      fields: [
        /* --- Master modeOfSelector Selector --- */
        {
          id: "modeOfSelector",
          type: "dropdown",
          label: "Tasks",
          options: {
            labelKey: "label",
            valueKey: "value",
            items: [
              { label: "Annual Work Plan Budget (AWPB) – Freeze", value: "AWPB_TARGET_FREEZE" },
              { label: "Revised Annual Budget Targets Freeze (RAWPB)", value: "RAWPB_TARGET_FREEZE" },
              { label: "Site Specific Planning AWPB/RAWPB", value: "AWPB_SITE_SPECIFIC_PLANNING" },
              { label: "Budget Planning", value: "MAIN_BUDGET_PLANNING_AWPB" },
            ],
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12 } },
        },

        // ==========================================================
        // modeOfSelector 1: AWPB Freeze
        // ==========================================================
        {
          id: "awpb_district",
          type: "autocomplete",
          label: "District",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_pmu",
          type: "text",
          label: "PMU",
          props: { disabled: true },
          defaultValue: "Project Management Unit (PMU)",
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_type",
          type: "dropdown",
          label: "Type",
          options: {
            items: [
              { label: "AWPB", value: "awpb" },
              { label: "RAWPB", value: "rawpb" },
            ],
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_activityHead",
          type: "autocomplete",
          label: "Activity Head",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "activity_heads" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_subActivity",
          type: "autocomplete",
          label: "Sub Activity",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "sub_activities" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_financialYear",
          type: "autocomplete",
          label: "Finance Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_unitFor",
          type: "text",
          label: "Unit For",
          placeholder: "Enter unit of measurement (e.g., training, sessions)",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_unitCost",
          type: "text",
          label: "Unit Cost (₹)",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter valid amount" },
          ],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_totalUnits",
          type: "text",
          label: "Total Units",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Enter valid number" },
          ],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_totalAmount",
          type: "text",
          label: "Total Amount (₹)",
          props: { disabled: true },
          placeholder: "Auto-calculated (Unit Cost × Total Units)",
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "awpb_checkApproval",
          type: "dropdown",
          label: "Check & Approval",
          options: {
            items: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
          rules: [{ when: "values.modeOfSelector !== 'AWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        // ==========================================================
        // modeOfSelector 2: RAWPB Freeze
        // ==========================================================
        {
          id: "rawpb_district",
          type: "autocomplete",
          label: "District",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rawpb_financialYear",
          type: "autocomplete",
          label: "Finance Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rawpb_activityName",
          type: "text",
          label: "Name of Activity",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rawpb_unitCost",
          type: "text",
          label: "Unit Cost (₹)",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rawpb_totalUnits",
          type: "text",
          label: "Total Units",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rawpb_totalAmt",
          type: "text",
          label: "Total Amount (₹)",
          props: { disabled: true },
          rules: [{ when: "values.modeOfSelector !== 'rAWPB_TARGET_FREEZE'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        // ==========================================================
        // modeOfSelector 3: Site Specific Planning
        // ==========================================================
        {
          id: "site_district",
          type: "autocomplete",
          label: "District",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_SITE_SPECIFIC_PLANNING'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "site_financialYear",
          type: "autocomplete",
          label: "Finance Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_SITE_SPECIFIC_PLANNING'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "site_activityName",
          type: "text",
          label: "Name of Activity",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_SITE_SPECIFIC_PLANNING'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "site_blockName",
          type: "autocomplete",
          label: "Block Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "blocks" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.site_district"],
            queryBuilder: (deps) => ({ type: "blocks", id: deps.site_district }),
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_SITE_SPECIFIC_PLANNING'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "site_tallyCode",
          type: "text",
          label: "Tally Code",
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'AWPB_SITE_SPECIFIC_PLANNING'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        // ==========================================================
        // modeOfSelector 4: Budget Planning
        // ==========================================================
        {
          id: "bp_district",
          type: "autocomplete",
          label: "District",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'MAIN_BUDGET_PLANNING_AWPB'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "bp_financialYear",
          type: "autocomplete",
          label: "Finance Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'MAIN_BUDGET_PLANNING_AWPB'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "bp_component",
          type: "autocomplete",
          label: "Component",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "components" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.modeOfSelector !== 'MAIN_BUDGET_PLANNING_AWPB'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
      ],
    },
  ],
};
