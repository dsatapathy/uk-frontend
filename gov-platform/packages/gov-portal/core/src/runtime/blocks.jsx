import React from "react";
import { registerComponent, getAction } from "./registry";

export const Page = ({ children }) => <div className="page">{children}</div>;
export const Section = ({ title, children }) => (
  <section style={{ margin: "1rem 0" }}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
);
export const Card = ({ title, children }) => (
  <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 6 }}>
    {title && <h3>{title}</h3>}
    {children}
  </div>
);

export const Button = ({ label, onClick, action, context, ...rest }) => {
  const handler =
    onClick ??
    (action
      ? (e) => {
          const fromContext = context?.actions?.[action];
          if (fromContext) return fromContext(e);
          const fn = getAction(action);           // <-- fallback to registry
          if (fn) return fn(e);
          console.warn(`Action not found: ${action}`);
        }
      : undefined);

  return (
    <button onClick={handler} {...rest}>
      {label}
    </button>
  );
};

registerComponent("Page", Page);
registerComponent("Section", Section);
registerComponent("Card", Card);
registerComponent("Button", Button);
