// Re-export registry API as named exports (so modules can do `import { registerAction } from "@gov/core"`).
export {
    registerComponent,
    getComponent,
    registerAction,
    getAction,
    registerGuard,
    getGuard,
    registerLayout,
    getLayout,
  } from "./runtime/registry";

  export {
    asDefault,
    asNamed,
    assertRenderable
  } from "./runtime/lazy";
  
  // Keep namespace export too (optional, but handy: `import * as core from "@gov/core"`)
  export * as runtime from "./runtime/registry";
  
  // Router + factory
  export { default as RouteBuilder } from "./runtime/RouteBuilder";
  export { default as ComponentFactory } from "./runtime/ComponentFactory";
  export { default as LazyWrap } from "./runtime/LazyWrap";
  
  // IMPORTANT: this file contains JSX; ensure it's named .jsx
  import "./runtime/blocks.jsx";
  