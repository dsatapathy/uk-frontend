export const memberProfileSearchSchema = {
  $schema: "fe.v1",
  id: "member-profile-search",
  version: "1.0.0",
  title: "Member Profile Search",
  sections: [
    {
      id: "shg-details",
      title: "Search Beneficiary Member Profile Details",
      fields: [
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
        },
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
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
          grid: { span: { xs: 6, sm: 4, md: 3 } }
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
          grid: { span: { xs: 6, sm: 4, md: 3 } },
        },
        {
          id: "memberName",
          type: "text",
          label: "Name of Member",
          validations: [{ type: "required" }],
          grid: { span: { xs: 6, sm: 4, md: 3 } },
        },
        {
          id: "memberId",
          type: "text",
          label: "Enter Member ID",
          grid: { span: { xs: 6, sm: 4, md: 3 } },
        },
      ]
    }
  ]
}
