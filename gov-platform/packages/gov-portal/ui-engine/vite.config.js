// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
    outDir: "dist",
    emptyOutDir: true,
  },
});
