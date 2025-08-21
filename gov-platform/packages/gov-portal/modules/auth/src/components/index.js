import { asDefault } from "@gov/core";

export const loadLoginForm = asDefault(
    () => import("./LoginForm.jsx"),
    "LoginForm"
);