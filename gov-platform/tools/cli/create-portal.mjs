#!/usr/bin/env node
// Quick scaffold for tenant portals based on apps/uk-portal.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const templatePortal = path.join(repoRoot, "apps", "uk-portal");

function usage() {
  console.log(`Usage: yarn create:portal <slug> [options]

Examples:
  yarn create:portal goa --title "Goa Portal" --tenant goa --base-url "https://api.example.com/v1/" --modules landing,auth,bpa

Options:
  --slug <value>             Portal identifier (defaults to positional arg)
  --title <value>            Display name shown in UI (default: "<Slug> Portal")
  --tenant <value>           Tenant code stored in config (default: slug)
  --base-url <value>         API base URL for HTTP client (default: http://localhost:9000/api/)
  --primary <hex>            Primary brand colour (default: #16a34a)
  --secondary <hex>          Secondary brand colour (default: #15803d)
  --secondary-contrast <hex> Text colour over secondary (default: #ffffff)
  --redirect <path>          Default landing redirect (default: /bpa)
  --logo <path>              App logo path (default: /assets/uk-logo.svg)
  --favicon <path>           Favicon path (default: /assets/uk-fav.ico)
  --locale <value>           Locale string (default: en-IN)
  --version <value>          App version string (default: 1.0.0)
  --modules <list>           Comma separated list for VITE_ENABLED_MODULES
  --help                     Show this help message`);
}

function parseArgs(argv) {
  const flags = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) {
      flags._.push(current);
      continue;
    }
    const cleaned = current.replace(/^--/, "");
    if (cleaned === "") continue;
    if (cleaned.includes("=")) {
      const [k, v = ""] = cleaned.split("=");
      flags[k] = v;
      continue;
    }
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      flags[cleaned] = true;
    } else {
      flags[cleaned] = next;
      i += 1;
    }
  }
  return flags;
}

function toTitle(str) {
  return str
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.replace(/\r\n/g, "\n"), "utf8");
}

function updateJSON(filePath, mutator) {
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const next = mutator(json) || json;
  writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`);
}

function replaceOrThrow(source, regex, replacement, label) {
  if (!regex.test(source)) {
    throw new Error(`create-portal: unable to update ${label}`);
  }
  return source.replace(regex, replacement);
}

if (!fs.existsSync(templatePortal)) {
  console.error("Template portal (apps/uk-portal) not found. Cannot continue.");
  process.exit(1);
}

const argv = process.argv.slice(2);
const flags = parseArgs(argv);

if (flags.help || argv.length === 0) {
  usage();
  process.exit(flags.help ? 0 : 1);
}

const slugInput = flags.slug || flags._[0];
if (!slugInput) {
  console.error("Missing portal slug.");
  usage();
  process.exit(1);
}

const normalisedSlug = slugInput.endsWith("-portal") ? slugInput : `${slugInput}-portal`;
if (!/^[a-z0-9-]+$/.test(normalisedSlug)) {
  console.error(`Invalid slug "${normalisedSlug}". Use lowercase letters, numbers, and hyphens only.`);
  process.exit(1);
}

const tenantKey = (flags.tenant || normalisedSlug.replace(/-portal$/, "")).toLowerCase();
const title = flags.title || `${toTitle(tenantKey)} Portal`;
const baseURL = flags["base-url"] || flags.baseUrl || "http://localhost:9000/api/";
const primary = flags.primary || "#16a34a";
const secondary = flags.secondary || "#15803d";
const secondaryContrast = flags["secondary-contrast"] || flags.secondaryContrast || "#ffffff";
const redirect = flags.redirect || "/bpa";
const logoPath = flags.logo || "/assets/uk-logo.svg";
const faviconPath = flags.favicon || "/assets/uk-fav.ico";
const locale = flags.locale || "en-IN";
const version = flags.version || "1.0.0";

const modulesList = typeof flags.modules === "string"
  ? flags.modules
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

const targetDir = path.join(repoRoot, "apps", normalisedSlug);
if (fs.existsSync(targetDir)) {
  console.error(`Target directory already exists: ${path.relative(repoRoot, targetDir)}`);
  process.exit(1);
}

fs.cpSync(templatePortal, targetDir, {
  recursive: true,
  filter: (src) => {
    const base = path.basename(src);
    if (base === "dist") return false;
    return true;
  },
});

const pkgPath = path.join(targetDir, "package.json");
updateJSON(pkgPath, (json) => {
  json.name = normalisedSlug;
  json.version = version;
  return json;
});

const mainPath = path.join(targetDir, "src", "main.jsx");
let mainContents = fs.readFileSync(mainPath, "utf8");

mainContents = replaceOrThrow(
  mainContents,
  /brand: { logo: landingLogo, title: "[^"]+" },/,
  `brand: { logo: landingLogo, title: "${title}" },`,
  "brand title"
);
mainContents = replaceOrThrow(
  mainContents,
  /    name: "[^"]+",/,
  `    name: "${title}",`,
  "app name"
);
mainContents = replaceOrThrow(
  mainContents,
  /    logo: "[^"]+",/,
  `    logo: "${logoPath}",`,
  "app logo"
);
mainContents = replaceOrThrow(
  mainContents,
  /    favicon: "[^"]+",/,
  `    favicon: "${faviconPath}",`,
  "app favicon"
);
mainContents = replaceOrThrow(
  mainContents,
  /    version: "[^"]+",/,
  `    version: "${version}",`,
  "app version"
);
mainContents = replaceOrThrow(
  mainContents,
  /    tenant: "[^"]+".*/,
  `    tenant: "${tenantKey}",`,
  "tenant"
);
mainContents = replaceOrThrow(
  mainContents,
  /    locale: "[^"]+"/,
  `    locale: "${locale}"`,
  "locale"
);
mainContents = replaceOrThrow(
  mainContents,
  /  http: { baseURL: "[^"]+" },/,
  `  http: { baseURL: "${baseURL}" },`,
  "http baseURL"
);
mainContents = replaceOrThrow(
  mainContents,
  /      primary: { main: "#[^"]+" },/,
  `      primary: { main: "${primary}" },`,
  "primary colour"
);
mainContents = replaceOrThrow(
  mainContents,
  /      secondary: { main: "#[^"]+", contrastText: "#[^"]+" },/,
  `      secondary: { main: "${secondary}", contrastText: "${secondaryContrast}" },`,
  "secondary colour"
);
mainContents = replaceOrThrow(
  mainContents,
  /  redirects: \[\{ from: "\/", to: "[^"]+" }]/,
  `  redirects: [{ from: "/", to: "${redirect}" }]`,
  "redirect"
);

writeFile(mainPath, mainContents);

const loginConfigPath = path.join(targetDir, "src", "config", "auth", "login.config.js");
if (fs.existsSync(loginConfigPath)) {
  let loginConfig = fs.readFileSync(loginConfigPath, "utf8");
  loginConfig = replaceOrThrow(
    loginConfig,
    /title: "[^"]+",/,
    `title: "${title}",`,
    "login brand title"
  );
  writeFile(loginConfigPath, loginConfig);
}

const registerConfigPath = path.join(targetDir, "src", "config", "auth", "register.config.js");
if (fs.existsSync(registerConfigPath)) {
  let registerConfig = fs.readFileSync(registerConfigPath, "utf8");
  registerConfig = replaceOrThrow(
    registerConfig,
    /title: "[^"]+",/,
    `title: "${title}",`,
    "register brand title"
  );
  writeFile(registerConfigPath, registerConfig);
}

const indexHtmlPath = path.join(targetDir, "index.html");
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  indexHtml = replaceOrThrow(
    indexHtml,
    /<meta name="theme-color" content="[^"]+" \/>/,
    `<meta name="theme-color" content="${primary}" />`,
    "theme-color meta"
  );
  writeFile(indexHtmlPath, indexHtml);
}

if (modulesList && modulesList.length > 0) {
  const envLine = `VITE_ENABLED_MODULES=${modulesList.join(",")}\n`;
  writeFile(path.join(targetDir, ".env.development"), envLine);
  writeFile(path.join(targetDir, ".env.production"), envLine);
}

const guidePath = path.join(targetDir, "portal-setup-guide.md");
if (fs.existsSync(guidePath)) {
  let guide = fs.readFileSync(guidePath, "utf8");
  guide = guide.replace(/UK Portal/g, title);
  writeFile(guidePath, guide);
}

const summary = [
  `Created ${normalisedSlug} at ${path.relative(repoRoot, targetDir)}`,
  `  title: ${title}`,
  `  tenant: ${tenantKey}`,
  `  baseURL: ${baseURL}`,
  `  primary/secondary: ${primary} / ${secondary}`,
];

if (modulesList && modulesList.length > 0) {
  summary.push(`  modules: ${modulesList.join(", ")}`);
}

console.log(summary.join("\n"));
console.log("\nNext steps:");
console.log(`  • Update public assets (logo: ${logoPath}, favicon: ${faviconPath}) if needed.`);
console.log(`  • Run "yarn install" (if new dependencies) and "yarn dev --cwd apps/${normalisedSlug}" to verify.`);
console.log("  • Adjust .env values or moduleRegistry map if you enable new modules.");
