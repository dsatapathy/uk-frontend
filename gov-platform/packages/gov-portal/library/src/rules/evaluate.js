export function evaluateExpression(expr, ctx) {
  try {
    // Extremely tiny and controlled; for MVP only.
    // eslint-disable-next-line no-new-func
    const fn = new Function('values', 'user', 'tenant', 'flags', `return (${expr});`);
    return !!fn(ctx.values, ctx.user, ctx.tenant, ctx.flags);
  } catch (e) { return false; }
}

export function applyRulesForField(field, ctx) {
  const res = { hidden: false, disabled: false, required: false, derived: undefined };
  (field.rules || []).forEach((r) => {
    const pass = r.when ? evaluateExpression(r.when, ctx) : true;
    if (!pass) return;
    if (r.action === 'show') res.hidden = false;
    if (r.action === 'hide') res.hidden = true;
    if (r.action === 'enable') res.disabled = false;
    if (r.action === 'disable') res.disabled = true;
    if (r.action === 'require') res.required = true;
    if (r.action === 'unrequire') res.required = false;
    if (r.action === 'derive' && r.value) {
      try {
        // eslint-disable-next-line no-new-func
        const f = new Function('values', 'user', 'tenant', 'flags', `return (${r.value});`);
        res.derived = f(ctx.values, ctx.user, ctx.tenant, ctx.flags);
      } catch (_) {}
    }
  });
  return res;
}

// rules/RuleEngine.js
// Lightweight, safe-ish DSL evaluator for form rules.
//
// DSL examples:
//   "when values.state filled -> require"
//   "when values.state == 'KA' AND values.city empty -> disable"
//   "when values.builtUpArea > 0 AND values.plotArea > 0 -> derive(values.builtUpArea / values.plotArea)"
//   "when values.city in ['BLR','MUM'] -> hide"
//   "when values.email matches /@gov\\.in$/ -> require"
//
// Effects aggregate: { hidden, disabled, required, derived }

const OPS = {
  "==": (a, b) => a == b,          // eslint-disable-line eqeqeq
  "!=": (a, b) => a != b,          // eslint-disable-line eqeqeq
  ">":  (a, b) => num(a) >  num(b),
  ">=": (a, b) => num(a) >= num(b),
  "<":  (a, b) => num(a) <  num(b),
  "<=": (a, b) => num(a) <= num(b),
  "in":      (a, arr) => Array.isArray(arr) && arr.some((v)=>eq(a,v)),
  "not-in":  (a, arr) => Array.isArray(arr) && !arr.some((v)=>eq(a,v)),
  "includes":(a, b) => (Array.isArray(a) ? a.includes(b) : String(a ?? "").includes(String(b))),
  "empty":   (a) => a === null || a === undefined || a === "" || (Array.isArray(a) && a.length === 0),
  "filled":  (a) => !(a === null || a === undefined || a === "" || (Array.isArray(a) && a.length === 0)),
  "matches": (a, re) => {
    const s = String(a ?? "");
    const r = (re instanceof RegExp) ? re : null;
    return r ? r.test(s) : false;
  },
};

function eq(a,b){ return a === b || String(a) === String(b); }
function num(x){ const n = Number(x); return Number.isFinite(n) ? n : NaN; }

function getPath(obj, path) {
  return String(path || "").split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function resolveSelector(selector, ctx) {
  // selector: values.foo.bar | user.role | flags.featureX
  if (!selector) return undefined;
  if (selector.startsWith("values.")) return getPath(ctx.values, selector.slice(7));
  if (selector.startsWith("user."))   return getPath(ctx.user, selector.slice(5));
  if (selector.startsWith("flags."))  return getPath(ctx.flags, selector.slice(6));
  // raw literal path? treat as values.<selector>
  return getPath(ctx.values, selector);
}

function parseLiteral(str) {
  if (str == null) return undefined;
  const s = str.trim();

  // array literal: [1, "x", true]
  if (s.startsWith("[")) {
    try {
      // allow single quotes in array literal
      const jsonish = s
        .replace(/'/g, '"')
        .replace(/,(\s*])/g, "$1"); // trailing comma guard
      return JSON.parse(jsonish);
    } catch { return undefined; }
  }

  // regex: /pattern/flags
  if (s.startsWith("/") && s.lastIndexOf("/") > 0) {
    const last = s.lastIndexOf("/");
    const body = s.slice(1, last);
    const flags = s.slice(last + 1);
    try { return new RegExp(body, flags); } catch { return undefined; }
  }

  // quoted string
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }

  // booleans/null/number
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null") return null;
  if (!Number.isNaN(Number(s))) return Number(s);

  // reference value (e.g., values.otherField)
  if (/^(values|user|flags)\.[A-Za-z0-9_.]+$/.test(s)) {
    return { __ref: s };
  }

  return s; // fallback as plain string
}

function resolveMaybeRef(val, ctx) {
  if (val && typeof val === "object" && val.__ref) {
    return resolveSelector(val.__ref, ctx);
  }
  if (Array.isArray(val)) return val.map((v) => resolveMaybeRef(v, ctx));
  return val;
}

/** Split left side conditions on AND/OR (no parentheses support; keep simple) */
function splitConditions(s) {
  const parts = [];
  let buf = "";
  let inStr = false, strCh = "", inRegex = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i], next = s.slice(i, i + 4).toUpperCase();
    // string guard
    if (!inRegex && (ch === "'" || ch === '"')) {
      if (!inStr) { inStr = true; strCh = ch; }
      else if (strCh === ch) { inStr = false; strCh = ""; }
      buf += ch; continue;
    }
    // regex guard
    if (!inStr && ch === "/") {
      // naive: toggle regex state
      inRegex = !inRegex;
      buf += ch; continue;
    }
    if (!inStr && !inRegex) {
      if (s.slice(i, i + 5).toUpperCase() === " AND ") {
        parts.push({ type: "cond", value: buf.trim() });
        parts.push({ type: "op", value: "AND" });
        buf = ""; i += 4; continue;
      }
      if (s.slice(i, i + 4).toUpperCase() === " OR ") {
        parts.push({ type: "cond", value: buf.trim() });
        parts.push({ type: "op", value: "OR" });
        buf = ""; i += 3; continue;
      }
    }
    buf += ch;
  }
  if (buf.trim()) parts.push({ type: "cond", value: buf.trim() });
  return parts;
}

function parseComparison(raw) {
  // supports: selector <op> value?  (value optional for empty/filled)
  // ops tokens sorted by length to avoid partial matches
  const ops = ["not-in", ">=", "<=", "==", "!=", ">", "<", "in", "includes", "empty", "filled", "matches"];
  for (const op of ops) {
    const re = new RegExp(`^(.*?)\\s+${op}(?:\\s+(.*))?$`, "i");
    const m = raw.match(re);
    if (m) {
      const selector = m[1].trim();
      const rhs = m[2] != null ? m[2].trim() : undefined;
      const lit = rhs != null ? parseLiteral(rhs) : undefined;
      return { selector, op: op.toLowerCase(), rhs: lit };
    }
  }
  // fallback: treat as truthy check `filled`
  return { selector: raw.trim(), op: "filled", rhs: undefined };
}

function evalConditions(condStr, ctx) {
  const parts = splitConditions(condStr);
  // evaluate left-to-right with AND/OR (no precedence; simple and predictable)
  let acc = null, lastOp = null;
  for (const p of parts) {
    if (p.type === "op") { lastOp = p.value; continue; }
    const { selector, op, rhs } = parseComparison(p.value);
    const leftVal = resolveSelector(selector, ctx);
    const rightVal = resolveMaybeRef(rhs, ctx);
    const fn = OPS[op];
    const ok = fn ? fn(leftVal, rightVal) : false;

    if (acc === null) acc = ok;
    else acc = (lastOp === "AND") ? (acc && ok) : (acc || ok);
  }
  return !!(acc ?? false);
}

function parseEffect(effectStr) {
  const s = effectStr.trim();
  // derive(expr)
  const m = s.match(/^derive\s*\((.*)\)\s*$/i);
  if (m) return { type: "derive", arg: m[1].trim() };
  // single-word effects
  const t = s.toLowerCase();
  if (t === "hide" || t === "disable" || t === "require") return { type: t };
  return { type: "noop" };
}

/** Very small arithmetic expression evaluator for derive()
 *  - allows: numbers, + - * / ( )
 *  - identifiers as values.<path> or user.<path>
 *  - replaces unknowns with 0
 */
function evalDeriveExpression(expr, ctx) {
  if (!expr || typeof expr !== "string") return undefined;

  // Find identifiers
  const idRe = /[A-Za-z_][A-Za-z0-9_.]*/g;
  const ids = Array.from(new Set(expr.match(idRe) || []));
  let safe = expr;

  for (const id of ids) {
    if (/^(values|user)\.[A-Za-z0-9_.]+$/.test(id)) {
      const v = resolveSelector(id, ctx);
      const n = Number(v);
      safe = safe.replaceAll(id, String(Number.isFinite(n) ? n : 0));
    } else if (!/^(min|max|abs|round|ceil|floor)$/.test(id)) {
      // disallow other identifiers by replacing with 0
      safe = safe.replaceAll(id, "0");
    }
  }

  // allow only digits, ops, dots, spaces, and parentheses
  if (!/^[0-9+\-*/().\s]+$/.test(safe)) return undefined;

  try {
    // eslint-disable-next-line no-new-func
    const f = new Function(`return (${safe});`);
    const out = f();
    return Number.isFinite(out) ? out : undefined;
  } catch {
    return undefined;
  }
}

/** Parse a DSL string: "when ... -> effect(...)" */
export function parseDslRule(ruleStr) {
  const m = ruleStr.match(/^when\s+(.+?)\s*->\s*(.+)$/i);
  if (!m) return null;
  return { when: m[1].trim(), effect: parseEffect(m[2]) };
}

/** Evaluate a single rule (object or DSL string) */
export function evaluateRule(rule, ctx) {
  // allow JSON-ish rule: { when: "...", action: "disable" } or {when:"...", effect:"derive(...)"}
  if (typeof rule === "string") {
    const r = parseDslRule(rule);
    if (!r) return null;
    if (!evalConditions(r.when, ctx)) return null;
    return effectToPatch(r.effect, ctx);
  }

  // object form
  if (rule && typeof rule === "object") {
    const cond = typeof rule.when === "string" ? rule.when : "";
    if (!cond || !evalConditions(cond, ctx)) return null;

    if (rule.action) {
      const eff = String(rule.action).toLowerCase();
      if (eff === "hide" || eff === "disable" || eff === "require") {
        return effectToPatch({ type: eff }, ctx);
      }
      if (eff === "derive") {
        return effectToPatch({ type: "derive", arg: rule.value }, ctx);
      }
    }
    if (rule.effect) {
      return effectToPatch(parseEffect(String(rule.effect)), ctx);
    }
  }

  return null;
}

function effectToPatch(effect, ctx) {
  switch (effect.type) {
    case "hide":    return { hidden: true };
    case "disable": return { disabled: true };
    case "require": return { required: true };
    case "derive": {
      const val = evalDeriveExpression(effect.arg, ctx);
      return { derived: val };
    }
    default: return null;
  }
}

/** Evaluate a full rule set → { hidden, disabled, required, derived } */
export function evaluateRules(rules, ctx) {
  const agg = { hidden: false, disabled: false, required: false, derived: undefined };
  (rules || []).forEach((r) => {
    const patch = evaluateRule(r, ctx);
    if (!patch) return;
    if (patch.hidden)   agg.hidden = true;
    if (patch.disabled) agg.disabled = true;
    if (patch.required) agg.required = true;
    if (patch.derived !== undefined) agg.derived = patch.derived;
  });
  return agg;
}

/** Optional: compile once and reuse */
export function compileRules(rules) {
  // For simplicity we just bind the array; you could pre-parse DSL to speed up.
  const parsed = (rules || []).map((r) => (typeof r === "string" ? parseDslRule(r) || r : r));
  return (ctx) => evaluateRules(parsed, ctx);
}
