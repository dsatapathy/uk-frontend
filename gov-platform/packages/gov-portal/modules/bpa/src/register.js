import { registerComponent, registerAction } from "@gov/core";
import routes from "./routes.jsx";

import BpaCard from "./widgets/BpaCard.jsx";
import BpaStart from "./widgets/BpaStart.jsx";

export function register(app) {
  // expose widgets to the factory
  registerComponent("BpaCard", BpaCard);
  registerComponent("BpaStart", BpaStart);

  // actions used by widgets/config
  registerAction("bpa.start", () => app.history.push("/bpa/start"));
  registerAction("bpa.back",  () => app.history.push("/bpa"));
  registerAction("bpa.next",  () => alert("TODO: route to the next BPA step"));

  // contribute routes
  app.addRoutes([
    { path: "/bpa",        exact: true, layout: "Shell", page: { type: "BpaCard" } },
    { path: "/bpa/start", exact: true, layout: "Shell", page: routes.Start }
  ]);
}
