// widgets/index.js (optional)
import { asDefault } from "@gov/core";

export const loadBpaCard = asDefault(
    () => import("./BpaCard.jsx"),
    "BpaCard"
);
export const loadBpaStart = asDefault(
    () => import("./BpaStart.jsx"),
    "BpaStart"
);
