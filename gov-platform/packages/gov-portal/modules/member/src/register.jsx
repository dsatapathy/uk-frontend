// register.js
import React from "react";
import { registerComponent, registerAction } from "@gov/core";
import { LazyWrap } from "@gov/core";
import "@gov/styles/modules/bpa/index.scss";

// If you placed loaders in widgets/index.js:
import {
  loadBeneficiaryMemberProfile,
  loadSHGProfileUpdate,
  loadVOProfileUpdate,
  loadCLFLCProfileUpdate,
  loadLeaderProfileUpdate,
  loadShareholderProfileUpdate,
  loadFPOProfileUpdate,
  loadPGProfileUpdate,
  loadLCToCLFConversion,
  loadMemberLanding,
} from "./screens";

// If your project keeps them in ./screens instead, just swap the import path above to "./screens".

export function register(app) {
  // Components (register loaders, not raw components)
  registerComponent(
    "BeneficiaryMemberProfile",
    LazyWrap(loadBeneficiaryMemberProfile, "Beneficiary Member Profile")
  );
  registerComponent(
    "SHGProfileUpdate",
    LazyWrap(loadSHGProfileUpdate, "SHG Profile Update")
  );
  registerComponent(
    "VOProfileUpdate",
    LazyWrap(loadVOProfileUpdate, "VO Profile Update")
  );
  registerComponent(
    "CLFLCProfileUpdate",
    LazyWrap(loadCLFLCProfileUpdate, "CLF/LC Profile Update")
  );
  registerComponent(
    "LeaderProfileUpdate",
    LazyWrap(loadLeaderProfileUpdate, "Leader Profile Update")
  );
  registerComponent(
    "ShareholderProfileUpdate",
    LazyWrap(loadShareholderProfileUpdate, "Shareholder Profile Update")
  );
  registerComponent(
    "FPOProfileUpdate",
    LazyWrap(loadFPOProfileUpdate, "FPO Profile Update")
  );
  registerComponent(
    "PGProfileUpdate",
    LazyWrap(loadPGProfileUpdate, "PG Profile Update")
  );
  registerComponent(
    "LCToCLFConversion",
    LazyWrap(loadLCToCLFConversion, "LC → CLF Conversion")
  );
  registerComponent(
    "MemberLanding",
    LazyWrap(loadMemberLanding, "Member Landing")
  );

  // Actions (optional shortcuts you can fire from menu/items)
  registerAction("user.member.profile", () => app.history.push("/member/user/memberdetails"));
  registerAction("user.shg.update",     () => app.history.push("/member/user/shg"));
  registerAction("user.vo.update",      () => app.history.push("/member/user/vo"));
  registerAction("user.clf.update",     () => app.history.push("/member/user/clf-lc"));
  registerAction("user.leader.update",  () => app.history.push("/member/user/leader"));
  registerAction("user.shareholder",    () => app.history.push("/member/user/shareholder"));
  registerAction("user.fpo.update",     () => app.history.push("/member/user/fpo"));
  registerAction("user.pg.update",      () => app.history.push("/member/user/pg"));
  registerAction("user.lcToClf",        () => app.history.push("/member/user/lc-to-clf"));

  // Routes (aligned to your menu paths)
  app.addRoutes([
    // default member landing (kept)
    { path: "/member", exact: true, layout: "Shell", page: { type: "MemberLanding" } },

    // User Data Updation → 9 pages
    { path: "/member/user/memberdetails", exact: true, layout: "Shell", page: { type: "BeneficiaryMemberProfile" } },
    { path: "/member/user/shg",           exact: true, layout: "Shell", page: { type: "SHGProfileUpdate" } },
    { path: "/member/user/vo",            exact: true, layout: "Shell", page: { type: "VOProfileUpdate" } },
    { path: "/member/user/clf-lc",        exact: true, layout: "Shell", page: { type: "CLFLCProfileUpdate" } },
    { path: "/member/user/leader",        exact: true, layout: "Shell", page: { type: "LeaderProfileUpdate" } },
    { path: "/member/user/shareholder",   exact: true, layout: "Shell", page: { type: "ShareholderProfileUpdate" } },
    { path: "/member/user/fpo",           exact: true, layout: "Shell", page: { type: "FPOProfileUpdate" } },
    { path: "/member/user/pg",            exact: true, layout: "Shell", page: { type: "PGProfileUpdate" } },
    { path: "/member/user/lc-to-clf",     exact: true, layout: "Shell", page: { type: "LCToCLFConversion" } },
  ]);
}
