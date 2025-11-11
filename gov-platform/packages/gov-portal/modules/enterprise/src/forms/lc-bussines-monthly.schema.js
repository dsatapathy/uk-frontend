export const lcBusinessMonthlyFormSchema = {
    $schema: "fe.v1",
    id: "lc-business-monthly-form",
    version: "1.0.0",
    title: "LC Business Monthly Form",
    sections: [
        {
            id: "lc-business-monthly-details",
            title: "LC Business Monthly Details",
            fields: [
                /* --- Location Hierarchy --- */
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
                    grid: { span: { xs: 12, sm: 4, md: 3 } },
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
                    grid: { span: { xs: 12, sm: 4, md: 3 } },
                },
                {
                    id: "lc",
                    type: "autocomplete",
                    label: "LC Name",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_profiles" },
                        dependsOn: ["values.block"],
                        dependsOnHint: "Select Block first",
                        queryBuilder: (deps) => ({
                            type: "lc_profiles",
                            id: deps.block,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 4, md: 3 } },
                },

                /* --- Finance & Category Details --- */
                {
                    id: "financeYear",
                    type: "autocomplete",
                    label: "Finance Year",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "financial_year" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 4, md: 3 } },
                },
                {
                    id: "typeOfCategory",
                    type: "autocomplete",
                    label: "Type of Category",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_category_name" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Activity --- */
                {
                    id: "activity",
                    type: "autocomplete",
                    label: "गतिविधि का नाम (Activity)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "name",
                        valueKey: "id",
                        query: { type: "lc_clf_activity" },
                        dependsOn: ["values.typeOfCategory"],
                        dependsOnHint: "Select Category first",
                        queryBuilder: (deps) => ({
                            type: "lc_clf_activity",
                            id: deps.typeOfCategory,
                        }),
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },

                /* --- Month Selection --- */
                {
                    id: "monthly",
                    type: "autocomplete",
                    label: "Month",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "months" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "headingforthesection",
                    type: "subHeading",
                    label: "Purchase/Sale- बाजार से खरीद कर बेचे जाने वाली वस्तु या सामग्री के लिए (Purchase) एवं बाजार को बेचे जाने वाली वस्तु या सामग्री के लिए (Sale)"
                },
                /* --- Purchase/Sale Details --- */
                {
                    id: "activityStartDate",
                    type: "date",
                    label: "गतिविधि शुरू करने की तिथि",
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "purchaseSale",
                    type: "autocomplete",
                    label: "Purchase/Sale",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "purhase_type" },
                    },
                    validations: [{ type: "required" }],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "beneficiariesCount",
                    type: "text",
                    label: "गतिविधि से जुड़े लाभार्थियों की संख्या",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "femaleBeneficiariesCount",
                    type: "text",
                    label: "गतिविधि से जुड़ी महिला लाभार्थियों की संख्या",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "scheduledCasteBeneficiariesCount",
                    type: "text",
                    label: "गतिविधि से जुड़े SC लाभार्थियों की संख्या",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "scheduledTribeBeneficiariesCount",
                    type: "text",
                    label: "गतिविधि से जुड़े ST लाभार्थियों की संख्या",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "investmentTillLastMonth",
                    type: "text",
                    label: "गतिविधि में LC/CLF का निवेश विगत माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "investmentThisMonth",
                    type: "text",
                    label: "गतिविधि में LC/CLF का निवेश वर्तमान माह (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalInvestment",
                    type: "text",
                    label: "गतिविधि में LC/CLF का निवेश कुल माह तक(रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "projectInvestmentTillLastMonth",
                    type: "text",
                    label: "गतिविधि में परियोजना का निवेश विगत माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "projectInvestmentThisMonth",
                    type: "text",
                    label: "गतिविधि में परियोजना का निवेश वर्तमान माह में (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalProjectInvestment",
                    type: "text",
                    label: "गतिविधि में परियोजना का निवेश कुल माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bankInvestmentTillLastMonth",
                    type: "text",
                    label: "गतिविधि में बैंक का निवेश विगत माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "bankInvestmentThisMonth",
                    type: "text",
                    label: "गतिविधि में बैंक का निवेश वर्तमान माह में (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalBankInvestment",
                    type: "text",
                    label: "गतिविधि में बैंक का निवेश कुल माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "otherInvestmentTillLastMonth",
                    type: "text",
                    label: "गतिविधि में अन्य का निवेश विगत माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "otherInvestmentThisMonth",
                    type: "text",
                    label: "गतिविधि में अन्य का निवेश वर्तमान माह में (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalOtherInvestment",
                    type: "text",
                    label: "गतिविधि में अन्य का निवेश कुल माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "turnOverTillLastMonth",
                    type: "text",
                    label: "टर्न ओवर/बिक्री विगत माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "turnOverThisMonth",
                    type: "text",
                    label: "टर्न ओवर/बिक्री वर्तमान माह में (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "turnOverTotal",
                    type: "text",
                    label: "टर्न ओवर/बिक्री कुल माह तक (रु)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "profitTillLastMonth",
                    type: "text",
                    label: "लाभ विगत माह तक (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "profitThisMonth",
                    type: "text",
                    label: "लाभ वर्तमान माह में (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "profitTotal",
                    type: "text",
                    label: "लाभ कुल माह तक (₹)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "area",
                    type: "text",
                    label: "क्षेत्र (नाली/संख्या)",
                    validations: [
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "areaUnit",
                    type: "autocomplete",
                    label: "क्षेत्र इकाई (unit)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" },
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "yield",
                    type: "text",
                    label: "उपार्जन (किलोग्राम/लीटर//संख्या)",
                    validations: [
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "yieldUnit",
                    type: "autocomplete",
                    label: "उपार्जन इकाई (unit)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" },
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalYield",
                    type: "text",
                    label: "कुल उत्पादन (किलोग्राम/लीटर//संख्या)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "totalYieldUnit",
                    type: "autocomplete",
                    label: "कुल उपार्जन इकाई (unit)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" },
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "consumption",
                    type: "text",
                    label: "उपभोग (किलोग्राम/लीटर//संख्या)",
                    validations: [
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "consumptionUnit",
                    type: "autocomplete",
                    label: "उपभोग इकाई (unit)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" },
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "marketableProduct",
                    type: "text",
                    label: "विपणन योग्य उत्पाद",
                    validations: [
                        { type: "required" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "marketableProductUnit",
                    type: "autocomplete",
                    label: "विपणन योग्य उत्पाद इकाई (unit)",
                    options: {
                        endpointKey: "v1/master/data",
                        labelKey: "label",
                        valueKey: "value",
                        query: { type: "csa_seed_measure_units" },
                    },
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                },
                {
                    id: "pricePerUnit",
                    type: "text",
                    label: "मूल्य प्रति इकाई(unit)",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                }, {
                    id: "totalPrice",
                    type: "text",
                    label: "कुल मूल्य",
                    validations: [
                        { type: "required" },
                        { type: "pattern", value: "^\\d+$", message: "Invalid Input, Expecting Number" }
                    ],
                    grid: { span: { xs: 12, sm: 6, md: 4 } },
                }
            ],
        },
    ],
};
