# UI Engine

## Module Prefetching

The UI engine exposes a `prefetchModule(moduleKey)` function from `modules-orchestrator`.
It triggers a module's `loader()` and caches the resulting promise so the module can be
registered when it is first needed.

### When is prefetching used?

The engine automatically prefetches modules when a navigation item with a
`data-module-key` attribute is hovered and when the browser is idle.

### Manual prefetching

Feature teams can call `prefetchModule` directly to warm modules based on
analytics or user context:

```js
import { prefetchModule } from '@gov/ui-engine/modules-orchestrator';

// e.g. prefetch the payments module when user is likely to visit it
prefetchModule('payments');
```

Prefetching does not register the module; the module is registered when it is
first rendered through `ModuleGate`.