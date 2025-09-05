// apps/uk-portal/vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..", "..");
const toFs = (p) => p.replace(/\\/g, "/");

// --- DEV-ONLY aliases: read packages from source when running `vite` ---
const devOnlySrcAliases = {
  "@gov/core": toFs(path.resolve(repoRoot, "packages/gov-portal/core/src")),
  "@gov/data": toFs(path.resolve(repoRoot, "packages/gov-portal/data/index.js")),
  "@gov/mod-bpa": toFs(path.resolve(repoRoot, "packages/gov-portal/modules/bpa/src")),
  "@gov/mod-auth": toFs(path.resolve(repoRoot, "packages/gov-portal/modules/auth/src")),
  "@gov/mod-landing": toFs(path.resolve(repoRoot, "packages/gov-portal/modules/landing/src")),
  "@gov/ui-engine": toFs(path.resolve(repoRoot, "packages/gov-portal/ui-engine/src")),
  "@gov/form-engine": toFs(path.resolve(repoRoot, "packages/gov-portal/formengine/src")),
};

// Tiny React 17-safe shim for Emotion’s helper
const shimEmotion = toFs(
  path.resolve(
    repoRoot,
    "packages/gov-portal/shims/emotion-use-insertion-effect-with-fallbacks.js"
  )
);

export default defineConfig(({ command, mode }) => {
  const isServe = command === "serve";
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const enabled = (env.VITE_ENABLED_MODULES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const isEnabledGovModule = (id) =>
    enabled.length > 0 &&
    id.includes("/packages/gov-portal/modules/") &&
    enabled.some((mk) => id.includes(`/modules/${mk}/`));

  const alias = [
    ...(isServe
      ? Object.entries(devOnlySrcAliases).map(([find, replacement]) => ({
        find,
        replacement,
      }))
      : []),
    // 👉 Always map Emotion helper to our shim to avoid TDZ in React 17
    // { find: "@emotion/use-insertion-effect-with-fallbacks", replacement: shimEmotion },
  ];

  const analyze =
    process.env.ANALYZE === "1" || String(process.env.ANALYZE).toLowerCase() === "true";

  return {
    base: "/uk-portal/",
    plugins: [
      react(),
      ...(isServe ? [] : [visualizer({
        filename: "stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: "treemap"
      })]),
    ],
    resolve: {
      alias,
      // ✅ singletons
      dedupe: [
        "react",
        "react-dom",
        "@emotion/react",
        "@emotion/styled",
        "@tanstack/react-query",
        "@tanstack/react-query-devtools",
      ],
    },
    optimizeDeps: {
      exclude: isServe ? Object.keys(devOnlySrcAliases) : [],
      include: [
        "@emotion/react",
        "@emotion/styled",
        "@tanstack/react-query",
        "@tanstack/react-query-devtools",
      ],
    },
    server: { fs: { allow: [repoRoot] }, port: 5173 },
    css: { preprocessorOptions: { scss: {} } },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      // Set NO_MINIFY=1 for readable chunks during debugging
      minify: process.env.NO_MINIFY ? false : "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // keep React core separate
              if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) return "react";

              // group router
              if (/[\\/]node_modules[\\/](react-router|history)[\\/]/.test(id)) return "router";

              // **IMPORTANT**: put ALL @mui/* and @emotion/* together
              if (/[\\/]node_modules[\\/]@mui[\\/]/.test(id) || /[\\/]node_modules[\\/]@emotion[\\/]/.test(id)) {
                return "mui"; // one chunk holds mui + emotion
              }

              if (/[\\/]node_modules[\\/]dayjs[\\/]/.test(id)) return "day";
            }

            // your existing app-specific split
            if (isEnabledGovModule(id)) return "gov";
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
  };
});
