export const individualEnterpriseOutcomeDetailsSchema = {
    $schema: "fe.v1",
    id: "individual-enterprise-outcome-details",
    version: "1.0.0",
    title: "Individual Enterprise Outcome Details",
    sections: [
        {
            id: "individual-enterprise-outcome-details",
            title: "Individual Enterprise Outcome Details",
            fields: [
                /* Location Hierarchy */
                {
                    id: "district",
                    type: "autocomplete",
                    label: "District",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "districts" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
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
                            id: deps.district,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
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
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
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
                            id: deps.gp,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* SHG Hierarchy Info */
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

                /* Beneficiary Info */
                {
                    id: "memberId",
                    type: "autocomplete",
                    label: "Select Member to update Outcome",
                    options: {
                        endpointKey: "v1/master/data",
                        query: { type: "ind_enterprise_activities" },
                        labelKey: "name",
                        valueKey: "id",
                        dependsOn: ["values.shg"],
                        dependsOnHint: "Select SHG first",
                        queryBuilder: (deps) => ({
                            type: "ind_enterprise_activities",
                            id: deps.shg
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "proposedEnterprise",
                    type: "text",
                    label: "Proposed Enterprise",
                    // options: {
                    //     endpointKey: "v1/master/data",
                    //     labelKey: "name",
                    //     valueKey: "id",
                    //     query: { type: "enterprise_types" },
                    // },
                    validations: [{ type: "required" }],
                    props: {placeholder: "Enter proposed enterprise"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "financialYear",
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
                {
                    id: "dataEntryFrequency",
                    type: "autocomplete",
                    label: "Data Entry Frequency",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "data_entry_frequency" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "monthToUpdate",
                    type: "autocomplete",
                    label: "Select Month to Update",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "months" },
                    },
                    validations: [{ type: "required" }],
                    rules: [{ when: "values.dataEntryFrequency === 'yearly'", action: "hide" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityHeading1",
                    type: "subHeading",
                    label: "Activity Details - 1",
                    grid: { span: { xs: 12, sm: 12, md: 12 } },
                },
                {
                    id: "activityName1",
                    type: "text",
                    label: "Name of Activity",
                    validations: [{ type: "required" }],
                    props: {placeholder: "Enter name of activity"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityRevenue1",
                    type: "text",
                    label: "Revenue from the Activity",
                    validations: [
                        { type: "required" }
    
                    ],
                    props: {placeholder: "Enter revenue amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityGrossProfit1",
                    type: "text",
                    label: "Gross Profit from the Activity",
                    validations: [{ type: "required" }],
                    props: {placeholder: "Enter gross profit amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityHeading2",
                    type: "subHeading",
                    label: "Activity Details - 2",
                },
                {
                    id: "activityName2",
                    type: "text",
                    label: "Name of Activity",
                    props: {placeholder: "Enter name of activity"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityRevenue2",
                    type: "text",
                    label: "Revenue from the Activity",
                    props: {placeholder: "Enter revenue amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityGrossProfit2",
                    type: "text",
                    label: "Gross Profit from the Activity",
                    props: {placeholder: "Enter gross profit amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                
                {
                    id: "activityHeading3",
                    type: "subHeading",
                    label: "Activity Details - 3",
                },
                {
                    id: "activityName3",
                    type: "text",
                    label: "Name of Activity",
                    props: {placeholder: "Enter name of activity"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityRevenue3",
                    type: "text",
                    label: "Revenue from the Activity",
                    props: {placeholder: "Enter revenue amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "activityGrossProfit3",
                    type: "text",
                    label: "Gross Profit from the Activity",
                    props: {placeholder: "Enter gross profit amount"},
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
            ],
        },
    ],
};
                
            