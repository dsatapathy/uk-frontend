// scripts/trace-ui-engine-resolve.cjs
function header(msg) {
    console.log("\n" + "=".repeat(80) + "\n" + msg + "\n" + "=".repeat(80));
  }
  
  try {
    header("CommonJS require.resolve()");
    const p = require.resolve("@gov/mod-auth");
    console.log("require.resolve ->", p);
  } catch (e) {
    console.error("require.resolve failed:", e && e.message);
  }
  
  (async () => {
    header("ESM dynamic import()");
    try {
      // eslint-disable-next-line no-eval
      const mod = await eval("import('@gov/mod-auth')");
      console.log("import() ok. Named exports:", Object.keys(mod || {}));
    } catch (e) {
      console.error("import() failed:", e && e.message);
    }
  })();
  