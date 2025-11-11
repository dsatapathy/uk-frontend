import { memberProfileSearchSchema } from "../reportsSchema/beneficiarySearch.schema";
import { beneficiaryTableHeader } from "../reportHeaderSchema/beneficiaryTableHeader";

export const searchConfigForUserData = {
  beneficiary: {
    title: "Beneficiary Member Search",
    formSchema: memberProfileSearchSchema,
    tableSchema: beneficiaryTableHeader,
    api: {
      search: "/v1/beneficiary/search",
      count: "/v1/beneficiary/count",
    },
  },
//   member: {
//     title: "Member Profile Search",
//     formSchema: memberProfileSearchSchema, // can be different
//     tableSchema: beneficiaryTableHeader,
//     api: {
//       search: "/v1/member/search",
//       count: "/v1/member/count",
//     },
//   },
  // Add more modules here easily
};
