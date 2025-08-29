// slices/form/index.js
import { combineReducers } from "@reduxjs/toolkit";
import formSession from "./formSession.slice.js";
import drafts from "./drafts.slice.js";
import featureFlags from "./featureFlags.slice.js";

const formReducer = combineReducers({
  formSession,
  drafts,
  featureFlags,
});

export default formReducer; // we will inject this under the key "form"
