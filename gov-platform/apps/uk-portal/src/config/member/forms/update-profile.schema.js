// member-profile.schema.js — complete
const memberProfileSchema = {
  $schema: "fe.v1",
  id: "member-profile",
  version: "1.0.0",
  title: "Member Profile",

  sections: [
    /* ───────────────────────── 1) Registration & Location ───────────────────────── */
    {
      id: "registration",
      title: "Registration & Location",
      fields: [
        {
          id: "action",
          type: "autocomplete",                     // dropdown per spec (Add / Update)
          label: "Action",
          options: {
            endpointKey: null,
            items: [
              { label: "Add New Member", value: "add" },
              { label: "Update Existing", value: "update" },
            ],
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        { id: "district",
          type: "autocomplete", label: "District",
          options: { endpointKey: "districts", labelKey: "name", valueKey: "code" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "block",
          type: "autocomplete", label: "Block",
          options: {
            endpointKey: "blocks", labelKey: "name", valueKey: "code",
            dependsOn: ["values.district"], dependsOnHint: "Select District first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "gp",
          type: "autocomplete", label: "Gram Panchayat",
          options: {
            endpointKey: "gps", labelKey: "name", valueKey: "code",
            dependsOn: ["values.district", "values.block"],
            dependsOnHint: "Select District and Block first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "village",
          type: "autocomplete", label: "Village",
          options: {
            endpointKey: "villages", labelKey: "name", valueKey: "code",
            dependsOn: ["values.district", "values.block", "values.gp"],
            dependsOnHint: "Select District, Block and GP first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ──────────────── 2) Association with CBOs / Institutions ──────────────── */
    {
      id: "association",
      title: "Members Association with CBOs/Institutions",
      fields: [
        { id: "clf",
          type: "autocomplete", label: "CLF",
          options: {
            endpointKey: "clfs", labelKey: "name", valueKey: "id",
            dependsOn: ["values.block"], dependsOnHint: "Select Block first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "vo",
          type: "autocomplete", label: "VO",
          options: {
            endpointKey: "vos", labelKey: "name", valueKey: "id",
            dependsOn: ["values.clf"], dependsOnHint: "Select CLF first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "shg",
          type: "autocomplete", label: "SHG",
          options: {
            endpointKey: "shgs", labelKey: "name", valueKey: "id",
            dependsOn: ["values.vo"], dependsOnHint: "Select VO first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "shgCode",
          type: "number", label: "SHG Code",
          validations: [{ type: "required" }],
          props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        /* For ADD vs UPDATE flows */
        { id: "memberName",
          type: "autocomplete", label: "Name of Member",
          options: {
            endpointKey: "shgMembers", labelKey: "name", valueKey: "id",
            dependsOn: ["values.shg"], dependsOnHint: "Select SHG first",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.action === 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "memberToUpdate",
          type: "autocomplete", label: "Select Member to Update",
          options: {
            endpointKey: "shgMembers", labelKey: "name", valueKey: "id",
            dependsOn: ["values.shg"], dependsOnHint: "Select SHG first",
          },
          validations: [{ type: "required" }],
          rules: [{ when: "values.action !== 'update'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "shgJoinDate",
          type: "date", label: "Date of SHG Joining",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "uid",
          type: "text", label: "UID",
          helperText: "From LokOS or generated by the platform",
          validations: [{ type: "required" }],
          props: { maxLength: 32, placeholder: "e.g., LK-00123" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ───────────────────────── 3) Personal Information (A) ───────────────────────── */
    {
      id: "personalA",
      title: "Personal Information",
      fields: [
        { id: "guardianName",
          type: "text", label: "Husband/Fathers Name",
          validations: [{ type: "required" }],
          props: { maxLength: 80, placeholder: "Enter full name" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "mobile",
          type: "text", label: "Mobile No.",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Invalid mobile" },
          ],
          props: { maxLength: 10, placeholder: "10-digit number", inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "aadhaar",
          type: "text", label: "Aadhar No.",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^\\d{12}$", message: "12 digits" },
          ],
          props: { maxLength: 12, placeholder: "12-digit Aadhaar", inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "voterId",
          type: "text", label: "Voter ID",
          validations: [{ type: "required" }],
          props: { maxLength: 20, placeholder: "EPIC No." },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "rationType",
          type: "autocomplete", label: "Ration Card Type",
          options: { endpointKey: "catalog/rationTypes", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "education",
          type: "autocomplete", label: "EDUCATION",
          options: { endpointKey: "catalog/educationLevels", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ───────────────────────── 4) Personal Information (B) ───────────────────────── */
    {
      id: "personalB",
      title: "Demographics",
      fields: [
        { id: "dob",
          type: "date", label: "DATE OF BIRTH",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "age",
          type: "number", label: "AGE",
          validations: [{ type: "required" }],
          props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          rules: [
            {
              when: "values.dob",
              action: "derive",
              value: "Math.max(0, Math.floor((Date.now() - new Date(values.dob)) / 31557600000))",
            },
            { when: "values.dob", action: "disable" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "socialCategory",
          type: "autocomplete", label: "SOCIAL CATEGORY",
          options: { endpointKey: "catalog/socialCategories", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "pwd",
          type: "radio-group", label: "PWD",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "religion",
          type: "autocomplete", label: "Religion",
          options: { endpointKey: "catalog/religions", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "maritalStatus",
          type: "autocomplete", label: "Marital Status",
          options: { endpointKey: "catalog/maritalStatuses", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "seccCategory",
          type: "autocomplete", label: "POOR/SECC CATEGORY",
          options: { endpointKey: "catalog/seccCategories", labelKey: "label", valueKey: "value" }, // ULTRA POOR, POP, POOR
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "diffAbledSelf",
          type: "radio-group", label: "Differently-abled (Self)",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "tribal",
          type: "autocomplete", label: "TRIBAL",
          options: { endpointKey: "catalog/tribes", labelKey: "label", valueKey: "value" }, // BUKSA, VAN-RAJI, Jaunsari, Bhotiya, THARU
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ─────────────────────────── 5) Household ─────────────────────────── */
    {
      id: "household",
      title: "Household",
      fields: [
        { id: "hhSize",
          type: "number", label: "Household Size",
          validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "children05",
          type: "number", label: "No. of Children (0-5 yrs)",
          validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "schoolChildren",
          type: "number", label: "No. of School-Going Children",
          validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "headOfHousehold",
          type: "autocomplete", label: "Head of Household",
          options: { endpointKey: "catalog/householdHeads", labelKey: "label", valueKey: "value" }, // Self, Husband, Son, Father-in-law, Other
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "houseType",
          type: "autocomplete", label: "Type of House",
          options: { endpointKey: "catalog/houseTypes", labelKey: "label", valueKey: "value" }, // Kutcha, Semi-Pucca, Pucca
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "electricity",
          type: "radio-group", label: "Electricity Access",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "drinkingWater",
          type: "autocomplete", label: "Drinking Water Source",
          options: { endpointKey: "catalog/drinkingWaterSources", labelKey: "label", valueKey: "value" }, // Tap, Handpump, Spring, Well, River, Other
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "sanitation",
          type: "autocomplete", label: "Sanitation Facility",
          options: { endpointKey: "catalog/sanitationFacilities", labelKey: "label", valueKey: "value" }, // Own Toilet, Shared, Open Defecation
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "lpg",
          type: "radio-group", label: "LPG",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ─────────────────────────── 6) Livelihood & Economic Activities ─────────────────────────── */
    {
      id: "livelihood",
      title: "Livelihood & Economic Activities",
      fields: [
        { id: "landOwnership",
          type: "radio-group", label: "Land Ownership",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "totalLand",
          type: "number", label: "Total Land (Nali)",
          validations: [{ type: "required" }],
          props: { min: 0, step: 0.01 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "irrigatedLand",  type: "number", label: "Irrigated land Area (Nali)",
          props: { min: 0, step: 0.01 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "rainfedLand",    type: "number", label: "Rainfed land Area (Nali)",
          props: { min: 0, step: 0.01 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "uncultivatedLand", type: "number", label: "Uncultivated land (Nali)",
          props: { min: 0, step: 0.01 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "majorCrops",
          type: "multi-select", label: "Major Crops Grown",
          options: { endpointKey: "catalog/crops", labelKey: "label", valueKey: "value" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 12, md: 8 } } },

        { id: "ownsLivestock",
          type: "radio-group", label: "Owns Livestock",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "cowCount",
          type: "number", label: "Cow",
          props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          rules: [
            { when: "values.ownsLivestock !== 'Yes'", action: "hide" },
            { when: "values.ownsLivestock === 'Yes'", action: "require" },
          ],
          grid: { span: { xs: 12, sm: 4, md: 3 } } },

        { id: "bullCount",
          type: "number", label: "Bull/Ox",
          props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }],
          grid: { span: { xs: 12, sm: 4, md: 3 } } },

        { id: "buffaloCount",
          type: "number", label: "Buffalo",
          props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          rules: [
            { when: "values.ownsLivestock !== 'Yes'", action: "hide" },
            { when: "values.ownsLivestock === 'Yes'", action: "require" },
          ],
          grid: { span: { xs: 12, sm: 4, md: 3 } } },

        { id: "nonFarmActivity",
          type: "autocomplete", label: "Non-Farm Activities",
          options: { endpointKey: "catalog/nonFarmActivities", labelKey: "label", valueKey: "value" }, // Tailoring, Handicraft, ...
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "wageLabour",
          type: "autocomplete", label: "Wage Labour",
          options: { endpointKey: "catalog/wageLabourTypes", labelKey: "label", valueKey: "value" }, // Daily, Seasonal, Not engaged
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "migration",
          type: "radio-group", label: "Migration (Self or Family)",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "migrationPurpose",
          type: "autocomplete", label: "Migration Purpose",
          options: { endpointKey: "catalog/migrationPurposes", labelKey: "label", valueKey: "value" }, // Work, Health, Education, Displacement
          validations: [{ type: "required" }],
          rules: [{ when: "values.migration !== 'Yes'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ─────────────────────────── 7) Income & Financial Inclusion ─────────────────────────── */
    {
      id: "income",
      title: "Income & Financial Inclusion",
      fields: [
        { id: "annualIncome",
          type: "autocomplete", label: "Annual Household Income (₹)",
          options: { endpointKey: "catalog/annualIncomeBrackets", labelKey: "label", valueKey: "value" }, // <5000, ...
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "majorIncomeSource",
          type: "autocomplete", label: "Major Source of Income",
          options: { endpointKey: "catalog/incomeSources", labelKey: "label", valueKey: "value" }, // Agriculture, Livestock, ...
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "savingsPerMonth",
          type: "number", label: "SAVING (Per-month/Per-member)",
          validations: [{ type: "required" }], props: { min: 0, step: 1 }, config: { inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "hasBankAccount",
          type: "radio-group", label: "Bank Account Holder",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "bankName",
          type: "text", label: "Benef. Bank Name",
          validations: [{ type: "required" }],
          rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "accountNo",
          type: "text", label: "Benef. Account No",
          validations: [{ type: "required" }],
          rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }],
          props: { maxLength: 20, inputMode: "numeric" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "branchName",
          type: "text", label: "Branch Name",
          validations: [{ type: "required" }],
          rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "accountType",
          type: "autocomplete", label: "Account Type",
          options: { endpointKey: "catalog/accountTypes", labelKey: "label", valueKey: "value" }, // Savings, Joint
          validations: [{ type: "required" }],
          rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "ifsc",
          type: "text", label: "IFSC Code",
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[A-Z]{4}0[A-Z0-9]{6}$", message: "Invalid IFSC" },
          ],
          rules: [{ when: "values.hasBankAccount !== 'Yes'", action: "hide" }],
          props: { maxLength: 11, placeholder: "e.g., SBIN0XXXXXX" },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },
      ],
    },

    /* ─────────────────────────── 8) Documents & Mapping ─────────────────────────── */
    {
      id: "documents",
      title: "Documents & Mapping",
      fields: [
        { id: "memberPicture",
          type: "upload", label: "Member Picture (jpg)",
          validations: [{ type: "required" }],
          props: { accept: ".jpg,.jpeg,.png", maxSizeMB: 5 },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "disabilityCertificate",
          type: "upload", label: "Disability certificate (jpg)",
          validations: [],
          rules: [
            { when: "values.pwd === 'Yes'", action: "require" },
            { when: "values.pwd !== 'Yes'", action: "hide" },
          ],
          props: { accept: ".jpg,.jpeg,.png", maxSizeMB: 5 },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "aadhaarPicture",
          type: "upload", label: "Aadhar card Picture (jpg)",
          validations: [{ type: "required" }],
          props: { accept: ".jpg,.jpeg,.png", maxSizeMB: 5 },
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "valueChain",
          type: "autocomplete", label: "Value Chain Mapping",
          options: {
            endpointKey: "catalog/valueChains", labelKey: "label", valueKey: "value",
            dependsOn: ["values.district", "values.block", "values.gp", "values.village"],
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "pgMapping",
          type: "autocomplete", label: "PG Mapping",
          options: {
            endpointKey: "pgs", labelKey: "name", valueKey: "id",
            dependsOn: ["values.vo"], dependsOnHint: "Select VO first",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "undertaking",
          type: "checkbox", label: "I confirm the correctness of the above information",
          validations: [{ type: "requiredTrue", message: "Please confirm undertaking" }],
          grid: { span: { xs: 12, sm: 12, md: 8 } } },
      ],
    },
  ],
};

export default memberProfileSchema;
