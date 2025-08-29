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