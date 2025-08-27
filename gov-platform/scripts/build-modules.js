/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const rootPkg = require(path.join(ROOT, "package.json"));

function getWorkspacePackageJsonPaths() {
  const globs = (rootPkg.workspaces && rootPkg.workspaces.packages) || rootPkg.workspaces || [];
  const glob = require("glob"); // yarn add -D glob if needed

  const pkgJsons = new Set();
  globs.forEach((g) => {
    glob.sync(path.join(ROOT, g, "package.json")).forEach((p) => pkgJsons.add(p));
  });
  return Array.from(pkgJsons);
}

function readPkg(p) {
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  const dir = path.dirname(p);
  return { dir, json };
}

function topoSort(pkgs) {
  const nameToPkg = new Map(pkgs.map((p) => [p.json.name, p]));
  const indeg = new Map();
  const adj = new Map();

  pkgs.forEach((p) => {
    indeg.set(p.json.name, 0);
    adj.set(p.json.name, []);
  });

  pkgs.forEach((p) => {
    const deps = Object.assign({}, p.json.dependencies, p.json.peerDependencies);
    Object.keys(deps || {}).forEach((d) => {
      if (nameToPkg.has(d)) {
        adj.get(d).push(p.json.name);
        indeg.set(p.json.name, (indeg.get(p.json.name) || 0) + 1);
      }
    });
  });

  const q = [];
  indeg.forEach((v, k) => { if (v === 0) q.push(k); });
  const order = [];

  while (q.length) {
    const u = q.shift();
    order.push(u);
    adj.get(u).forEach((v) => {
      indeg.set(v, indeg.get(v) - 1);
      if (indeg.get(v) === 0) q.push(v);
    });
  }

  if (order.length !== pkgs.length) {
    console.warn("Warning: dependency cycle detected; falling back to listed order.");
    return pkgs.map((p) => p.json.name);
  }
  return order;
}

function run(cmd, cwd) {
  console.log(`\n> ${cmd} (cwd=${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

(function main() {
  const pkgPaths = getWorkspacePackageJsonPaths();
  const pkgs = pkgPaths.map(readPkg);

  const orderNames = topoSort(pkgs);
  const order = orderNames.map((name) => pkgs.find((p) => p.json.name === name));

  order.forEach((p) => {
    const hasBuild = p.json.scripts && p.json.scripts.build;
    if (hasBuild) {
      run("yarn build", p.dir);
    } else {
      console.log(`(skip) ${p.json.name} – no "build" script`);
    }
  });

  console.log("\nAll packages built in dependency order ✅");
})();
