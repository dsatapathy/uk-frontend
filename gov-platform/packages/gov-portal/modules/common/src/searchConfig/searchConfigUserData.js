import { 
  memberProfileSearchSchema,
  shgProfileSearchSchema,
  voProfileSearchSchema,
  clfProfileSearchSchema,
  shareholderProfileSearchSchema,
  pgProfileSearchSchema,
  lcProfileSearchSchema,
  leaderSearchSchema,
  fpoProfileSearchSchema,
 } from "../reportsSchema/searchUserDataModule.schema";
import { 
  beneficiaryTableHeader, 
  clfProfileTableHeader,
  fpoProfileTableHeader,
  lcProfileTableHeader,
  leaderProfileTableHeader,
  pgProfileTableHeader,
  shareholderProfileTableHeader,
  shgProfileTableHeader,
  voProfileTableHeader,
} from "../reportHeaderSchema/tableHeaderUserDataModule";


// 🔥 Utility to map response data to table header

export const mapResponseToTable = (rows = [], tableHeader = []) => {
  return rows.map((row) => {
    const mappedRow = {};

    tableHeader.forEach((col) => {
      mappedRow[col.id] = row[col.id] ?? "-"; // fallback if field missing
    });

    return mappedRow;
  });
};

export const searchConfigForUserData = {
  beneficiary: {
    title: "Beneficiary Member Search",
    formSchema: memberProfileSearchSchema,
    tableSchema: beneficiaryTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "MEMBER_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, beneficiaryTableHeader);
      return mappedData;
    },
  },
  shg: {
    title: " SHG Profile Search",
    formSchema: shgProfileSearchSchema,
    tableSchema: shgProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "SHG_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, shgProfileTableHeader);
      return mappedData;
    },
  },
  vo: {
    title: " VO Profile Search",
    formSchema: voProfileSearchSchema,
    tableSchema: voProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "VO_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, voProfileTableHeader);
      return mappedData;
    },
  },
  clf: {
    title: "CLF Profile Search",
    formSchema: clfProfileSearchSchema,
    tableSchema: clfProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "CLF_LC_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, clfProfileTableHeader);
      return mappedData;
    },
  },
  lc: {
    title: "LC Profile Search",
    formSchema: lcProfileSearchSchema,
    tableSchema: lcProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "LC_MEMBER_MAPPING",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, lcProfileTableHeader);
      return mappedData;
    },
  },
  shareholder: {
    title: "Shareholder Profile Search",
    formSchema: shareholderProfileSearchSchema,
    tableSchema: shareholderProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "SHAREHOLDER_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, shareholderProfileTableHeader);
      return mappedData;
    },
  },
  fpo: {
    title: "FPO Profile Search",
    formSchema: fpoProfileSearchSchema,
    tableSchema: fpoProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "FPO_PROFILE_MAPPING",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, fpoProfileTableHeader);
      return mappedData;
    },
  },
  leader: {
    title: "Leader Profile Search",
    formSchema: leaderSearchSchema,
    tableSchema: leaderProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "REPRESENTATIVE_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, leaderProfileTableHeader);
      return mappedData;
    },
  },
  pg: {
    title: "PG Profile Search",
    formSchema: pgProfileSearchSchema,
    tableSchema: pgProfileTableHeader,
    payload: {
      module: "USER_DATA_UPDATE",
      operation: "SEARCH",
      formType: "PG_PROFILE",
    },
    api: {
      search: "v1/reap/operations",
      // count: "v1/reap/operations",
    },
    // 🔥 format response to match table header
    formatResponse: (res) => {
      const rows = res || [];        // depends on backend
      const mappedData = mapResponseToTable(rows, pgProfileTableHeader);
      return mappedData;
    },
  },
};
