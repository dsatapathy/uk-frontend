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
          defaultValue: "create",
          options: {
            items: [
              { label: "Add New Member", value: "create" },
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
          id: "shgCode",
          type: "text",
          label: "SHG Code",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          props: { min: 0, step: 1, placeholder: "Please enter code " },
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
          id: "memberId",
          type: "autocomplete",
          label: "Select Member to Update",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "member_profiles" },
            labelKey: "memberName",
            valueKey: "memberId",
            dependsOn: ["values.shg"],
            dependsOnHint: "Select SHG first",
            queryBuilder: (deps) => ({
              type: "member_profiles",
              id: deps.shg
            }),
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
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
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
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "ration_types" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "education",
          type: "autocomplete",
          label: "Education",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "education_levels" }
          },
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
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "age",
          // type: "number",
          // label: "Age",
          // validations: [{ type: "required" }],
          // props: { min: 0, step: 1 },
          // config: { inputMode: "numeric" },
          // rules: [
          //   {
          //     when: "values.dob",
          //     action: "derive",
          //     value:
          //       "Math.max(0, Math.floor((Date.now() - new Date(values.dob)) / 31557600000))"
          //   },
          //   { when: "values.dob", action: "disable" }
          // ],
          // grid: { span: { xs: 12, sm: 6, md: 4 } }
          type: "text",
          label: "Age",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          props: { min: 0, step: 1 },
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "socialCategory",
          type: "autocomplete",
          label: "Social Category",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "social_categories" }
          },
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
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "religions" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "maritalStatus",
          type: "autocomplete",
          label: "Marital Status",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "marital_status" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "seccCategory",
          type: "autocomplete",
          label: "POOR/SECC Category",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "poor_sec_categories" }
          },
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
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "tribal_groups" }
          },
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
        {
          id: "hhSize",
          type: "text",
          label: "Household Size",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          props: { min: 1, step: 1 },
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "children05",
          type: "text",
          label: "No. of Children (0–5 yrs)",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          props: { min: 0, step: 1 },
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "schoolChildren",
          type: "text",
          label: "No. of School-Going Children",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          props: { min: 0, step: 1 },
          config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "headOfHousehold",
          type: "autocomplete",
          label: "Head of Household",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "head_of_household" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "houseType",
          type: "autocomplete",
          label: "Type of House",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "house_types" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "electricity",
          type: "radio-group",
          label: "Electricity Access",
          options: {
            items: [{ label: "Yes", value: "Yes" },
            { label: "No", value: "No" }]
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "drinkingWater",
          type: "autocomplete",
          label: "Drinking Water Source",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "water_source" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "sanitation",
          type: "autocomplete",
          label: "Sanitation Facility",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "sanitation_facilities" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "lpg",
          type: "radio-group",
          label: "LPG",
          options: {
            items: [{ label: "Yes", value: "Yes" },
            { label: "No", value: "No" }]
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    },

    // 6) Livelihood & Economic Activities
    {
      id: "livelihood",
      title: "Livelihood & Economic Activities",
      fields: [
        {
          id: "landOwnership",
          type: "radio-group",
          label: "Land Ownership",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" }
            ]
          },
          validations: [
            { type: "required" }
          ],
          grid: {
            span: { xs: 12, sm: 6, md: 4 }
          }
        },
        {
          id: "totalLand",
          type: "text",
          label: "Total Land (Nali)",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "irrigatedLand",
          type: "text",
          label: "Irrigated land Area (Nali)",
          validations: [
            { type: "pattern", value: "^(|\\d+)$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "rainfedLand",
          type: "text",
          label: "Rainfed land Area (Nali)",
          validations: [
            { type: "pattern", value: "^(|\\d+)$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "uncultivatedLand",
          type: "text",
          label: "Uncultivated land (Nali)",
          validations: [
            { type: "pattern", value: "^(|\\d+)$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.landOwnership === 'No'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        // NOTE: MultiSelect expects static items. If you need async here, add an async-multi component later.
        // { id: "majorCrops", type: "multiselect", label: "Major Crops Grown",
        //   options: { items: [{label:'Wheat', value:'wheat'}] /* e.g. [{label:'Wheat', value:'wheat'}] */ },
        //   validations: [{ type: "optional" }],
        //   rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
        //   grid: { span: { xs: 12, sm: 12, md: 8 } }
        // },

        { id: "ownsLivestock", type: "radio-group", label: "Owns Livestock", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        {
          id: "cowCount",
          type: "text",
          label: "Cow",
          validations: [
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } }
        },
        {
          id: "bullCount",
          type: "text",
          label: "Bull/Ox",
          validations: [
            { type: "pattern", value: "^(|\\d+)$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 3 } }
        },
        {
          id: "buffaloCount",
          type: "text",
          label: "Buffalo",
          validations: [
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } }
        },

        {
          id: "nonFarmActivity",
          type: "autocomplete",
          label: "Non-Farm Activities",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "non_farm_activities" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "wageLabour",
          type: "autocomplete",
          label: "Wage Labour",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "wage_labour_types" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        {
          id: "migration",
          type: "radio-group",
          label: "Migration (Self or Family)",
          options: {
            items: [{ label: "Yes", value: "Yes" },
            { label: "No", value: "No" }]
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "migrationPurpose",
          type: "autocomplete",
          label: "Migration Purpose",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "migration_purposes" }
          },
          rules: [{ when: "values.migration !== 'Yes'", action: "hide" },
          { when: "values.migration === 'Yes'", action: "require" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "majorCropsGrown",
          type: "text",
          label: "Enter Major Crops Grown",
          validations: [{ type: "required" }],
          props: { maxLength: 100, placeholder: "Like Wheat, Rice, Potato etc." },
          grid: { span: { xs: 12, sm: 6, md: 6 } }
        }
      ]
    },

    // 7) Income & Financial Inclusion
    {
      id: "income",
      title: "Income & Financial Inclusion",
      fields: [
        {
          id: "annualIncome",
          type: "autocomplete",
          label: "Annual Household Income (₹)",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "income_brackets" }
          },
          validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "majorIncomeSource",
          type: "autocomplete",
          label: "Major Source of Income",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "income_source" }
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "savingsPerMonth",
          type: "text",
          label: "Saving (per-month/per-member)",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
          ],
          // props: { min: 0, step: 1 }, 
          // config: { inputMode: "numeric" }, 
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        { id: "hasBankAccount", type: "radio-group", label: "Bank Account Holder", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "bankName", type: "text", label: "Benef. Bank Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "accountNo", type: "text", label: "Benef. Account No", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 24 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "branchName", type: "text", label: "Branch Name", rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }, { when: "values.hasBankAccount === 'Yes'", action: "require" }], props: { maxLength: 80 }, grid: { span: { xs: 12, sm: 6, md: 4 } } },
        {
          id: "accountType",
          type: "autocomplete",
          label: "Account Type",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "account_types" }
          },
          rules: [
            { when: "values.hasBankAccount !== 'Yes'", action: "hide" },
            { when: "values.hasBankAccount === 'Yes'", action: "require" }
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        { id: "ifsc", 
          type: "text", 
          label: "IFSC Code", 
          rules: [
            { when: "values.hasBankAccount !== 'Yes'", action: "hide" }, 
            { when: "values.hasBankAccount === 'Yes'", action: "require" }
          ], 
          validations: [
            { 
              type: "pattern", 
              value: "^[A-Z]{4}0[A-Z0-9]{6}$", 
              message: "Invalid IFSC" 
            }
          ], 
          props: { maxLength: 11 }, 
          grid: { span: { xs: 12, sm: 6, md: 4 } } }
      ]
    },

    // 8) Documents & Mapping (temp: text placeholders for uploads)
    {
      id: "documents",
      title: "Documents & Mapping",
      fields: [
        {
          id: "memberPhoto",
          type: "file",
          label: "Member Picture",
          helperText: "Attach now or upload later.",
          validations: [{ type: "required" }],
          props: {
            multiple: false,               // single image
            accept: "image/*",             // only images
            maxFiles: 1,                   // enforced anyway by multiple:false, but explicit is fine
            maxSizeMB: 5                   // e.g. 5 MB cap
          },
          grid: { span: { xs: 12, sm: 12, md: 12 } }
        },

        {
          id: "disabilityCert",
          type: "file",
          label: "Disability Certificate",
          helperText: "Attach if PWD = Yes (PDF or image).",
          props: {
            multiple: false,
            accept: "application/pdf,image/*", // pdf or image
            maxFiles: 1,
            maxSizeMB: 10
          },
          rules: [
            { when: "values.pwd !== 'Yes'", action: "hide" },
            { when: "values.pwd === 'Yes'", action: "require" }
          ],
          grid: { span: { xs: 12, sm: 12, md: 12 } }
        },

        {
          id: "aadhaarPhoto",
          type: "file",
          label: "Aadhaar Card Picture",
          helperText: "Attach Aadhaar front photo (image only).",
          validations: [{ type: "required" }],
          props: {
            multiple: false,
            accept: "image/*",
            maxFiles: 5,
            maxSizeMB: 5
          },
          grid: { span: { xs: 12, sm: 12, md: 12 } }
        },
        {
          id: "valueChainMapping",
          type: "autocomplete",
          label: "Value Chain Mapping",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "value_chain" },
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 6 } }
        },
        {
          id: "pgMapping",
          type: "autocomplete",
          label: "PG Mapping",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "pg_mapping" },
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 6 } }
        },

        { id: "undertaking", type: "checkbox", label: "I confirm the information provided is correct", validations: [{ type: "required" }], grid: { span: { xs: 12 } } }
      ]
    }
  ]
};
