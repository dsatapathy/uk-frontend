// scripts/trace-resolver.js
// Logs who tries to import @gov/ui-engine (or any pkgName) and what it resolves to
export default function traceResolver(pkgName = "@gov/ui-engine") {
  return {
    name: "trace-resolver",
    enforce: "pre",
    async resolveId(source, importer, options) {
      if (source === pkgName || (source && source.startsWith(pkgName))) {
        console.log(`[trace-resolver] resolveId: source="${source}" importer="${importer}"`);
      }
      const r = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (r && r.id && (source === pkgName || source.startsWith(pkgName))) {
        console.log(`[trace-resolver]  -> resolved to: ${r.id}`);
      }
      return r;
    },
    load(id) {
      if (id.includes(pkgName)) {
        console.log(`[trace-resolver] load: ${id}`);
      }
      return null;
    },
  };
}
