import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/index.js", formats: ["es"] },
    rollupOptions: {
      // never bundle these
      external: ["react", "react-dom", "react-router-dom", "@gov/core", "@gov/data", "@gov/styles"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "index.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  }
});
