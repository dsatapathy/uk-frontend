// Return a loader compatible with React.lazy (i.e., resolves to { default: Component }).
// Usage: LazyWrap(asDefault(() => import("./LoginForm.jsx"), "LoginForm"), "Login Form")
export const asDefault = (importer, exportName = "default") => () =>
  importer().then((m) => {
    const candidate = m.default ?? m[exportName];
    if (!candidate) {
      const keys = Object.keys(m).join(", ");
      throw new Error(
        `Module has no export "${exportName}" (exports: ${keys || "none"})`
      );
    }
    return { default: candidate };
  });

// Convenience when you KNOW it's a named export
export const asNamed = (importer, exportName) => () =>
  importer().then((m) => ({ default: m[exportName] }));

// Optional: dev guard to ensure what you loaded is renderable
export const assertRenderable = (Comp, name = "Component") => {
  if (
    typeof Comp !== "function" &&
    !(Comp && (Comp.$$typeof || Comp.render)) // lazy/memo/forwardRef
  ) {
    throw new Error(`${name} is not a renderable React component`);
  }
  return Comp;
};
