import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { RouteBuilder, runtime } from "@gov/core";
import { makeModuleGate, buildLazyModuleRoutes } from "./modules-orchestrator.jsx";

const history = createBrowserHistory();

// Layout
const Shell = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "216px 1fr" }}>
    <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>Sidebar</aside>
    <main style={{ padding: 16 }}>{children}</main>
  </div>
);
runtime.registerLayout("Shell", Shell);

function App() {
  // 1) routes are STATE (so updates from modules re-render)
  const [routes, setRoutes] = React.useState(() => buildLazyModuleRoutes());

  // App API passed to modules
  const app = React.useMemo(() => ({
    history,
    // 2) PREPEND real routes so they win before the stub (Switch picks first match)
    addRoutes: (r) => setRoutes(prev => [...r, ...prev]),
  }), []);

  // Context for ComponentFactory (kept simple here)
  const context = React.useMemo(() => ({ history, actions: {} }), []);

  // Register ModuleGate once
  const ModuleGate = React.useMemo(() => makeModuleGate({ app }), [app]);
  runtime.registerComponent("ModuleGate", ModuleGate);

  return (
    <Router history={history}>
      <RouteBuilder routes={routes} context={context} />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
