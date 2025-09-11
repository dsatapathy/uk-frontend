// widgets/index.js (optional)
import { asDefault } from "@gov/core";

export const loadNewMember = asDefault(
    () => import("./NewMember.jsx"),
    "NewMember"
);

export const loadUpdateMember = asDefault(
    () => import("./UpdateMember.jsx"),
    "UpdateMember"
);
export const loadMemberList = asDefault(
    () => import("./MemberList.jsx"),
    "MemberList"
);
