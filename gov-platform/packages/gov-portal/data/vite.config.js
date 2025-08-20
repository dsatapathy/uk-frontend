import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.js"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs")
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "axios",
        "@tanstack/react-query",
        "@tanstack/react-query-devtools"
      ]
    },
    sourcemap: true,
    target: "es2019",
    minify: false
  }
});
