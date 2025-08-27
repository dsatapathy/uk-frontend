/* scripts/dev-modules.js */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  // load .env from repo root if present
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch {}

/** Always-on defaults */
const DEFAULT_KEYS = ['core', 'ui-engine', 'data', 'auth', 'app'];

/** Root workspace dev commands (non-module workspaces) */
const ROOT_DEVS = {
  core: 'yarn dev:core',
  'ui-engine': 'yarn dev:ui-engine',
  data: 'yarn dev:data',
  auth: 'yarn dev:auth',
  app: 'yarn dev:app', // workspace uk-portal
};

const MODULE_PREFIX = '@gov/mod-'; // modules live as @gov/mod-<key>
const modulesDir = path.resolve(__dirname, '..', 'packages', 'gov-portal', 'modules');

function listModuleDirs() {
  if (!fs.existsSync(modulesDir)) return [];
  return fs.readdirSync(modulesDir).filter((d) => {
    const p = path.join(modulesDir, d);
    return fs.statSync(p).isDirectory() && d !== 'node_modules' && !d.startsWith('.');
  });
}

/**
 * Parse MODULES env:
 * - unset/empty => defaults only
 * - "bpa,tl"    => defaults + bpa, tl
 * - "only:bpa"  => only bpa (no defaults)
 */
function resolveKeys() {
  const envVal = (process.env.MODULES || '').trim();
  if (!envVal) return [...DEFAULT_KEYS];

  if (envVal.startsWith('only:')) {
    const only = envVal.slice('only:'.length).split(',').map((s) => s.trim()).filter(Boolean);
    return Array.from(new Set(only));
  }

  const extras = envVal.split(',').map((s) => s.trim()).filter(Boolean);
  return Array.from(new Set([...DEFAULT_KEYS, ...extras]));
}

function toDevCommand(key, availableMods) {
  if (ROOT_DEVS[key]) return ROOT_DEVS[key];

  if (!availableMods.has(key)) {
    console.warn(`⚠️  Skipping "${key}" — not a known root and not found under modules/`);
    return null;
  }
  return `yarn workspace ${MODULE_PREFIX}${key} dev`;
}

function main() {
  const availableMods = new Set(listModuleDirs()); // e.g., bpa, tl, wns, landing
  const keys = resolveKeys();

  const commands = keys
    .map((k) => toDevCommand(k, availableMods))
    .filter(Boolean);

  if (!commands.length) {
    console.log('Nothing to run. Check MODULES/env and module names.');
    return;
  }

  const names = keys.join(',');
  const cmd = `npx concurrently -k -n ${names} -c auto ${commands.map((c) => JSON.stringify(c)).join(' ')}`;
  console.log('▶️  Starting:', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

main();
