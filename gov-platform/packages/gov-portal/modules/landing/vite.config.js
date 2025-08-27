import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import traceResolver from "../../../../scripts/trace-resolver";

export default defineConfig({
  plugins: [
    // keep if you need this resolver; otherwise you can remove it
    traceResolver("@gov/ui-engine"),
    react()
  ],
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: () => "index.mjs"
    },
    rollupOptions: {
      // never bundle peer deps
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "@gov/core",
        "@gov/data",
        "@gov/store",
        "@gov/library",
        "@mui/material",
        "@hookform/resolvers",
        "react-hook-form",
        "zod"
      ],
      onwarn(warning, defaultHandler) {
        if (warning.code === "UNRESOLVED_IMPORT") {
          console.error(
            `[UNRESOLVED_IMPORT] ${warning.source} imported by ${warning.importer}`
          );
        }
        defaultHandler(warning);
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  }
});
