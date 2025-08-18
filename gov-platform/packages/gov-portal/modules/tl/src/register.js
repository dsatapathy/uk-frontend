// Module entry: exposes a register() used by the app orchestrator
import { registerComponent, registerAction } from "@gov/core"; // or "@gov/core" in dev alias

import Routes from "./routes.jsx";
import TlCard from "./widgets/TlCard.jsx";

export function register(app) {
  // Register UI atoms for factory
  registerComponent("TlCard", TlCard);

  // Register actions
  registerAction("tl.start", () => app.history.push("/tl/start"));

  // Provide routes to the app
  app.addRoutes([
    { path: "/tl", exact: true, layout: "Shell", page: { type: "TlCard" } },
    { path: "/tl/start", exact: true, layout: "Shell", page: Routes.Start },
  ]);
}
