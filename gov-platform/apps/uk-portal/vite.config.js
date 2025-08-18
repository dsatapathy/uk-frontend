import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const coreSrc  = path.resolve(repoRoot, "packages/gov-portal/core/src").replace(/\\/g, "/");
const bpaSrc   = path.resolve(repoRoot, "packages/gov-portal/modules/bpa/src").replace(/\\/g, "/");
const tlSrc    = path.resolve(repoRoot, "packages/gov-portal/modules/tl/src").replace(/\\/g, "/");

export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  return {
    plugins: [react()],
    resolve: {
      alias: isServe
        ? {
            "@gov/core": coreSrc,
            "@gov/mod-bpa": bpaSrc,
            "@gov/mod-tl": tlSrc
          }
        : {}
    },
    optimizeDeps: {
      // keep these from being pre-bundled (they're source)
      exclude: isServe ? ["@gov/core", "@gov/mod-bpa", "@gov/mod-tl"] : []
    },
    server: { fs: { allow: [repoRoot] } },
    build: { outDir: "dist", emptyOutDir: true }
  };
});
