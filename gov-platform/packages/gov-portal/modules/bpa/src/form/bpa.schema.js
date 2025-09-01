// packages/bpa/src/forms/bpa.schema.js
export const bpaSchema = {
    $schema: "fe.v1",
    id: "bpa-apply",
    version: "1.0.0",
    title: "Building Plan Approval – Application",
    sections: [
        {
            id: "applicant",
            title: "Applicant Details",
            fields: [
                { id: "applicantName", type: "text", label: "Applicant Name", validations: [{ type: "required" }, { type: "minLength", value: 3 }] },
                { id: "mobile", type: "text", label: "Mobile Number", validations: [{ type: "required" }, { type: "pattern", value: "^[6-9]\\d{9}$", message: "Enter valid 10-digit mobile" }] },
                { id: "email", type: "text", label: "Email", validations: [{ type: "email" }] },
            ],
        },
        {
            id: "location",
            title: "Site Location",
            fields: [
                {
                    id: "state", type: "autocomplete", label: "State",
                    options: { source: "api", endpointKey: "states", valueKey: "code", labelKey: "name" },
                    validations: [{ type: "required" }]
                },
                {
                    id: "city", type: "autocomplete", label: "City",
                    options: { source: "api", endpointKey: "cities", valueKey: "code", labelKey: "name", dependsOn: ["values.state"] },
                    rules: [{ action: "disable", when: "!values.state" }],
                    validations: [{ type: "required" }]
                },
                {
                    id: "ward", type: "autocomplete", label: "Ward",
                    options: { source: "api", endpointKey: "wards", valueKey: "code", labelKey: "name", dependsOn: ["values.city"] },
                    rules: [{ action: "disable", when: "!values.city" }],
                },
                { id: "plotNo", type: "text", label: "Plot Number" },
                { id: "pincode", type: "text", label: "PIN Code", validations: [{ type: "pattern", value: "^\\d{6}$", message: "Enter 6-digit PIN" }] },
            ],
        },
        {
            id: "building",
            title: "Building Details",
            fields: [
                {
                    id: "useType", type: "autocomplete", label: "Building Use Type",
                    options: { source: "api", endpointKey: "buildingUseTypes", valueKey: "code", labelKey: "name" },
                    validations: [{ type: "required" }]
                },
                { id: "plotArea", type: "text", label: "Plot Area (sq.m.)", validations: [{ type: "required" }, { type: "min", value: 1 }] },
                { id: "builtUpArea", type: "text", label: "Built-up Area (sq.m.)", validations: [{ type: "required" }, { type: "min", value: 1 }] },
                // Example derived: FSI = builtUpArea / plotArea
                {
                    id: "fsi", type: "text", label: "FSI (auto)", props: { disabled: true },
                    rules: [{ action: "derive", value: "Number(values.builtUpArea||0)/Number(values.plotArea||1)" }]
                },
            ],
        },
        {
            id: "attachments",
            title: "Documents",
            fields: [
                // If you already have FileUpload molecule, place it here. Otherwise keep a placeholder:
                { id: "ownershipDoc", type: "text", label: "Ownership Document (URL or ref)" },
            ],
        },
    ],
};
