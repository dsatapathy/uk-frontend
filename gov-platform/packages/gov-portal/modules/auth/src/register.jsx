import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { loadLogin, loadRegister } from "./widgets";

export function register(app) {
  registerComponent("LoginPage", LazyWrap(loadLogin, "Login Page"));
  registerComponent("RegisterPage", LazyWrap(loadRegister, "Register Page"));

  app.addRoutes([
    { path: "/login", exact: true, layout: "Shell", page: { type: "LoginPage" } },
    { path: "/register", exact: true, layout: "Shell", page: { type: "RegisterPage" } }
  ]);
}