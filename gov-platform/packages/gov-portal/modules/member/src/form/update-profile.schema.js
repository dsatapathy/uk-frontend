// member-profile.schema.js (output-mapped by section)
export const updateMemberProfileSchema = {
  $schema: "fe.v1",
  id: "update-profile",
  version: "1.0.0",
  title: "Update Member Profile",

  sections: [
    /* ───────────────── 1) Registration & Location ───────────────── */
    {
      id: "registration",
      title: "Registration & Location",
      output: { key: "registration", type: "object" },
      fields: [
        {
          id: "action",
          type: "radio-group",
          label: "Action",
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
          options: { endpointKey: "districts", labelKey: "name", valueKey: "code" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
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
          grid: { span: { xs: 12, sm: 6, md: 4 } }
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
          grid: { span: { xs: 12, sm: 6, md: 4 } }
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
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // /* ───────────────── 2) Association ───────────────── */
    // {
    //   id: "association",
    //   title: "Association",
    //   output: { key: "association", type: "object" },
    //   fields: [
    //     {
    //       id: "clf",
    //       type: "autocomplete",
    //       label: "CLF",
    //       options: {
    //         endpointKey: "clfs",
    //         labelKey: "name",
    //         valueKey: "id",
    //         dependsOn: ["values.block"],
    //         dependsOnHint: "Select Block first"
    //       },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "vo",
    //       type: "autocomplete",
    //       label: "VO",
    //       options: {
    //         endpointKey: "vos",
    //         labelKey: "name",
    //         valueKey: "id",
    //         dependsOn: ["values.clf"],
    //         dependsOnHint: "Select CLF first"
    //       },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "shg",
    //       type: "autocomplete",
    //       label: "SHG",
    //       options: {
    //         endpointKey: "shgs",
    //         labelKey: "name",
    //         valueKey: "id",
    //         dependsOn: ["values.vo"],
    //         dependsOnHint: "Select VO first"
    //       },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "shgCode",
    //       type: "number",
    //       label: "SHG Code",
    //       validations: [{ type: "required" }],
    //       props: { min: 0, step: 1 },
    //       config: { inputMode: "numeric" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "memberName",
    //       type: "autocomplete",
    //       label: "Name of Member",
    //       options: {
    //         endpointKey: "shgMembers",
    //         labelKey: "name",
    //         valueKey: "id",
    //         dependsOn: ["values.shg"],
    //         dependsOnHint: "Select SHG first"
    //       },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "shgJoinDate",
    //       type: "date",
    //       label: "Date of SHG Joining",
    //       validations: [{ type: "required" }],
    //       props: { format: "DD/MM/YYYY" },
    //       config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "uid",
    //       type: "text",
    //       label: "UID",
    //       helperText: "From LokOS or generated by the platform",
    //       validations: [{ type: "required" }],
    //       props: { maxLength: 32, placeholder: "e.g., LK-00123" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     }
    //   ]
    // },

    // /* ───────────────── 3) Personal Information (A) ───────────────── */
    // {
    //   id: "personalA",
    //   title: "Personal Information",
    //   output: { key: "personalA", type: "object" },
    //   fields: [
    //     {
    //       id: "guardianName",
    //       type: "text",
    //       label: "Husband/Father's Name",
    //       validations: [{ type: "required" }],
    //       props: { maxLength: 80, placeholder: "Enter full name" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "mobile",
    //       type: "text",
    //       label: "Mobile No.",
    //       validations: [
    //         { type: "required" },
    //         { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile" }
    //       ],
    //       props: { maxLength: 10, placeholder: "10-digit number" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "aadhaar",
    //       type: "text",
    //       label: "Aadhaar No.",
    //       validations: [
    //         { type: "required" },
    //         { type: "pattern", value: "^\\d{12}$", message: "12 digits" }
    //       ],
    //       props: { maxLength: 12, placeholder: "12-digit Aadhaar" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "voterId",
    //       type: "text",
    //       label: "Voter ID",
    //       validations: [{ type: "required" }],
    //       props: { maxLength: 20, placeholder: "EPIC No." },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "rationType",
    //       type: "autocomplete",
    //       label: "Ration Card Type",
    //       options: { endpointKey: "catalog/rationTypes", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "education",
    //       type: "autocomplete",
    //       label: "Education",
    //       options: { endpointKey: "catalog/educationLevels", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     }
    //   ]
    // },

    // /* ───────────────── 4) Personal Information (B) ───────────────── */
    // {
    //   id: "personalB",
    //   title: "Demographics",
    //   output: { key: "personalB", type: "object" },
    //   fields: [
    //     {
    //       id: "dob",
    //       type: "date",
    //       label: "Date of Birth",
    //       validations: [{ type: "required" }],
    //       props: { format: "DD/MM/YYYY" },
    //       // optional field-level output transform example:
    //       output: { transform: "date:YYYY-MM-DD" },
    //       config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "age",
    //       type: "number",
    //       label: "Age",
    //       validations: [{ type: "required" }],
    //       props: { min: 0, step: 1 },
    //       config: { inputMode: "numeric" },
    //       rules: [
    //         {
    //           when: "values.dob",
    //           action: "derive",
    //           value: "Math.max(0, Math.floor((Date.now() - new Date(values.dob)) / 31557600000))"
    //         },
    //         { when: "values.dob", action: "disable" }
    //       ],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "socialCategory",
    //       type: "autocomplete",
    //       label: "Social Category",
    //       options: { endpointKey: "catalog/socialCategories", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "pwd",
    //       type: "radio-group",
    //       label: "Person with Disability (PWD)",
    //       options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "religion",
    //       type: "autocomplete",
    //       label: "Religion",
    //       options: { endpointKey: "catalog/religions", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "maritalStatus",
    //       type: "autocomplete",
    //       label: "Marital Status",
    //       options: { endpointKey: "catalog/maritalStatuses", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "seccCategory",
    //       type: "autocomplete",
    //       label: "POOR/SECC Category",
    //       options: { endpointKey: "catalog/seccCategories", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "diffAbledSelf",
    //       type: "radio-group",
    //       label: "Differently-abled (Self)",
    //       options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     },
    //     {
    //       id: "tribal",
    //       type: "autocomplete",
    //       label: "Tribal Group",
    //       options: { endpointKey: "catalog/tribalGroups", labelKey: "label", valueKey: "value" },
    //       validations: [{ type: "required" }],
    //       grid: { span: { xs: 12, sm: 6, md: 4 } }
    //     }
    //   ]
    // },

    // /* ───────────────── 5) Household Profile ───────────────── */
    // {
    //   id: "household",
    //   title: "Household Profile",
    //   output: { key: "household", type: "object" },
    //   fields: [
    //     { id: "hhSize", type: "number", label: "Household Size", validations: [{ type: "required" }], props: { min: 1, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "children05", type: "number", label: "No. of Children (0–5 yrs)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "schoolChildren", type: "number", label: "No. of School-Going Children", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "headOfHousehold", type: "autocomplete", label: "Head of Household", options: { endpointKey: "catalog/hohOptions", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "houseType", type: "autocomplete", label: "Type of House", options: { endpointKey: "catalog/houseTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "electricity", type: "radio-group", label: "Electricity Access", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "drinkingWater", type: "autocomplete", label: "Drinking Water Source", options: { endpointKey: "catalog/waterSources", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "sanitation", type: "autocomplete", label: "Sanitation Facility", options: { endpointKey: "catalog/sanitationTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "lpg", type: "radio-group", label: "LPG", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } }
    //   ]
    // },

    /* ───────────────── 6) Livelihood & Economic Activities ───────────────── */
    {
      id: "livelihood",
      title: "Livelihood & Economic Activities",
      output: { key: "livelihood", type: "object" },
      fields: [
        {
          id: "addhaarNo",
          type: "text",
          label: "Adhar No",
          validations: [{ type: "required" }],
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
          props: { placeholder: "Enter Adhar No", min: 0, step: 1 }
        },

        { id: "landOwnership", type: "radio-group", label: "Land Ownership", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } }, placeholder: "Select an option" },
        { id: "totalLand", type: "text", label: "Total Land (Nali)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } }, props: { placeholder: "Enter total land owned" } },
        { id: "irrigatedLand", type: "text", label: "Irrigated land Area (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } }, props: { placeholder: "Enter irrigated land area" } },
        { id: "rainfedLand", type: "text", label: "Rainfed land Area (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } }, props: { placeholder: "Enter rainfed land area" } },
        { id: "uncultivatedLand", type: "text", label: "Uncultivated land (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } }, props: { placeholder: "Enter uncultivated land area" } },

        { id: "ownsLivestock", type: "radio-group", label: "Owns Livestock", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "cowCount", type: "text", label: "Cow", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "bullCount", type: "text", label: "Bull/Ox", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "buffaloCount", type: "text", label: "Buffalo", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },

        { id: "nonFarmActivity", type: "autocomplete", label: "Non-Farm Activities", options: { endpointKey: "catalog/nonFarmActivities", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "wageLabour", type: "autocomplete", label: "Wage Labour", options: { endpointKey: "catalog/wageLabourTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "migration", type: "radio-group", label: "Migration (Self or Family)", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        {
          id: "migrationPurpose",
          type: "autocomplete",
          label: "Migration Purpose",
          options: { endpointKey: "catalog/migrationPurposes", labelKey: "label", valueKey: "value" },
          rules: [{ when: "values.migration !== 'Yes'", action: "hide" }, { when: "values.migration === 'Yes'", action: "require" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // /* ───────────────── 7) Income & Financial Inclusion ───────────────── */
    // {
    //   id: "income",
    //   title: "Income & Financial Inclusion",
    //   output: { key: "income", type: "object" },
    //   fields: [
    //     { id: "annualIncome", type: "autocomplete", label: "Annual Household Income (₹)", options: { endpointKey: "catalog/incomeBrackets", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "majorIncomeSource", type: "autocomplete", label: "Major Source of Income", options: { endpointKey: "catalog/incomeSources", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "savingsPerMonth", type: "number", label: "Saving (per-month/per-member)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },

    //     { id: "hasBankAccount", type: "radio-group", label: "Bank Account Holder", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

    //     { id: "bankName", type: "text", label: "Benef. Bank Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "accountNo", type: "text", label: "Benef. Account No", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 24 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "branchName", type: "text", label: "Branch Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "accountType", type: "autocomplete", label: "Account Type", options: { endpointKey: "catalog/accountTypes", labelKey: "label", valueKey: "value" }, rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
    //     { id: "ifsc", type: "text", label: "IFSC", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 16 }, grid: { span: { xs: 12, sm: 6, md: 4 } } }
    //   ]
    // },

    /* ───────────────── 8) Documents & Mapping ───────────────── */
    {
      id: "documents",
      title: "Documents & Mapping",
      output: { key: "documents", type: "array", collect: "uploads" },
      fields: [
        {
          id: "memberPhoto",
          type: "file",
          label: "Member Picture",
          helperText: "Attach now or upload later.",
          validations: [{ type: "required" }],
          props: { multiple: true, accept: "image/*", maxFiles: 1, maxSizeMB: 5 },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "disabilityCert",
          type: "file",
          label: "Disability Certificate",
          helperText: "Attach if PWD = Yes (PDF or image).",
          props: { multiple: false, accept: "application/pdf,image/*", maxFiles: 1, maxSizeMB: 10 },
          rules: [
            { when: "values.pwd !== 'Yes'", action: "hide" },
            { when: "values.pwd === 'Yes'", action: "require" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "aadhaarPhoto",
          type: "file",
          label: "Aadhaar Card Picture",
          helperText: "Attach Aadhaar front photo (image only).",
          rules: [{ when: "!!values.aadhaarNo", action: "require" }],
          props: { multiple: false, accept: "image/*", maxFiles: 1, maxSizeMB: 5 },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        { id: "valueChainMapping", type: "autocomplete", label: "Value Chain Mapping", options: { endpointKey: "catalog/valueChains", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "pgMapping", type: "autocomplete", label: "PG Mapping", options: { endpointKey: "catalog/pgMappings", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "undertaking", type: "checkbox", label: "I confirm the information provided is correct", validations: [{ type: "required" }], grid: { span: { xs: 12 } } }
      ]
    }
  ]
};
