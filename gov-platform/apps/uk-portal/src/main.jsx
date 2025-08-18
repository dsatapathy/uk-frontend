import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";           // <-- use low-level Router
import { createBrowserHistory } from "history";       // <-- external history

import { RouteBuilder, runtime } from "@gov/core";
import { loadModules } from "./modules-orchestrator";

const history = createBrowserHistory();               // <-- single shared history

// Layout
const Shell = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "216px 1fr" }}>
    <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside>
    <main style={{ padding: 16 }}>{children}</main>
  </div>
);
runtime.registerLayout("Shell", Shell);

// Collect routes from modules
const routes = [];
const app = {
  history,                               // <-- pass the same history to modules
  addRoutes: (r) => routes.push(...r),
};

await loadModules(app);                   // modules call register(app) and push routes

// Context passed to ComponentFactory; you can keep actions empty now
const context = { history, actions: {} };

function App() {
  return (
    <Router history={history}>
      <RouteBuilder routes={routes} context={context} />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
