import React from "react";
import { getComponent } from "./registry";

const Fallback = ({ type }) => (
  <div style={{ color: "red" }}>Unknown component: {type}</div>
);

export default function ComponentFactory({ node, context }) {
  if (!node) return null;
  const { type, props = {}, children = [] } = node;
  // allow passing a real React component directly in config
  const Comp =
    typeof type === "string"
      ? (getComponent?.(type) /*|| getLocalComponent?.(type)*/ || Fallback)
      : (type || Fallback);

  return (
    <Comp {...props} context={context}>
      {children.map((child, i) => (
        <ComponentFactory key={i} node={child} context={context} />
      ))}
    </Comp>
  );
}
