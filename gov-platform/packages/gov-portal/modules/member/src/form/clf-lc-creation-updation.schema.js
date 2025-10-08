
export const clfLcRegistrationSchema = {
  $schema: "fe.v1",
  id: "clf-lc-registration",
  version: "1.0.0",
  title: "CLF/LC Registration",
  sections: [
    {
      id: "clf-lc-details",
      title: "CLF/LC Details",
      fields: [
        {
          id: "isClfOrLcUpdate",
          type: "dropdown",
          label: "Is it CLF or LC Data update?",
          options: {
            items: [
              { label: "CLF", value: "clf" },
              { label: "LC", value: "lc" }
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
            query: { type: "districts" }
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
            queryBuilder: (deps) => ({ type: "blocks", id: deps.district })
          },
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "clfLcName",
          type: "text",
          label: "CLF/LCs Name",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "agreementEffectiveDate",
          type: "date",
          label: "CLF Adoption Agreement (Effective) Date",
          validations: [{ type: "required" }],
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "panchayatsCovered",
          type: "text",
          label: "No of Panchayats Covered",
          validations: [{ type: "pattern", value: "^(|\\d+)$" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "revenueVillages",
          type: "text",
          label: "No of Revenue Villages",
          validations: [{ type: "pattern", value: "^(|\\d+)$" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "voCount",
          type: "text",
          label: "No of VOs",
          validations: [{ type: "pattern", value: "^(|\\d+)$" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "shgCount",
          type: "text",
          label: "No of SHGs",
          validations: [{ type: "pattern", value: "^(|\\d+)$" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "address",
          type: "text",
          label: "Address of CLF/LCs",
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "registrationNo",
          type: "text",
          label: "CLF/LC Registration No.",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "registrationDate",
          type: "date",
          label: "CLF/LCs Date of Registration",
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          
            id: "presidentName",
          type: "text",
          label: "CLF BOD's Name: President",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "secretaryName",
          type: "text",
          label: "CLF BOD's Name: Secretary",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "treasurerName",
          type: "text",
          label: "CLF BOD's Name: Treasurer",
          validations: [{ type: "required" }],
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "bodNames",
          type: "textarea",
          label: "CLF BOD Names (Others)",
          description: "Enter multiple names (up to 10)",
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        { 
            id: "panOrTan", 
            type: "text", 
            label: "PAN / TAN No",
            grid: { span: { xs: 12, sm: 6, md: 4 } } 
        },
        { 
            id: "fssaiNo", 
            type: "text", 
            label: "FSSAI No.",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        /* Staff Sub-section */
        {
            id: "staffHeader",
            type: "subheader",
            label: "Names of Staff in CLF/LC",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "businessPromoter",
            type: "text",
            label: "Name of Business Promoter",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "accountantName",
            type: "text",
            label: "Name of Accountant/Data Entry Operator",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "gm1",
            type: "text",
            label: "Name of Group Mobiliser -1",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "gm2",
            type: "text",
            label: "Name of Group Mobiliser -2",
            grid: { span: { xs: 12, sm: 6, md: 4 } }    
        },

        {
            id: "shareholders",
            type: "text",
            label: "Shareholders (No’s)",
            validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "sharecapital",
            type: "text",
            label: "Sharecapital Amount (INR)",
            validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "associatedFpo",
            type: "text",
            label: "Name of Associated FPO",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        /* Banking */
        { 
            id: "bankAccount",
            type: "text",
            label: "CLF-LCs Bank A/C No.",
            validations: [{ type: "required" }, { type: "pattern", value: "^\\d+$" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "ifscCode",
            type: "text",
            label: "IFSC Code",
            validations: [{ type: "required" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "bankName",
            type: "text",
            label: "Name of Bank",
            validations: [{ type: "required" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "bankBranch",
            type: "text",
            label: "Name of Bank Branch",
            validations: [{ type: "required" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        {
            id: "totalLand",
            type: "text",
            label: "Total Land of CLF-LCs Members",
            validations: [{ type: "pattern", value: "^(|\\d+)$" }],
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "grade",
            type: "text",
            label: "Grade of CLF / LC",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },

        /* Value Chains */
        { 
            id: "valueChain1",
            type: "text",
            label: "CLF/LC Key Value Chain: 1",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "valueChain2",
            type: "text",
            label: "CLF/LC Key Value Chain: 2",
            grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
            id: "valueChain3",
            type: "text",
            label: "CLF/LC Key Value Chain: 3",
            grid: { span: { xs: 12, sm: 6, md: 4 } }    
        },

        /* Audits and Meetings */
        {
          id: "lastAuditDate",
          type: "date",
          label: "Last Audit Date",
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        },
        {
          id: "lastAgmDate",
          type: "date",
          label: "Last AGM Date",
          props: { format: "DD/MM/YYYY" },
          config: { valueKind: "iso", outputFormat: "YYYY-MM-DD", disableFuture: true },
          grid: { span: { xs: 12, sm: 6, md: 4 } }
        }
      ]
    }
  ]
}

