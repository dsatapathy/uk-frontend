// member-profile.schema.js (aligned to your components)
export const memberProfileSchema = {
  $schema: "fe.v1",
  id: "member-profile",
  version: "1.0.0",
  title: "Member Profile",

  sections: [
    // 1) Registration & Location
    {
      id: "registration",
      title: "Registration & Location",
      fields: [
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
            valueKey: "code",
            request: {
              method: "post",
              url: "v1/master/data",
              bodyTemplate: { type: "district" }
            }
          },
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
            dependsOnHint: "Select District first",
            request: {
              method: "post",
              url: "v1/master/data",
              bodyTemplate: {
                type: "block",
                district: "$values.district"
              }
            }
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
            dependsOnHint: "Select District and Block first",
            request: {
              method: "post",
              url: "v1/master/data",
              bodyTemplate: {
                type: "gp",
                district: "$values.district",
                block: "$values.block"
              }
            }
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
            dependsOnHint: "Select District, Block and GP first",
            request: {
              method: "post",
              url: "v1/master/data",
              bodyTemplate: {
                type: "village",
                district: "$values.district",
                block: "$values.block",
                gp: "$values.gp"
              }
            }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 2) Association with CBOs / Institutions
    {
      id: "association",
      title: "Association",
      fields: [
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
          id: "uid",
          type: "text",
          label: "UID",
          helperText: "From LokOS or generated by the platform",
          validations: [{ type: "required" }],
          props: { maxLength: 32, placeholder: "e.g., LK-00123" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 3) Personal Information (A)
    {
      id: "personalA",
      title: "Personal Information",
      fields: [
        {
          id: "guardianName",
          type: "text",
          label: "Husband/Father's Name",
          validations: [{ type: "required" }],
          props: { maxLength: 80, placeholder: "Enter full name" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "mobile",
          type: "text",
          label: "Mobile No.",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile" }
          ],
          props: { maxLength: 10, placeholder: "10-digit number" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "aadhaar",
          type: "text",
          label: "Aadhaar No.",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d{12}$", message: "12 digits" }
          ],
          props: { maxLength: 12, placeholder: "12-digit Aadhaar" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "voterId",
          type: "text",
          label: "Voter ID",
          validations: [{ type: "required" }],
          props: { maxLength: 20, placeholder: "EPIC No." },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "rationType",
          type: "autocomplete",
          label: "Ration Card Type",
          options: { endpointKey: "rationTypes", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "education",
          type: "autocomplete",
          label: "Education",
          options: { endpointKey: "educationLevels", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 4) Personal Information (B)
    {
      id: "personalB",
      title: "Demographics",
      fields: [
        {
          id: "dob",
          type: "date",
          label: "Date of Birth",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "age",
          type: "number",
          label: "Age",
          validations: [{ type: "required" }],
          props: { min: 0, step: 1 },
          config: { inputMode: "numeric" },
          rules: [
            {
              when: "values.dob",
              action: "derive",
              value:
                "Math.max(0, Math.floor((Date.now() - new Date(values.dob)) / 31557600000))"
            },
            { when: "values.dob", action: "disable" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "socialCategory",
          type: "autocomplete",
          label: "Social Category",
          options: { endpointKey: "socialCategories", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "pwd",
          type: "radio-group",
          label: "Person with Disability (PWD)",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "religion",
          type: "autocomplete",
          label: "Religion",
          options: { endpointKey: "religions", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "maritalStatus",
          type: "autocomplete",
          label: "Marital Status",
          options: { endpointKey: "maritalStatuses", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "seccCategory",
          type: "autocomplete",
          label: "POOR/SECC Category",
          options: { endpointKey: "seccCategories", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "diffAbledSelf",
          type: "radio-group",
          label: "Differently-abled (Self)",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "tribal",
          type: "autocomplete",
          label: "Tribal Group",
          options: { endpointKey: "tribalGroups", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 5) Household Profile
    {
      id: "household",
      title: "Household Profile",
      fields: [
        { id: "hhSize", type: "number", label: "Household Size", validations: [{ type: "required" }], props: { min: 1, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "children05", type: "number", label: "No. of Children (0–5 yrs)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "schoolChildren", type: "number", label: "No. of School-Going Children", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "headOfHousehold", type: "autocomplete", label: "Head of Household", options: { endpointKey: "hohOptions", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "houseType", type: "autocomplete", label: "Type of House", options: { endpointKey: "houseTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "electricity", type: "radio-group", label: "Electricity Access", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "drinkingWater", type: "autocomplete", label: "Drinking Water Source", options: { endpointKey: "waterSources", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "sanitation", type: "autocomplete", label: "Sanitation Facility", options: { endpointKey: "sanitationTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "lpg", type: "radio-group", label: "LPG", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } }
      ]
    },

    // 6) Livelihood & Economic Activities
    {
      id: "livelihood",
      title: "Livelihood & Economic Activities",
      fields: [
        { id: "landOwnership", type: "radio-group", label: "Land Ownership", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "totalLand", type: "number", label: "Total Land (Nali)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "irrigatedLand", type: "number", label: "Irrigated land Area (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "rainfedLand", type: "number", label: "Rainfed land Area (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "uncultivatedLand", type: "number", label: "Uncultivated land (Nali)", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        // NOTE: MultiSelect expects static items. If you need async here, add an async-multi component later.
        {
          id: "majorCrops", type: "multiselect", label: "Major Crops Grown",
          options: { items: [] /* e.g. [{label:'Wheat', value:'wheat'}] */ },
          validations: [{ type: "required" }],
          rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
          grid: { span: { xs: 12, sm: 12, md: 8 } }
        },

        { id: "ownsLivestock", type: "radio-group", label: "Owns Livestock", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "cowCount", type: "number", label: "Cow", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "bullCount", type: "number", label: "Bull/Ox", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "buffaloCount", type: "number", label: "Buffalo", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },

        { id: "nonFarmActivity", type: "autocomplete", label: "Non-Farm Activities", options: { endpointKey: "nonFarmActivities", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "wageLabour", type: "autocomplete", label: "Wage Labour", options: { endpointKey: "wageLabourTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "migration", type: "radio-group", label: "Migration (Self or Family)", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        {
          id: "migrationPurpose", type: "autocomplete", label: "Migration Purpose",
          options: { endpointKey: "migrationPurposes", labelKey: "label", valueKey: "value" },
          rules: [{ when: "values.migration !== 'Yes'", action: "hide" }, { when: "values.migration === 'Yes'", action: "require" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 7) Income & Financial Inclusion
    {
      id: "income",
      title: "Income & Financial Inclusion",
      fields: [
        { id: "annualIncome", type: "autocomplete", label: "Annual Household Income (₹)", options: { endpointKey: "incomeBrackets", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "majorIncomeSource", type: "autocomplete", label: "Major Source of Income", options: { endpointKey: "incomeSources", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "savingsPerMonth", type: "number", label: "Saving (per-month/per-member)", validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "hasBankAccount", type: "radio-group", label: "Bank Account Holder", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "bankName", type: "text", label: "Benef. Bank Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "accountNo", type: "text", label: "Benef. Account No", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 24 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "branchName", type: "text", label: "Branch Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "accountType", type: "autocomplete", label: "Account Type", options: { endpointKey: "accountTypes", labelKey: "label", valueKey: "value" }, rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "ifsc", type: "text", label: "IFSC Code", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], validations: [{ type: "pattern", value: "^[A-Z]{4}0[A-Z0-9]{6}$", message: "Invalid IFSC" }], props: { maxLength: 11 }, grid: { span: { xs: 12, sm: 6, md: 4 } } }
      ]
    },

    // 8) Documents & Mapping (temp: text placeholders for uploads)
    {
      id: "documents",
      title: "Documents & Mapping",
      fields: [
        { id: "memberPhoto", type: "text", label: "Member Picture (URL / placeholder)", validations: [{ type: "required" }], props: { placeholder: "Attach/Upload later" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "disabilityCert", type: "text", label: "Disability Certificate (URL / placeholder)", props: { placeholder: "Attach if PWD = Yes" }, rules: [{ when: "values.pwd !== 'Yes'", action: "hide" }, { when: "values.pwd === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "aadhaarPhoto", type: "text", label: "Aadhaar Card Picture (URL / placeholder)", validations: [{ type: "required" }], props: { placeholder: "Attach/Upload later" }, grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "valueChainMapping", type: "autocomplete", label: "Value Chain Mapping", options: { endpointKey: "valueChains", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "pgMapping", type: "autocomplete", label: "PG Mapping", options: { endpointKey: "pgMappings", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "undertaking", type: "checkbox", label: "I confirm the information provided is correct", validations: [{ type: "required" }], grid: { span: { xs: 12 } } }
      ]
    }
  ]
};
