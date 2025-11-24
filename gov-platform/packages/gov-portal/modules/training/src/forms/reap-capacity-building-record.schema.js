export const reapCapacityBuildingRecordSchema = {
  $schema: "fe.v1",
  id: "reap-capacity-building-record-form",
  version: "1.0.0",
  title: "REAP Capacity Building Record Form",
  sections: [
    {
      id: "reap-capacity-building-details",
      title: "Capacity Building Details",
      fields: [
        /* --- Type of Record --- */
        {
          id: "typeOfRecord",
          type: "autocomplete",
          label: "Type of Record",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "type_of_record" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Category of Participants --- */
        {
          id: "categoryOfParticipants",
          type: "autocomplete",
          label: "Category of Participants",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "category_participants" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- District --- */
        {
          id: "district",
          type: "autocomplete",
          label: "District",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "districts" },
            labelKey: "name",
            valueKey: "id",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Block --- */
        {
          id: "block",
          type: "autocomplete",
          label: "Block",
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

        /* --- Gram Panchayat --- */
        {
          id: "gp",
          type: "autocomplete",
          label: "Gram Panchayat",
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

        /* --- Village --- */
        {
          id: "village",
          type: "autocomplete",
          label: "Village",
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

        /* --- CLF --- */
        {
          id: "clf",
          type: "autocomplete",
          label: "CLF-LCs",
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

        /* --- VO --- */
        {
          id: "vo",
          type: "autocomplete",
          label: "VO",
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

        /* --- SHG --- */
        {
          id: "shg",
          type: "autocomplete",
          label: "SHG",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "shg_profiles" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.vo"],
            dependsOnHint: "Select VO first",
            queryBuilder: (deps) => ({ type: "shg_profiles", id: deps.vo }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Member --- */
        {
          id: "memberId",
          type: "autocomplete",
          label: "Member",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "member_profiles" },
            labelKey: "memberName",
            valueKey: "memberId",
            dependsOn: ["values.shg"],
            dependsOnHint: "Select SHG first",
            queryBuilder: (deps) => ({ type: "member_profiles", id: deps.shg }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Member Mobile --- */
        {
          id: "memberMobile",
          type: "text",
          label: "Member Mobile No",
          props: { maxLength: 10, placeholder: "Enter 10-digit mobile number" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile number" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Financial Year --- */
        {
          id: "financialYear",
          type: "autocomplete",
          label: "Financial Year",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "financial_year" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Type of Training / Workshop / Project Exposure --- */
        {
          id: "trainingType",
          type: "autocomplete",
          label: "Type of Training / Workshop / Project Exposure",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "type_of_record" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Training Center Name --- */
        {
          id: "trainingCenterName",
          type: "text",
          label: "Training Center Name",
          props: { placeholder: "Enter name of training center" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- From Date --- */
        {
          id: "fromDob",
          type: "date",
          label: "From Date",
          props: { format: "DD/MM/YYYY" },
          config: {
            valueKind: "iso",
            outputFormat: "YYYY-MM-DD",
            disableFuture: true,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- To Date --- */
        {
          id: "toDob",
          type: "date",
          label: "To Date",
          props: { format: "DD/MM/YYYY" },
          config: {
            valueKind: "iso",
            outputFormat: "YYYY-MM-DD",
            disableFuture: true,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Training Photograph --- */
        {
          id: "photo",
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

        /* --- Training Certificate --- */
        {
          id: "document",
          type: "file",
          label: "Training Certificate",
          props: {
            accept: ".pdf,image/*",
            maxFiles: 2,
            maxSizeMB: 5,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
      ],
    },
  ],
};
