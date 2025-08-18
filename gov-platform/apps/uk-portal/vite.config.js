import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..", "..");
const modulesSrcNative = path.resolve(repoRoot, "packages/gov-portal/modules/src");
// Windows: force forward slashes so esbuild doesn’t get confused
const modulesSrc = modulesSrcNative.replace(/\\/g, "/");

export default defineConfig(({ command }) => {
  const isServe = command === "serve"; // dev
  return {
    plugins: [react({ fastRefresh: false })],
    resolve: {
      alias: isServe ? { "@gov/modules": modulesSrc } : {}
    },
    optimizeDeps: {
      exclude: isServe ? ["@gov/modules"] : []
    },
    server: {
      port: 5173,
      fs: { allow: [repoRoot] }
    },
    build: {
      outDir: "dist",
      emptyOutDir: true
    }
  };
});
