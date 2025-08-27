import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: () => "index.mjs"
    },
    rollupOptions: {
      // keep peers out of the bundle
      external: ["react", "react-dom", "react-router-dom"],
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
