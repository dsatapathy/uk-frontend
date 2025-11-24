import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { memberProfileSchema } from "../form/member-profile.schema";
import { memberProfileSteps } from "../form/member-profile.steps";
import { getComponent } from "@gov/core";
import { useSubmitData } from "@gov/data";
import {apiService} from "@gov/data";
import { useSnackbar } from "@gov/library";
import { useLoader } from "@gov/library";
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
    memberId: "mem-001",
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
function flatFromMock(memberData,update=false) {
  return {
    // registration
    action: update ? "update" : "create",
    // district/block/gp/village as codes number
    district: memberData?.district ? Number(memberData?.district) : "",
    block: memberData?.block ? Number(memberData?.block) : "",
    gp: memberData?.gp ? Number(memberData?.gp) : "",
    village: memberData?.village ? Number(memberData?.village) : "",

    // association
    // clf/vo/shg as codes number
    clf: memberData?.clf ? Number(memberData?.clf) : "",
    vo: memberData?.vo ? Number(memberData?.vo) : "",
    shg: memberData?.shg ? Number(memberData?.shg) : "",
    // shgCode as number string
    shgCode: memberData?.shgCode ? String(memberData?.shgCode) : "",
    memberId: memberData?.memberId,
    shgJoinDate: memberData?.shgJoinDate,
    // uid as string
    uid: memberData?.uid ? String(memberData?.uid) : "",

    // personalA
    guardianName: memberData?.guardianName,
    // mobile as string
    mobile: memberData?.mobile ? String(memberData?.mobile) : "",
    // aadhaar as string
    aadhaar: memberData?.aadhaar ? String(memberData?.aadhaar) : "",
    // voterId as string
    voterId: memberData?.voterId ? String(memberData?.voterId) : "",
    // rationType as string
    rationType: memberData?.rationType ? String(memberData?.rationType) : "",
    // education as string
    education: memberData?.education ? String(memberData?.education) : "",
    // personalB
    dob: memberData?.dob ? String(memberData?.dob) : "",
    // age as number string
    age: memberData?.age ? String(memberData?.age) : "",
    // socialCategory as string
    socialCategory: memberData?.socialCategory ? String(memberData?.socialCategory) : "",
    // pwd as string
    pwd: memberData?.pwd ? String(memberData?.pwd) : "",
    // religion as string
    religion: memberData?.religion ? String(memberData?.religion) : "",
    maritalStatus: memberData?.maritalStatus ? String(memberData?.maritalStatus) : "",
    seccCategory: memberData?.seccCategory ? String(memberData?.seccCategory) : "",
    diffAbledSelf: memberData?.diffAbledSelf ? String(memberData?.diffAbledSelf) : "",
    tribal: memberData?.tribal ? String(memberData?.tribal) : "",

    // household
    // hhSize as number string
    hhSize: memberData?.hhSize ? String(memberData?.hhSize) : "",
    // children05 as number string
    children05: memberData?.children05 ? String(memberData?.children05) : "",
    // schoolChildren as number string
    schoolChildren: memberData?.schoolChildren ? String(memberData?.schoolChildren) : "",
    headOfHousehold: memberData?.headOfHousehold ? String(memberData?.headOfHousehold) : "",
    houseType: memberData?.houseType ? String(memberData?.houseType) : "",
    electricity: memberData?.electricity ? String(memberData?.electricity) : "",
    drinkingWater: memberData?.drinkingWater ? String(memberData?.drinkingWater) : "",
    sanitation: memberData?.sanitation ? String(memberData?.sanitation) : "",
    lpg: memberData?.lpg ? (memberData?.lpg === "No" ? "No" : "Yes") : "",

    // livelihood
    // landOwnership as "f" or "t"
    landOwnership: memberData?.landOwnership ? (memberData?.landOwnership === "No" ? "No" : "Yes") : "",
    // totalLand as number string
    totalLand: memberData?.totalLand ? String(memberData?.totalLand) : "",
    irrigatedLand: memberData?.irrigatedLand ? String(memberData?.irrigatedLand) : "",
    rainfedLand: memberData?.rainfedLand ? String(memberData?.rainfedLand) : "",
    uncultivatedLand: memberData?.uncultivatedLand ? String(memberData?.uncultivatedLand) : "",
    // ownsLivestock as "f" or "t"
    ownsLivestock: memberData?.ownsLivestock ? (memberData?.ownsLivestock === "No" ? "No" : "Yes") : "",
    cowCount: memberData?.cowCount ? String(memberData?.cowCount) : "",
    bullCount: memberData?.bullCount ? String(memberData?.bullCount) : "",
    buffaloCount: memberData?.buffaloCount ? String(memberData?.buffaloCount) : "",
    nonFarmActivity: memberData?.nonFarmActivity ? String(memberData?.nonFarmActivity) : "",
    wageLabour: memberData?.wageLabour ? String(memberData?.wageLabour) : "",
    // migration as "f" or "t"
    migration: memberData?.migration ? (memberData?.migration === "No" ? "No" : "Yes") : "",
    migrationPurpose: memberData?.migrationPurpose,

    // income
    // annualIncome as number string
    annualIncome: memberData?.annualIncome ? String(memberData?.annualIncome) : "",
    majorIncomeSource: memberData?.majorIncomeSource,
    // savingsPerMonth as number string
    savingsPerMonth: memberData?.savingsPerMonth ? String(memberData?.savingsPerMonth) : "",
    hasBankAccount: memberData?.hasBankAccount,
    bankName: memberData?.bankName ? String(memberData?.bankName) : "",
    accountNo: memberData?.accountNo ? String(memberData?.accountNo) : "",
    branchName: memberData?.branchName ? String(memberData?.branchName) : "",
    accountType: memberData?.accountType ? String(memberData?.accountType) : "",
    ifsc: memberData?.ifsc ? String(memberData?.ifsc) : "",

    // documents (skip file fields)
    valueChainMapping: memberData?.valueChainMapping || "",
    pgMapping: memberData?.pgMapping || "",
    undertaking: memberData?.undertaking || false,
  };
}

function flattenWithExceptions(obj, keepKeys = []) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      for (const subKey in obj[key]) {
        if (keepKeys.includes(subKey)) {
          result[subKey] = obj[key][subKey];
        } else {
          result[subKey] = obj[key][subKey];
        }
      }
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

async function fetchMemberData(memberId) {
  const url = "v1/master/data";
  const method = "get";
  const params = { type: "member", id: memberId };
  const payload = null;
  const members = await apiService({ method, url, params, payload });
  if (!members) throw new Error("Member not found");
  return members;
}

export default function BeneficiaryMemberProfile() {
  const DynamicForm = getComponent("DynamicForm");
  const ConfigStepperMUI = getComponent("ConfigStepperMUI");
  const formApiRef = React.useRef(null);
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  const history = useHistory();

  const submitMutation = useSubmitData();
  const handleValuesChange = React.useCallback(async (vals, meta) => {
    const name = meta?.name;
    if (!name) return;


    // helper: reset form to create defaults
    const resetToCreate = (actionVal) => {
      const defaults = flatFromMock({},false);
      defaults.action = actionVal;
      formApiRef.current?.patch?.(defaults, { shouldValidate: false, shouldDirty: false });
    };
    // if action changed, reset to blank/create or clear form
    if (name === "action") {
      const actionVal = String(vals.action ?? "").toLowerCase();
      if (actionVal === "create" || actionVal === "update") {
        // reset entire form for a fresh "/create" or "/update" flow
        resetToCreate(actionVal);
        return;
      }
    }
    if (name !== "memberId") return;
    const id = typeof vals.memberId === "object"
      ? (vals.memberId?.id ?? vals.memberId?.value ?? vals.memberId?.code ?? null)
      : vals.memberId;
    const memberId = id;
    if (!memberId) return;
    // Optionally show loading indicator here

    try {
      show("Loading member data — please wait...");
      // Fetch member data from API
      const memberData = await fetchMemberData(memberId);

      // Flatten or transform memberData as needed for your form
      // If your API returns flat data, use it directly
      const flat = flatFromMock(memberData,true);

      // IMPORTANT: ensure the selected member id remains what the user picked
      flat.memberId = memberId;
      // Patch the form with the fetched data
      formApiRef.current?.patch?.(flat, { shouldValidate: false, shouldDirty: false });
      hide();
    } catch (err) {
      hide();
      enqueue({ message: "Failed to load member data", severity: "error" });
    }

  }, []);

  // Handler for form submit
  const handleSubmit = async (vals) => {
    // These keys should remain as objects/arrays
    const keepKeys = ["aadhaarPhoto", "disabilityCert", "memberPhoto"];

    // Flatten the formData, keeping the specified keys as objects/arrays
    const flatFormData = flattenWithExceptions(vals, keepKeys);

    const isUpdate = String(flatFormData.action || "").toLowerCase() === "update";
    show(isUpdate ? "Updating member profile — please wait..." : "Submitting member profile — please wait...");
    const payload = {
      module: "USER_DATA_UPDATE",
      operation: isUpdate ? "UPDATE" : "CREATE",
      formType: "MEMBER_PROFILE",
      formData: flatFormData,
    };
    const Url = "v1/reap/operations";
    const method = "post";
    submitMutation.mutate(
      { method, url: Url, payload },
      {
        onSuccess: (response) => {
          hide();
          enqueue({
            message: isUpdate ? "Member profile updated successfully" : "Form submitted successfully",
            severity: "success",
            duration: 6000,
          });
          console.log("SUBMIT SUCCESS", response);
          const params = new URLSearchParams({
            status: "success",
            heading: isUpdate ? "Update Successful For Member Profile" : "Submission Successful For Member Profile",
            form: "Beneficiary Member Profile",
            body: isUpdate ? "Your profile has been successfully updated." : "Your profile has been successfully created.",
            name: response?.data?.data?.memberName || "Unknown",
            reference: response?.data?.data?.memberId || "00XX00"
          }).toString();
          const target = `${window.location.origin}/reap-mis/common/acknowledgement_page?${params}`;
          window.location.href = target;
        },
        onError: (error) => {
          hide();
          const errMsg =
            error?.response?.data?.error?.message ||
            error?.message ||
            "Error submitting form.";
          console.log("SUBMIT ERROR", error);
          enqueue({ message: errMsg, severity: "error", duration: 6000 });
        },
      }
    );
  };

  return (
    <>
      <ConfigStepperMUI
        schema={memberProfileSchema}
        DynamicForm={DynamicForm}
        formApiRef={formApiRef}
        steps={memberProfileSteps}
        getStepActions={(step, ctx) =>
          ctx.index === ctx.total - 1 ? ["prev", "submit"] : ["prev", "next"]
        }
        // getStepActions={(step, ctx) =>
        //   ctx.index === ctx.total - 1 ? ["prev", "save", "draft", "submit"] : ["prev", "save", "next", "draft"]
        // }
        // onSave={(vals) => console.log("SAVE", vals)}
        // onDraft={(vals) => console.log("DRAFT", vals)}
        onSubmit={handleSubmit}
        formProps={{
          entityId: "member-profile",
          autosaveMs: 800,
          ui,
          onValuesChange: handleValuesChange,
        }}
      />

    </>
  );
}
