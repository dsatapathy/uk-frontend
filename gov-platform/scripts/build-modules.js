const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// Load .env from repo root
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const modulesDir = path.resolve(__dirname, '..', 'packages', 'gov-portal', 'modules');

function getModules() {
    const env = process.env.MODULES;
    console.log('env MODULES:', env)
    if (env) {
      return env
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
    }
  
    return fs
      .readdirSync(modulesDir)
      .filter((d) => {
        const fullPath = path.join(modulesDir, d);
        return (
          fs.statSync(fullPath).isDirectory() &&
          d !== 'node_modules' &&   // 👈 skip node_modules
          !d.startsWith('.')        // 👈 skip hidden folders like .cache
        );
      });
  }
  

function buildModule(mod) {
  console.log(`\nBuilding module: ${mod}`);
  execSync(`yarn build:${mod}`, { stdio: 'inherit' });
}

function main() {
  const mods = getModules();
  console.log('env MODULES:', mods)
  if (!mods.length) {
    console.log('No modules to build.');
    return;
  }
  mods.forEach(buildModule);
}

main();
