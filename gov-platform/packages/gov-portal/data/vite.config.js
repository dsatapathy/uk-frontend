import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      // keep the library entry under src/ for consistency
      entry: resolve(__dirname, "index.js"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs")
    },
    rollupOptions: {
      // never bundle peers
      external: [
        "react",
        "react-dom",
        "axios",
        "@tanstack/react-query",
        "@tanstack/react-query-devtools" // keep if you import it; safe to leave external
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
    sourcemap: false,     // set true only if you need to debug the published lib
    target: "es2019",     // safe baseline for consumers
    minify: true          // minify by default for publishing
  }
});
