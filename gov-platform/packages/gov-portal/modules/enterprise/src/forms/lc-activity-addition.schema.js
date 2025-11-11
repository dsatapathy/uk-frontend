export const lcActivityAdditionSchema = {
    $schema: "fe.v1",
    id: "lc-activity-addition-form",
    version: "1.0.0",
    title: "LC Activity Addition Form",
    sections: [
        {
            id: "lc-activity-details",
            title: "LC Activity Details",
            fields: [
                {
                    id: "catId",
                    type: "autocomplete",
                    label: "Type of Category Activity",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_category_name" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
               {
                id: "activityName",
                type: "text",
                label: "Activity Name",
                validations: [{ type: "required" }],
                props: { placeholder: "Please enter activity name" },
                grid: { span: { xs: 12, sm: 6, md: 4 } },
               
               }
            ],
        },
    ],
};
