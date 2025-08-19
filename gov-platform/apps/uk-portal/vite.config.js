import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const repoRoot   = path.resolve(__dirname, "..", "..");

// Normalize Windows backslashes to forward slashes for Vite/esbuild
const toFs = (p) => p.replace(/\\/g, "/");

const coreSrc = toFs(path.resolve(repoRoot, "packages/gov-portal/core/src"));
const bpaSrc  = toFs(path.resolve(repoRoot, "packages/gov-portal/modules/bpa/src"));
const tlSrc   = toFs(path.resolve(repoRoot, "packages/gov-portal/modules/tl/src"));
const wnsSrc  = toFs(path.resolve(repoRoot, "packages/gov-portal/modules/wns/src"));
const engineSrc = toFs(path.resolve(repoRoot, "packages/gov-portal/ui-engine/src"));
export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },    
    resolve: {
      alias: isServe
        ? {
            "@gov/core": coreSrc,
            "@gov/mod-bpa": bpaSrc,
            "@gov/mod-tl": tlSrc,
            "@gov/mod-wns": wnsSrc,
            "@gov/ui-engine": engineSrc,
          }
        : {}
    },
    optimizeDeps: {
      exclude: isServe ? ["@gov/ui-engine" ,"@gov/core", "@gov/mod-bpa", "@gov/mod-tl", "@gov/mod-wns"] : []
    },
    server: { fs: { allow: [repoRoot] } },
    build: { outDir: "dist", emptyOutDir: true }
  };
});
