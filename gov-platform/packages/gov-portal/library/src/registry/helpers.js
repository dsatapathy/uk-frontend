import { asDefault, LazyWrap, registerComponent, lazyModule } from "@gov/core";

export const makeLoader = (path, exportName) =>
  asDefault(() => import(/* @vite-ignore */ path), exportName);

// Simple bulk registrar for components
export const registerAll = (defs) => {
  defs.forEach(([name, loader]) => {
    registerComponent(name, LazyWrap(loader, name));
  });
};

// Lazy “module” helper (non-component functions)
export const lazy = (path) => lazyModule(() => import(/* @vite-ignore */ path));
