
import { asDefault } from "@gov/core";

export const loadLogin = asDefault(
    () => import("./Login.jsx"),
    "LoginPage"
);
export const loadRegister = asDefault(
    () => import("./Register.jsx"),
    "RegisterPage"
);
