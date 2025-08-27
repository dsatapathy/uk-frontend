import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import traceResolver from "../../../scripts/trace-resolver";

export default defineConfig({
  plugins: [
    traceResolver("@gov/store"),
    react()
  ],
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs")
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "@gov/core",
        "@gov/data",
        "@gov/styles",
        "@gov/library",
        "@gov/utils",
        "@gov/store"
      ],
      onwarn(warning, defaultHandler) {
        if (warning.code === "UNRESOLVED_IMPORT") {
          console.error(
            `[UNRESOLVED_IMPORT] ${warning.source}  imported by  ${warning.importer}`
          );
        }
        defaultHandler(warning);
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true
  }
});
