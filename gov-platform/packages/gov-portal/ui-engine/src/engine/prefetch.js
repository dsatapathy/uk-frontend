// src/engine/prefetch.js
import React from "react";
import { prefetchModule } from "../modules-orchestrator";

export function useModulePrefetch() {
  React.useEffect(() => {
    const handleHover = (e) => {
      const key = e.target?.dataset?.moduleKey;
      if (key) prefetchModule(key);
    };
    document.addEventListener("mouseover", handleHover);

    return () => {
      document.removeEventListener("mouseover", handleHover);
    };
  }, []);
}
