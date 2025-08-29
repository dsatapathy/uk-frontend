// form/FormEngineProvider.jsx
import React from "react";
import { injectReducer } from "./provider.jsx";
import formReducer from "../slices/form/index.js";

const WithFormReducers = injectReducer("form", formReducer);
// state tree will be: state.form.formSession / state.form.drafts / state.form.featureFlags

export default function FormEngineProvider({ children }) {
  return <WithFormReducers>{children}</WithFormReducers>;
}
