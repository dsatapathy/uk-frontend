// packages/gov-portal/modules/bpa/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/index.js", formats: ["es"] },
    rollupOptions: {
      external: [
        "react", 
        "react-dom", 
        "react-router-dom", 
        "@mui/material",
        "@mui/icons-material",
        "@mui/system",
        "@emotion/react",
        "@emotion/styled",
        "@gov/core", 
        "@gov/ui", 
        "@tanstack/react-query",
        "@tanstack/react-query-devtools",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "index.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
});
