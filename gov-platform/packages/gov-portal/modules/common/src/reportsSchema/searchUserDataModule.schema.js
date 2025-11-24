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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "memberName",
          type: "text",
          label: "Name of Member",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "memberId",
          type: "text",
          label: "Enter Member ID",
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
}

export const clfProfileSearchSchema = {
  $schema: "fe.v1",
  id: "clf-profile-search",
  version: "1.0.0",
  title: "CLF Profile Search",
  sections: [
    {
      id: "clf-details",
      title: "Search CLF Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
        },
        {
          id: "clfName",
          type: "text",
          label: "Name of CLF",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "clfId",
          type: "text",
          label: "Enter CLF ID",
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
}

export const fpoProfileSearchSchema = {
    $schema: "fe.v1",
    id: "fpo-profile-search",
    version: "1.0.0",
    title: "FPO Profile Search",
    sections: [
        {
            id: "fpo-details",
            title: "Search FPO Profile Details",
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
                    grid: { span: { xs: 12, sm: 4, md: 3 } }
                },             
                {
                    id: "fpoName",
                    type: "text",
                    label: "FPO Name",
                    props: { placeholder: "Enter FPO Name" },
                    grid: { span: { xs: 12, sm: 4, md: 3 } }
                },
                {
                    id: "fpoId",
                    type: "text",
                    label: "FPO ID",
                    props: { placeholder: "Enter FPO ID" },
                    grid: { span: { xs: 12, sm: 4, md: 3 } }
                } 
            ]
        }
    ]
};

export const lcProfileSearchSchema = {
  $schema: "fe.v1",
  id: "lc-profile-search",
  version: "1.0.0",
  title: "CLF Profile Search",
  sections: [
    {
      id: "Lc-details",
      title: "Search LC Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
        },
        {
          id: "lcName",
          type: "text",
          label: "Name of LC",
          // validations: [{ type: "required" }],
          props: {placeholder: "Enter LC Name"},
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "lcId",
          type: "text",
          label: "Enter LC ID",
          props: {placeholder: "Enter LC ID"},
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
};

export const leaderSearchSchema = {
    $schema: "fe.v1",
    id: "leader-profile-search",
    version: "1.0.0",
    sections: [
        {
            id: "leader-details",
            title: "Search Leader Profile Details",
            fields: [
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
                        queryBuilder: (deps) => ({ type: "blocks", id: deps.district })
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },

                {
                    id: "presidentName",
                    type: "text",
                    label: "Enter President/Leader Name",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                {
                    id: "presidentNameId",
                    type: "text",
                    label: "Enter President/Leader ID",
                    grid: { span: { xs: 12, sm: 6, md: 4 } }
                },
                
            ]
        }
    ]
};

export const pgProfileSearchSchema = {
  $schema: "fe.v1",
  id: "pg-profile-search",
  version: "1.0.0",
  title: "PG Profile Search",
  sections: [
    {
      id: "pg-details",
      title: "Search PG Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "pgName",
          type: "text",
          label: "Name of PG",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "pgId",
          type: "text",
          label: "Enter PG ID",
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
};

export const shareholderProfileSearchSchema = {
  $schema: "fe.v1",
  id: "shareholder-profile-search",
  version: "1.0.0",
  title: "Shareholder Profile Search",
  sections: [
    {
      id: "shareholder-details",
      title: "Search Shareholder Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "shareHolderName",
          type: "text",
          label: "Name of Shareholder",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
          props : { placeholder: "Enter Shareholder Name" }
        },
        {
          id: "sharId",
          type: "text",
          label: "Enter Shareholder ID",
          props : { placeholder: "Enter Shareholder ID" },
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
};

export const shgProfileSearchSchema = {
  $schema: "fe.v1",
  id: "shg-profile-search",
  version: "1.0.0",
  title: "SHG Profile Search",
  sections: [
    {
      id: "shg-details",
      title: "Search SHG Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
        },
        {
          id: "shgName",
          type: "text",
          label: "Name of SHG",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "shgId",
          type: "text",
          label: "Enter SHG ID",
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
};

export const voProfileSearchSchema = {
  $schema: "fe.v1",
  id: "vo-profile-search",
  version: "1.0.0",
  title: "VO Profile Search",
  sections: [
    {
      id: "vo-details",
      title: "Search VO Profile Details",
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
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
          grid: { span: { xs: 4, sm: 3, md: 3 } }
        },
        {
          id: "voName",
          type: "text",
          label: "Name of VO",
          // validations: [{ type: "required" }],
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
        {
          id: "voId",
          type: "text",
          label: "Enter VO ID",
          grid: { span: { xs: 4, sm: 3, md: 3 } },
        },
      ]
    }
  ]
}





