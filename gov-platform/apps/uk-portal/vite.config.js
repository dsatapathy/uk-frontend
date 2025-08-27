import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const toFs = (p) => p.replace(/\\/g, "/");

// dev-only source aliases
const src = {
  "@gov/core":        toFs(path.resolve(repoRoot, "packages/gov-portal/core/src")),
  "@gov/data":        toFs(path.resolve(repoRoot, "packages/gov-portal/data/index.js")),
  "@gov/mod-bpa":     toFs(path.resolve(repoRoot, "packages/gov-portal/modules/bpa/src")),
  "@gov/mod-tl":      toFs(path.resolve(repoRoot, "packages/gov-portal/modules/tl/src")),
  "@gov/mod-wns":     toFs(path.resolve(repoRoot, "packages/gov-portal/modules/wns/src")),
  "@gov/mod-auth":    toFs(path.resolve(repoRoot, "packages/gov-portal/modules/auth/src")),
  "@gov/mod-landing": toFs(path.resolve(repoRoot, "packages/gov-portal/modules/landing/src")),
  "@gov/ui-engine":   toFs(path.resolve(repoRoot, "packages/gov-portal/ui-engine/src")),
};

export default defineConfig(({ command, mode }) => {
  const isServe = command === "serve";
  const env = loadEnv(mode, process.cwd(), "VITE_"); // read VITE_ENABLED_MODULES at build time
  const enabled = (env.VITE_ENABLED_MODULES || "").split(",").map(s => s.trim()).filter(Boolean);

  // build a quick predicate: only treat *enabled* modules as "gov" chunk
  const isEnabledGovModule = (id) =>
    enabled.length > 0 &&
    id.includes("/packages/gov-portal/modules/") &&
    enabled.some(mk => id.includes(`/modules/${mk}/`));

  // dev: pick which packages to read from source (HMR)
  const devAliases = isServe ? src : {};

  return {
    base: "/uk-portal/",
    plugins: [react()],
    resolve: { alias: devAliases },
    optimizeDeps: { exclude: isServe ? Object.keys(devAliases) : [] },
    server: { fs: { allow: [repoRoot] }, port: 5173 },
    css: { preprocessorOptions: { scss: {} } },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (/react|react-dom/.test(id)) return "react";
              if (/react-router|history/.test(id)) return "router";
              if (/@mui\/(material|icons-material|system)/.test(id)) return "mui";
              if (/dayjs/.test(id)) return "day";
            }
            // put only the *enabled* modules' source into a "gov" chunk
            if (isEnabledGovModule(id)) return "gov";
          }
        }
      },
      chunkSizeWarningLimit: 900
    }
  };
});
