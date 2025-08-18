#!/usr/bin/env node
// Node 18+ (your repo uses Node 20 in engines)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", ".."); // /tools/cli -> repo
const modulesRoot = path.join(repoRoot, "packages", "gov-portal", "modules");

// ---------- tiny arg parser ----------
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--")) {
    const key = a.replace(/^--/, "");
    const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
    flags[key] = val;
  } else if (!flags._) {
    flags._ = [a];
  } else {
    flags._.push(a);
  }
}

const rawKey = (flags._ && flags._[0]) || flags.key || "";
if (!rawKey) {
  console.error("Usage: yarn create:module <key> [--title \"Nice Name\"] [--route /path]");
  process.exit(1);
}
const key = rawKey.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const Title = flags.title || key.toUpperCase();
const routeBase = flags.route || `/${key}`;

const pkgName = `@gov/mod-${key}`;
const modDir = path.join(modulesRoot, key);

// ---------- helpers ----------
function writeFile(fp, content) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r\n/g, "\n"), "utf8");
}
function exists(p) { return fs.existsSync(p); }

// ---------- sanity checks ----------
if (exists(modDir)) {
  console.error(`✖ Module folder already exists: ${modDir}`);
  process.exit(1);
}

// ---------- files ----------
const packageJson = `{
  "name": "${pkgName}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "@gov/core": "workspace:*",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-router-dom": "^5.3.4"
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "clean": "rimraf dist"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0",
    "rimraf": "^5.0.0"
  }
}
`;

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/index.js", formats: ["es"] },
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom", "@gov/core"],
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
`;

const srcIndex = `export { register } from "./register.jsx";
`;

const registerJsx = `import React from "react";
import { registerComponent, registerAction } from "@gov/core";

// tiny helper to keep per-widget code-splitting
const lazyWrap = (loader, name = "${Title}") => {
  const C = React.lazy(loader);
  return (props) => (
    <React.Suspense fallback={<div>Loading {name}…</div>}>
      <C {...props} />
    </React.Suspense>
  );
};

export function register(app) {
  // lazy widgets (do NOT import them at top-level)
  registerComponent("${pascal(key)}Home", lazyWrap(() => import("./widgets/${pascal(key)}Home.jsx"), "${Title}"));

  // actions
  registerAction("${key}.goto", () => app.history.push("${routeBase}"));

  // initial route
  app.addRoutes([
    { path: "${routeBase}", exact: true, layout: "Shell", page: { type: "${pascal(key)}Home" } }
  ]);
}
`;

const widgetHome = `import React from "react";
import { getAction } from "@gov/core";

export default function ${pascal(key)}Home({ title = "${Title}" }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ opacity: 0.8 }}>Welcome to the ${Title} module.</p>
      <button onClick={() => getAction("${key}.goto")?.()}>Open ${Title}</button>
    </div>
  );
}
`;

// ---------- write ----------
writeFile(path.join(modDir, "package.json"), packageJson);
writeFile(path.join(modDir, "vite.config.js"), viteConfig);
writeFile(path.join(modDir, "src", "index.js"), srcIndex);
writeFile(path.join(modDir, "src", "register.jsx"), registerJsx);
writeFile(path.join(modDir, "src", "widgets", `${pascal(key)}Home.jsx`), widgetHome);

// ---------- info ----------
console.log(`✔ Created ${pkgName} in ${path.relative(repoRoot, modDir)}

Next steps:
1) Add dependency to the app (so it installs and can be imported):
   - apps/uk-portal/package.json → "dependencies": { "${pkgName}": "workspace:*" }
   - then run:  yarn install

2) (If using the lazy module orchestrator) add a manifest entry:
   - apps/uk-portal/src/module-manifest.js
     export const manifests = [
       { key: "${key}", basePath: "${routeBase}", loader: () => import("${pkgName}") },
       // ... other modules
     ];

3) Start dev:
   - yarn dev:${key}   (or)   yarn dev:app
   - route: ${routeBase}

Pro tip: You can re-run this CLI to scaffold all 29 modules quickly.
`);

function pascal(s) {
  return s
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .map(x => x[0].toUpperCase() + x.slice(1))
    .join("");
}
