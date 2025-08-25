// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import traceResolver from "../../../scripts/trace-resolver";

export default defineConfig({
  plugins: [react(),traceResolver("@gov/store"),],
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "react","react-dom","react-router-dom",
        "@gov/core","@gov/data","@gov/styles","@gov/library","@gov/utils","@gov/store"
      ],
    },
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "UNRESOLVED_IMPORT") {
            console.error(
              `[UNRESOLVED_IMPORT] ${warning.source}  imported by  ${warning.importer}`
            );
          }
          defaultHandler(warning);
        },
        // If building a library, also:
        // external: ["react","react-dom","@gov/ui-engine","@gov/store"],
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
