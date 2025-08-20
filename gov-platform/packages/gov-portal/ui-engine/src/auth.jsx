import React from "react";
import { useHistory, useLocation } from "react-router-dom";

export function ensureAuthGuard(routes, auth) {
  if (!auth || auth.strategy === "none") return routes;

  const Guard = makeTokenGuard(auth);
  // Ideally don’t wrap public routes. If you don’t have meta flags yet,
  // we’ll at least allow the login path inside the guard (see below).
  return [{ path: "*", layout: "Shell", page: { type: Guard }, children: routes }];
}

function makeTokenGuard(auth) {
  const publicPaths = [auth.login?.path || "/login", ...(auth.publicPaths || [])];
  return function TokenGuard({ children }) {
    const history = useHistory();
    const location = useLocation();

    // Treat login path as public to avoid redirect loop
    const isPublic = publicPaths.includes(location.pathname);
    const [ok, setOk] = React.useState(isPublic ? true : null);

    React.useEffect(() => {
      if (isPublic) return; // allow public routes without token
      Promise.resolve(auth.getToken?.()).then((token) => {
        if (token) setOk(true);
        else {
          setOk(false);
          const fail = auth.onAuthFail || publicPaths[0];
          if (typeof fail === "string") history.replace(fail);
          else fail?.({ navigate: (to) => history.replace(to) });
        }
      });
    }, [isPublic, history]);

    if (ok === null) return <div>Checking authentication…</div>;
    return ok ? children : null;
  };
}
