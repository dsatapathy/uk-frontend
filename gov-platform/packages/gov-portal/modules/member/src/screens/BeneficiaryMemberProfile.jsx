import React from "react";
import { memberProfileSchema } from "../form/member-profile.schema";
import { memberProfileSteps } from "../form/member-profile.steps";
import { getComponent } from "@gov/core";

// ✅ fix nesting
const ui = {
  padding: 2,
  grid: {
    cols: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    gap: { xs: "s2", md: "s2" },
  },
  sections: { collapsible: false, defaultOpen: true },
  sectionCard: {
    elevation: 0,
    variant: "outlined",
    sx: {
      p: { xs: 1.5, md: 2 },
      borderRadius: "var(--g-radius)",
      border: (theme) => `1px solid ${theme.palette.divider}`,
      titleSx: { fontWeight: 600 },
    },
  },
  fieldLayout: "top",
  fieldWrapper: { dense: true, requiredMark: "asterisk", labelWidth: 220 },
};

// ⬇️ your hardcoded payload (exactly as you sent)
const MOCK_PROFILE = {
  registration: {
    action: "update",
    district: "DDN",
    block: "DDN-RAI",
    gp: "GP-RAI-1",
    village: "V-RAI-1A",
  },
  association: {
    clf: "clf-ddn-rai-1",
    vo: "vo-rai-1a",
    shg: "shg-rai-1a-1",
    shgCode: 1,
    memberToUpdate: "mem-001",
    shgJoinDate: "2025-09-15",
    uid: "12",
  },
  personalA: {
    guardianName: "sadfgsda",
    mobile: "8599847717",
    aadhaar: "121121211212",
    voterId: "1211",
    rationType: "AAY",
    education: "GRADUATE",
  },
  personalB: {
    dob: "2025-09-15",
    age: 0,
    socialCategory: "GEN",
    pwd: "No",
    religion: "Hindu",
    maritalStatus: "Single",
    seccCategory: "POOR",
    diffAbledSelf: "No",
    tribal: "THARU",
  },
  household: {
    hhSize: 1,
    children05: 1,
    schoolChildren: 1,
    headOfHousehold: "Other",
    houseType: "Pucca",
    electricity: "No",
    drinkingWater: "Other",
    sanitation: "Own Toilet",
    lpg: "No",
  },
  livelihood: {
    landOwnership: "No",
    ownsLivestock: "No",
    nonFarmActivity: "Masonry",
    wageLabour: "Daily",
    migration: "No",
  },
  income: {
    annualIncome: "<5000",
    majorIncomeSource: "Agriculture",
    savingsPerMonth: 1,
    hasBankAccount: "No",
  },
  documents: {
    // memberPhoto: {},
    // aadhaarPhoto: {},
    valueChainMapping: "VEG",
    pgMapping: "PG-01",
    undertaking: true,
  },
};

// map from sectioned MOCK_PROFILE -> flat RHF values
function flatFromMock(p) {
  return {
    // registration
    action: p.registration?.action,
    district: p.registration?.district,
    block: p.registration?.block,
    gp: p.registration?.gp,
    village: p.registration?.village,

    // association
    clf: p.association?.clf,
    vo: p.association?.vo,
    shg: p.association?.shg,
    shgCode: p.association?.shgCode,
    memberToUpdate: p.association?.memberToUpdate,
    shgJoinDate: p.association?.shgJoinDate,
    uid: p.association?.uid,

    // personalA
    guardianName: p.personalA?.guardianName,
    mobile: p.personalA?.mobile,
    aadhaar: p.personalA?.aadhaar,
    voterId: p.personalA?.voterId,
    rationType: p.personalA?.rationType,
    education: p.personalA?.education,

    // personalB
    dob: p.personalB?.dob,
    age: p.personalB?.age,
    socialCategory: p.personalB?.socialCategory,
    pwd: p.personalB?.pwd,
    religion: p.personalB?.religion,
    maritalStatus: p.personalB?.maritalStatus,
    seccCategory: p.personalB?.seccCategory,
    diffAbledSelf: p.personalB?.diffAbledSelf,
    tribal: p.personalB?.tribal,

    // household
    hhSize: p.household?.hhSize,
    children05: p.household?.children05,
    schoolChildren: p.household?.schoolChildren,
    headOfHousehold: p.household?.headOfHousehold,
    houseType: p.household?.houseType,
    electricity: p.household?.electricity,
    drinkingWater: p.household?.drinkingWater,
    sanitation: p.household?.sanitation,
    lpg: p.household?.lpg,

    // livelihood
    landOwnership: p.livelihood?.landOwnership,
    totalLand: p.livelihood?.totalLand,
    irrigatedLand: p.livelihood?.irrigatedLand,
    rainfedLand: p.livelihood?.rainfedLand,
    uncultivatedLand: p.livelihood?.uncultivatedLand,
    ownsLivestock: p.livelihood?.ownsLivestock,
    cowCount: p.livelihood?.cowCount,
    bullCount: p.livelihood?.bullCount,
    buffaloCount: p.livelihood?.buffaloCount,
    nonFarmActivity: p.livelihood?.nonFarmActivity,
    wageLabour: p.livelihood?.wageLabour,
    migration: p.livelihood?.migration,
    migrationPurpose: p.livelihood?.migrationPurpose,

    // income
    annualIncome: p.income?.annualIncome,
    majorIncomeSource: p.income?.majorIncomeSource,
    savingsPerMonth: p.income?.savingsPerMonth,
    hasBankAccount: p.income?.hasBankAccount,
    bankName: p.income?.bankName,
    accountNo: p.income?.accountNo,
    branchName: p.income?.branchName,
    accountType: p.income?.accountType,
    ifsc: p.income?.ifsc,

    // documents (skip file fields)
    valueChainMapping: p.documents?.valueChainMapping,
    pgMapping: p.documents?.pgMapping,
    undertaking: p.documents?.undertaking,
  };
}

export default function BeneficiaryMemberProfile() {
  const DynamicForm = getComponent("DynamicForm");
  const ConfigStepperMUI = getComponent("ConfigStepperMUI");
  const formApiRef = React.useRef(null);

  const handleValuesChange = React.useCallback((vals, meta) => {
    if (meta?.name !== "memberToUpdate") return;
    const id = typeof vals.memberToUpdate === "object"
      ? (vals.memberToUpdate?.id ?? vals.memberToUpdate?.value ?? vals.memberToUpdate?.code ?? null)
      : vals.memberToUpdate;

    if (!id) return;

    // force update mode
    formApiRef.current?.setValue?.("action", "update", { shouldDirty: false });

    // use hardcoded data
    const flat = flatFromMock(MOCK_PROFILE);

    // IMPORTANT: ensure the selected member id remains what the user picked
    flat.memberToUpdate = id;

    // merge into the form without marking dirty / revalidating
    formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
  }, []);

  return (
    <ConfigStepperMUI
      schema={memberProfileSchema}
      DynamicForm={DynamicForm}
      formApiRef={formApiRef}
      steps={memberProfileSteps}
      getStepActions={(step, ctx) =>
        ctx.index === ctx.total - 1 ? ["prev", "save", "draft", "submit"] : ["prev", "save", "next", "draft"]
      }
      onSave={(vals) => console.log("SAVE", vals)}
      onDraft={(vals) => console.log("DRAFT", vals)}
      onSubmit={(vals) => console.log("SUBMIT", vals)}
      formProps={{
        entityId: "member-profile",
        autosaveMs: 800,
        ui,
        onValuesChange: handleValuesChange,
      }}
    />
  );
}
