import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ fastRefresh: false })],
  build: {
    lib: { entry: "src/index.js", formats: ["es"] },
    rollupOptions: {
      external: ["react", "react-dom"],
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
