export const voRegistrationFormSchema = {
    "$schema": "fe.v1",
    "id": "vo-registration",
    "version": "1.0.0",
    "title": "VO Registration Form",
    "sections": [
        {
            "id": "vo-details",
            "title": "VO Registration Details",
            "fields": [
                {
                    id: "district",
                    type: "autocomplete",
                    label: "District",
                    options: {
                        endpointKey: "districts",
                        labelKey: "name",
                        valueKey: "code"
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "block",
                    type: "autocomplete",
                    label: "Block",
                    options: {
                        endpointKey: "blocks",
                        labelKey: "name",
                        valueKey: "code",
                        dependsOn: ["values.district"],
                        dependsOnHint: "Select District first"
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    id: "gp",
                    type: "autocomplete",
                    label: "Gram Panchayat",
                    options: {
                        endpointKey: "gps",
                        labelKey: "name",
                        valueKey: "code",
                        dependsOn: ["values.district", "values.block"],
                        dependsOnHint: "Select District and Block first"
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 }, }
                },
                {
                    "id": "vo",
                    "type": "text",
                    "label": "VO",
                    "validations": [{ "type": "required" }],
                    "description": "Enter the VO under the CLF"
                },
                {
                    "id": "date_of_registration",
                    "type": "date",
                    "label": "Date Of Registration",
                    "validations": [{ "type": "required" }],
                    "description": "Select date of VO registration (dd-mm-yyyy)"
                },
                {
                    "id": "vo_registration_code",
                    "type": "dropdown",
                    "label": "VO Registration Code",
                    "options": { "endpointKey": "vo_codes", "deps": ["vo"] },
                    "validations": [{ "type": "required" }],
                    "description": "Select VO code in the CLF from the dropdown"
                },
                {
                    "id": "address",
                    "type": "text",
                    "label": "Address",
                    "validations": [{ "type": "required" }],
                    "description": "Format - Hamlet, GP, Block, District"
                },
                {
                    "id": "parent_clf",
                    "type": "dropdown",
                    "label": "Parent CLF",
                    "options": { "endpointKey": "clfs", "deps": ["block"] },
                    "validations": [{ "type": "required" }],
                    "description": "Select CLF in the block"
                },
                {
                    "id": "shg_mapped",
                    "type": "number",
                    "label": "SHG Mapped",
                    "validations": [{ "type": "required" }],
                    "description": "Total SHGs under the VO"
                },
                {
                    "id": "members_in_ec_committee",
                    "type": "number",
                    "label": "Members In EC Committee",
                    "validations": [{ "type": "required" }],
                    "description": "Total members in the Executive Committee"
                },
                {
                    "id": "monitoring_committee_formed",
                    "type": "radio-group",
                    "label": "Monitoring Committee Formed",
                    "options": { "items": [{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no" }] },
                    "validations": [{ "type": "required" }],
                    "description": "Select if monitoring committee is formed"
                },
                {
                    "id": "livelihood_committee_formation",
                    "type": "radio-group",
                    "label": "Livelihood Committee Formation",
                    "options": { "items": [{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no" }] },
                    "validations": [{ "type": "required" }],
                    "description": "Select if livelihood committee is formed"
                },
                {
                    "id": "seed_revolving_fund_received",
                    "type": "radio-group",
                    "label": "Seed Revolving Fund Received",
                    "options": { "items": [{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no" }] },
                    "validations": [{ "type": "required" }],
                    "description": "Select if seed revolving fund received"
                },
                {
                    "id": "seed_revolving_fund_receiving_date",
                    "type": "date",
                    "label": "Seed Revolving Fund Receiving Date",
                    "description": "Select date when seed revolving fund was received (dd-mm-yyyy)"
                },
                {
                    "id": "seed_revolving_fund_utilised",
                    "type": "radio-group",
                    "label": "Seed Revolving Fund Utilised",
                    "options": { "items": [{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no" }] },
                    "validations": [{ "type": "required" }],
                    "description": "Select if seed revolving fund utilised"
                },
                {
                    "id": "storage_for_drudgery_reduction_tools",
                    "type": "radio-group",
                    "label": "Storage For Drudgery Reduction Tools",
                    "options": { "items": [{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no" }] },
                    "validations": [{ "type": "required" }],
                    "description": "Select if storage for drudgery reduction tools available"
                },
                {
                    "id": "vo_bank_name",
                    "type": "text",
                    "label": "VO Bank Name",
                    "validations": [{ "type": "required" }],
                    "description": "Enter VO bank name"
                },
                {
                    "id": "vo_account_no",
                    "type": "number",
                    "label": "VO A/C No.",
                    "validations": [{ "type": "required" }],
                    "description": "Enter VO account number"
                },
                {
                    "id": "vo_ifsc_code",
                    "type": "text",
                    "label": "VO IFSC Code",
                    "validations": [{ "type": "required" }],
                    "description": "Enter VO IFSC code"
                },
                {
                    "id": "means_of_verification",
                    "type": "file",
                    "label": "Means Of Verification",
                    "description": "Upload means of verification document"
                }
            ]
        }
    ]
}
