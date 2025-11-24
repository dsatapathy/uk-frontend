export const caseStudyUploadSchema = {
  $schema: "fe.v1",
  id: "case-study-upload-form",
  version: "1.0.0",
  title: "Case Study Upload Form",
  sections: [
    {
      id: "case-study-upload-details",
      title: "Case Study Details",
      fields: [
        /* --- Case Study Name --- */
        {
          id: "caseStudyName",
          type: "text",
          label: "Case Study Name",
          placeholder: "Enter the title of the case study",
          validations: [
            { type: "required" },
            { type: "maxLength", value: 150, message: "Maximum 150 characters allowed" },
          ],
          grid: { span: { xs: 12, sm: 6, md: 6 } },
        },

        /* --- Purpose --- */
        {
          id: "purpose",
          type: "textarea",
          label: "Purpose",
          placeholder: "Enter the purpose or objective of this case study",
          validations: [
            { type: "required" },
            { type: "maxLength", value: 1000, message: "Maximum 1000 characters allowed" },
          ],
          grid: { span: { xs: 12 } },
        },

        /* --- Upload Button --- */
        {
          id: "fileDetail",
          type: "file",
          label: "Upload Case Study Document",
          props: {
            accept: ".pdf,.doc,.docx,image/*",
            maxFiles: 2,
            maxSizeMB: 10,
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 6 } },
        },
      ],
    },
  ],
};
