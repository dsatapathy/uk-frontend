// widgets/index.js (optional)
import { asDefault } from "@gov/core";

export const loadNewMember = asDefault(
    () => import("./NewMember.jsx"),
    "NewMember"
);
