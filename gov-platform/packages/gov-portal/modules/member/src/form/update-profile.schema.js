// member-profile.schema.js (aligned to your components)
export const updateMemberProfileSchema = {
  $schema: "fe.v1",
  id: "update-profile",
  version: "1.0.0",
  title: "Update Member Profile",

  sections: [

    // 6) Livelihood & Economic Activities
    {
      id: "livelihood",
      title: "Livelihood & Economic Activities",
      fields: [
        { id: "addhaarNo", 
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

        // NOTE: MultiSelect expects static items. If you need async here, add an async-multi component later.
        // { id: "majorCrops", type: "multiselect", label: "Major Crops Grown",
        //   options: { items: [{label:'Wheat', value:'wheat'}] /* e.g. [{label:'Wheat', value:'wheat'}] */ },
        //   validations: [{ type: "optional" }],
        //   rules: [{ when: "values.landOwnership === 'No'", action: "hide" }],
        //   grid: { span: { xs: 12, sm: 12, md: 8 } }
        // },

        { id: "ownsLivestock", type: "radio-group", label: "Owns Livestock", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "cowCount", type: "text", label: "Cow", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "bullCount", type: "text", label: "Bull/Ox", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },
        { id: "buffaloCount", type: "text", label: "Buffalo", props: { min: 0, step: 1 }, config: { inputMode: "numeric" }, rules: [{ when: "values.ownsLivestock !== 'Yes'", action: "hide" }, { when: "values.ownsLivestock === 'Yes'", action: "require" }], grid: { span: { xs: 12, sm: 6, md: 3 } } },

        { id: "nonFarmActivity", type: "autocomplete", label: "Non-Farm Activities", options: { endpointKey: "catalog/nonFarmActivities", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "wageLabour", type: "autocomplete", label: "Wage Labour", options: { endpointKey: "catalog/wageLabourTypes", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "migration", type: "radio-group", label: "Migration (Self or Family)", options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        {
          id: "migrationPurpose", type: "autocomplete", label: "Migration Purpose",
          options: { endpointKey: "catalog/migrationPurposes", labelKey: "label", valueKey: "value" },
          rules: [{ when: "values.migration !== 'Yes'", action: "hide" }, { when: "values.migration === 'Yes'", action: "require" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
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
          grid: { span: { xs: 12, sm: 6, md: 4 } }
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
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        {
          id: "aadhaarPhoto",
          type: "file",
          label: "Aadhaar Card Picture",
          helperText: "Attach Aadhaar front photo (image only).",
          rules: [
            { when: "!!values.addhaarNo", action: "require" }
          ],
          props: {
            multiple: false,
            accept: "image/*",
            maxFiles: 1,
            maxSizeMB: 5
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        { id: "valueChainMapping", type: "autocomplete", label: "Value Chain Mapping", options: { endpointKey: "catalog/valueChains", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },
        { id: "pgMapping", type: "autocomplete", label: "PG Mapping", options: { endpointKey: "catalog/pgMappings", labelKey: "label", valueKey: "value" }, validations: [{ type: "required" }], grid: { span: { xs: 12, sm: 6, md: 4 } } },

        { id: "undertaking", type: "checkbox", label: "I confirm the information provided is correct", validations: [{ type: "required" }], grid: { span: { xs: 12 } } }
      ]
    }
  ]
};
