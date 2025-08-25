import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import traceResolver from "../../../../scripts/trace-resolver";

export default defineConfig({
  plugins: [react(),traceResolver("@gov/ui-engine"),],
  build: {
    lib: { entry: "src/index.js", formats: ["es"] },
    rollupOptions: {
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
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "index.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
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
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  }
});