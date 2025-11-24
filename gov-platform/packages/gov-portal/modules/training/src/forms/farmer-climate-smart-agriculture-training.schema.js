export const farmerClimateSmartAgricultureTrainingSchema = {
  $schema: "fe.v1",
  id: "farmer-climate-smart-agriculture-training-form",
  version: "1.0.0",
  title: "Farmer - Climate Smart Agriculture (CSA) Training Form",
  sections: [
    {
      id: "farmer-csa-training-details",
      title: "Farmer Training Information",
      fields: [
        /* --- Farmer Category --- */
        {
          id: "farmerType",
          type: "autocomplete",
          label: "Farmer's Type",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "category_participants" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Location Hierarchy --- */
        {
          id: "district",
          type: "autocomplete",
          label: "District Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "block",
          type: "autocomplete",
          label: "Block Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "blocks" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.district"],
            dependsOnHint: "Select District first",
            queryBuilder: (deps) => ({ type: "blocks", id: deps.district }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "gp",
          type: "autocomplete",
          label: "Gram Panchayat Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "panchayats" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.block"],
            dependsOnHint: "Select Block first",
            queryBuilder: (deps) => ({ type: "panchayats", id: deps.block }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "village",
          type: "autocomplete",
          label: "Village Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "villages" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.gp"],
            dependsOnHint: "Select Gram Panchayat first",
            queryBuilder: (deps) => ({ type: "villages", id: deps.gp }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- CBO Hierarchy --- */
        {
          id: "clf",
          type: "autocomplete",
          label: "CLF Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "clf_profiles" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.block"],
            dependsOnHint: "Select Block first",
            queryBuilder: (deps) => ({ type: "clf_profiles", id: deps.block }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "vo",
          type: "autocomplete",
          label: "VO Name",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "vo_profiles" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.clf"],
            dependsOnHint: "Select CLF first",
            queryBuilder: (deps) => ({ type: "vo_profiles", id: deps.clf }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Farmer Basic Info --- */
        {
          id: "farmerName",
          type: "text",
          label: "Farmer Name",
          validations: [{ type: "required" }],
          props: { placeholder: "Enter full name of the farmer" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "mobile",
          type: "text",
          label: "Farmer Mobile Number",
          props: { maxLength: 10, placeholder: "Enter farmer's contact number" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile number" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Land Details --- */
        {
          id: "totalLand",
          type: "text",
          label: "Total Land",
          props: { placeholder: "Enter total land owned (in numeric value)" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "landUnit",
          type: "autocomplete",
          label: "Land Unit",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "land_units" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "irrigatedLand",
          type: "text",
          label: "Irrigated Land",
          props: { placeholder: "Enter irrigated land area" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "irrigatedLandUnit",
          type: "autocomplete",
          label: "Irrigated Land Unit",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "land_units" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "unirrigatedLand",
          type: "text",
          label: "Unirrigated Land",
          validations: [{ type: "required" }],
          props: { placeholder: "Enter unirrigated land area" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "unirrigatedLandUnit",
          type: "autocomplete",
          label: "Unirrigated Land Unit",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "land_units" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "areaUnderAgr",
          type: "text",
          label: "Area under Agroforestry",
          validations: [{ type: "required" }],
          props: { placeholder: "Enter area under agroforestry" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "areaUnderAgrUnit",
          type: "autocomplete",
          label: "Area under Agroforestry Unit",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "land_units" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Farming Experience --- */
        {
          id: "farmerExperience",
          type: "autocomplete",
          label: "Farming Experience (Years)",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "experience_years" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Crop Information --- */
        {
          id: "majorCrop",
          type: "text",
          label: "Major Crop",
          props: { placeholder: "Enter main crop cultivated" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "rabiSeason",
          type: "text",
          label: "Rabi Season Crop",
          validations: [{ type: "required" }],
          props: { placeholder: "Enter Rabi season crop" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "kharifSeason",
          type: "text",
          label: "Kharif Season Crop",
          validations: [{ type: "required" }],
          props: { placeholder: "Enter Kharif season crop" },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Farmer Type --- */
        {
          id: "farmerCategory",
          type: "autocomplete",
          label: "Farmer Type (Progressive/Normal)",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "farmer_type" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "progressive",
          type: "radio-group",
          label: "Progressive Farmer",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "normal",
          type: "radio-group",
          label: "Normal Farmer",
          options: { items: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }] },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Farming Practices --- */
        {
          id: "farmingPractices",
          type: "autocomplete",
          label: "Farming Practices",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "farmer_practices" },
            labelKey: "label",
            valueKey: "value",
          },
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- File Uploads --- */
        {
          id: "photograph",
          type: "file",
          label: "Training Photograph",
          props: {
            accept: "image/*",
            maxFiles: 3,
            maxSizeMB: 5,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
        {
          id: "docUpload",
          type: "file",
          label: "Upload Document",
          props: {
            accept: ".pdf,.doc,.docx,image/*",
            maxFiles: 2,
            maxSizeMB: 10,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
      ],
    },
  ],
};
