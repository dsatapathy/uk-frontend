// src/engine/prefetch.js
import React from "react";
import { prefetchModule } from "../modules-orchestrator";

export function useModulePrefetch(manifests) {
  React.useEffect(() => {
    const handleHover = (e) => {
      const key = e.target?.dataset?.moduleKey;
      if (key) prefetchModule(key);
    };
    document.addEventListener("mouseover", handleHover);

    const idleId =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => manifests.forEach((m) => prefetchModule(m.key)))
        : setTimeout(() => manifests.forEach((m) => prefetchModule(m.key)), 0);

    return () => {
      document.removeEventListener("mouseover", handleHover);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, [manifests]);
}
