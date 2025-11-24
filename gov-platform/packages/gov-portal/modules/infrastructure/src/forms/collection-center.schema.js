export const collectionCenterSchema = {
  $schema: "fe.v1",
  id: "collection-center-form",
  version: "1.0.0",
  title: "Collection Center Form",
  sections: [
    {
      id: "collection-center-details",
      title: "Collection Center Details",
      fields: [
        /* --- Category of Participants --- */
        // {
        //   id: "categoryOfParticipants",
        //   type: "autocomplete",
        //   label: "Category of Participants",
        //   options: {
        //     endpointKey: "v1/master/data",
        //     query: { type: "contruction_progress_level" },
        //     labelKey: "name",
        //     valueKey: "id",
        //   },
        //   validations: [{ type: "required" }],
        //   grid: { span: { xs: 12, sm: 6, md: 4 } },
        // },

        /* --- District --- */
        {
          id: "districtId",
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
          id: "blockId",
          type: "autocomplete",
          label: "Block",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "blocks" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.districtId"],
            dependsOnHint: "Select District first",
            queryBuilder: (deps) => ({ type: "blocks", id: deps.districtId }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- CLF --- */
        {
          id: "clfCode",
          type: "autocomplete",
          label: "CLF",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "clf_profiles" },
            labelKey: "name",
            valueKey: "id",
            dependsOn: ["values.blockId"],
            dependsOnHint: "Select Block first",
            queryBuilder: (deps) => ({ type: "clf_profiles", id: deps.blockId }),
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Financial Year --- */
        {
          id: "financeYear",
          type: "autocomplete",
          label: "Financial Year",
          options: {
            endpointKey: "v1/master/data",
            labelKey: "label",
            valueKey: "value",
            query: { type: "financial_year" },
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- CLF Contribution --- */
        {
          id: "clfContribution",
          type: "text",
          label: "CLF Contribution (₹)",
          props: { placeholder: "Enter CLF contribution amount" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Project Support --- */
        {
          id: "projectSupport",
          type: "text",
          label: "Project Support (₹)",
          props: { placeholder: "Enter UGVS support amount" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Convergence --- */
        {
          id: "convergence",
          type: "text",
          label: "Convergence (₹)",
          props: { placeholder: "Enter financial support from other schemes" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Bank --- */
        {
          id: "bankContribution",
          type: "text",
          label: "Bank (₹)",
          props: { placeholder: "Enter loan or bank financing obtained" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Total Cost --- */
        {
          id: "totalCost",
          type: "text",
          label: "Total Cost (₹)",
          props: { placeholder: "Enter total cost (sum of all amounts)" },
          validations: [
            { type: "required" },
            { type: "pattern", value: "^[0-9]+(\\.[0-9]{1,2})?$", message: "Enter a valid amount" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Land Identify --- */
        {
          id: "landIdentify",
          type: "radio-group",
          label: "Land Identify",
          options: {
            items: [
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ],
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Geo Coordinates --- */
        {
          id: "geoCoordinates",
          type: "text",
          label: "Geo Coordinates of the Site",
          props: { placeholder: "Enter latitude, longitude of the site" },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Construction Progress Level --- */
        {
          id: "constructionProgress",
          type: "autocomplete",
          label: "Construction Progress Level",
          options: {
            endpointKey: "v1/master/data",
            query: { type: "contruction_progress_level" },
            labelKey: "label",
            valueKey: "value",
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Upload Approved DPR --- */
        {
          id: "approvedDprDocument",
          type: "file",
          label: "Upload Approved DPR",
          props: {
            accept: ".pdf,image/*",
            maxFiles: 2,
            maxSizeMB: 10,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- NOC Upload Document --- */
        {
          id: "nocDocument",
          type: "file",
          label: "NOC Upload Document (Only PDF)",
          props: {
            accept: ".pdf",
            maxFiles: 2,
            maxSizeMB: 5,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },

        /* --- Photograph Upload of Completed CC --- */
        {
          id: "completionImage1",
          type: "file",
          label: "Photograph Upload of Completed CC",
          props: {
            accept: "image/*",
            maxFiles: 3,
            maxSizeMB: 5,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } },
        },
      ],
    },
  ],
};
