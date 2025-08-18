import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ComponentFactory from "./ComponentFactory";
import { getGuard, getLayout } from "./registry";

function Guarded({ guard, children, context }) {
  if (!guard) return children;
  return guard(context) ? children : <Redirect to="/" />;
}

export default function RouteBuilder({ routes = [], context }) {
  return (
    <Switch>
      {routes.map((r) => {
        const Layout = (r.layout && getLayout(r.layout)) || React.Fragment;
        const GuardFn = r.guard && getGuard(r.guard);
        return (
          <Route key={r.path} exact={!!r.exact} path={r.path}>
            <Guarded guard={GuardFn} context={context}>
              <Layout context={context}>
                <ComponentFactory node={r.page} context={context} />
              </Layout>
            </Guarded>
          </Route>
        );
      })}
      <Redirect to={routes[0]?.path || "/"} />
    </Switch>
  );
}
