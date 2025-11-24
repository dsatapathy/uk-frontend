export const beneficiaryTableHeader = [
  { id: "memberId", label: "Member ID", sortable: true },
  { id: "memberName", label: "Name", sortable: true },
  { id: "guardianName", label: "Father/Husband Name", sortable: true },
  { id: "age", label: "Age", numeric: true, sortable: true },
  // { id: "gender", label: "Gender", sortable: true },
  { id: "mobile", label: "Mobile Number", sortable: true },
  { id: "shgName", label: "SHG Name", sortable: true },
];

export const clfProfileTableHeader = [
  { id: "clfId", label: "CLF ID", sortable: true },
  { id: "clfName", label: "Name", sortable: true },
  { id: "panOrTan", label: "PAN or TAN", sortable: true },
  { id: "shgCount", label: "SHG Count", numeric: true, sortable: true },
  { id: "voCount", label: "VO Count", numeric: true, sortable: true },
  { id: "address", label: "Address", sortable: true },
];

export const fpoProfileTableHeader = [
  { id: "fpoId", label: "ID", sortable: true },
  { id: "fpoName", label: "Name", sortable: true },
  { id: "registrationNumber", label: "Registration Number", sortable: true },
  { id: "yearOfRegistration", label: "Year of Registration", sortable: true },
//   { id: "contactNo", label: "Phone", sortable: true },
//   { id: "gender", label: "Gender", sortable: true },
//   { id: "address", label: "Address", sortable: true },
];

export const lcProfileTableHeader = [
    { id: "lcId", label: "LC ID", sortable: true },
    { id: "lcName", label: "Name", sortable: true },
    { id: "panOrTan", label: "PAN or TAN", sortable: true },
    { id: "panchayatsCovered", label: "Panchayats Covered", sortable: true },
    { id: "shgCount", label: "SHG Count",  sortable: true },
    { id: "voCount", label: "VO Count",  sortable: true },
    { id: "address", label: "Address", sortable: true },
];

export const leaderProfileTableHeader = [
  { id: "presidentNameId", label: "Leader ID", sortable: true },
  { id: "presidentName", label: "Name", sortable: true },
  { id: "registrationNumber", label: "Registration Number", sortable: true },
  { id: "contactNo", label: "Phone", sortable: true },
  { id: "gender", label: "Gender", sortable: true },
  { id: "address", label: "Address", sortable: true },
];

export const pgProfileTableHeader = [
  { id: "pgId", label: "PG ID", sortable: true },
  { id: "pgName", label: "Name", sortable: true },
  { id: "pgCode", label: "PG Code", sortable: true },
  { id: "totalMembers", label: "Total Members in PG", numeric: true, sortable: true },
  // { id: "gender", label: "Gender", sortable: true },
  { id: "address", label: "Address", sortable: true },
];

export const shareholderProfileTableHeader = [
  { id: "shareholderId", label: "Shareholder ID", sortable: true },
  { id: "shareholderName", label: "Name", sortable: true },
  { id: "shareholderCode", label: "Shareholder Code", sortable: true },
  { id: "totalShares", label: "Total Shares", numeric: true, sortable: true },
  // { id: "gender", label: "Gender", sortable: true },
  { id: "address", label: "Address", sortable: true },
];

export const shgProfileTableHeader = [
  { id: "shgId", label: "SHG ID", sortable: true },
  { id: "shgName", label: "Name", sortable: true },
  { id: "shgCode", label: "SHG Code", sortable: true },
  { id: "totalMembers", label: "Total Members in SHG", numeric: true, sortable: true },
  // { id: "gender", label: "Gender", sortable: true },
  { id: "address", label: "Address", sortable: true },
];

export const voProfileTableHeader = [
  { id: "voId", label: "VO ID", sortable: true },
  { id: "vo", label: "Name", sortable: true },
  { id: "vo_registration_code", label: "VO Registration Code", sortable: true },
//   { id: "totalMembers", label: "Total Members in VO", numeric: true, sortable: true },
  { id: "date_of_registration", label: "Date of Registration", sortable: true },
  { id: "address", label: "Address", sortable: true },
];
