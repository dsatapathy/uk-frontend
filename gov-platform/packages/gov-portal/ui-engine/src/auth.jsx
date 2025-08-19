import React from "react";

export function ensureAuthGuard(routes, auth) {
  if (!auth || auth.strategy === "none") return routes;

  if (auth.strategy === "jwt" || auth.strategy === "custom") {
    const Guard = makeTokenGuard(auth);
    return [{ path: "*", layout: "Shell", page: { type: Guard }, children: routes }];
  }

  if (auth.strategy === "oidc") {
    const OIDC = ({ children }) => <>{children}</>; // plug real OIDC provider here
    return [{ path: "*", layout: "Shell", page: { type: OIDC }, children: routes }];
  }

  return routes;
}

function makeTokenGuard(auth) {
  return function TokenGuard({ children }) {
    const [ok, setOk] = React.useState(null);
    React.useEffect(() => {
      Promise.resolve(auth.getToken?.()).then((token) => {
        if (token) setOk(true);
        else {
          setOk(false);
          if (typeof auth.onAuthFail === "string") window.location.replace(auth.onAuthFail);
          else auth.onAuthFail?.({});
        }
      });
    }, []);
    if (ok === null) return <div>Checking authentication…</div>;
    return ok ? children : null;
  };
}
