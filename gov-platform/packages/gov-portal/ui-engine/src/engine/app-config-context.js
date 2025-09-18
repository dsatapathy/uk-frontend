// src/engine/app-config-context.js
import * as React from "react";

export const AppConfigContext = React.createContext({});
export const useAppConfig = () => React.useContext(AppConfigContext);
