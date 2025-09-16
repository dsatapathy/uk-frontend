import React from "react";
import { registerComponent } from "@gov/core";
import { LazyWrap } from "@gov/core";
import { loadLogin, loadRegister } from "./screens";
import { loadLoginForm } from "./components";

export function register(app) {
  registerComponent("LoginPage", LazyWrap(loadLogin, "Login Page"));
  registerComponent("RegisterPage", LazyWrap(loadRegister, "Register Page"));
  registerComponent("LoginForm", LazyWrap(loadLoginForm, "Login Form"));

  app.addRoutes([
    { path: "/login", exact: true, layout: "Shell", page: { type: "LoginPage" } },
    { path: "/register", exact: true, layout: "Shell", page: { type: "RegisterPage" } }
  ]);
}