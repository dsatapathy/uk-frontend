import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import s from "@gov/styles/library/form/InlineCondition.module.scss";

/**
 * InlineCondition — Conditionally show/enable/require wrapper.
 *
 * Props:
 * - when: boolean | fn(ctx)=>bool |
 *         string (expr; enabled only if config.allowStringExpr) |
 *         { all?: Cond[]; any?: Cond[]; none?: Cond[] } |
 *         Cond or Cond[]
 *   where Cond = [path, op, value] and:
 *     path: "values.foo.bar" | "user.role" | "flags.beta"
 *     op: "==","!=","<",">","<=",">=","in","includes","truthy","falsy"
 *
 * - then: Effects
 * - else: Effects
 * - deps: string[]               // form paths to watch (e.g., ["foo","bar.city"])
 * - context: { user?, flags?, env? } // extra data available to predicates
 * - config: {
 *     keepMountedWhenHidden: true,
 *     collapseHidden: true, // display: none vs visibility: hidden when hidden
 *     reduceOpacityWhenDisabled: 0.6,
 *     passProps: ["disabled","required","readOnly","hidden"], // injected into children
 *     allowStringExpr: false, // allow when as string expression
 *   }
 *
 * - children: node | (renderFn: ({ active, effects }) => node)
 *
 * Effects shape:
 *   { show?: boolean, disable?: boolean, require?: boolean, readOnly?: boolean,
 *     className?, style?, preserveSpace?: boolean }
 *
 * NOTE: We do shallow-inject props into direct children. Your field atoms
 * should respect `disabled`, `required`, and (optionally) `hidden`.
 */

const DEFAULT_CFG = {
  keepMountedWhenHidden: true,
  collapseHidden: true,
  reduceOpacityWhenDisabled: 0.6,
  passProps: ["disabled", "required", "readOnly", "hidden"],
  allowStringExpr: false,
};

const B = (v) => !!v;

function get(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
}

function evalCond([path, op, value], ctx) {
  const lhs = get(ctx, path);
  switch (op) {
    case "==": return lhs == value;        // eslint-disable-line eqeqeq
    case "!=": return lhs != value;        // eslint-disable-line eqeqeq
    case ">": return Number(lhs) > Number(value);
    case "<": return Number(lhs) < Number(value);
    case ">=": return Number(lhs) >= Number(value);
    case "<=": return Number(lhs) <= Number(value);
    case "in": return Array.isArray(value) && value.includes(lhs);
    case "includes": return Array.isArray(lhs) && lhs.includes(value);
    case "truthy": return B(lhs);
    case "falsy": return !B(lhs);
    default: return false;
  }
}

function evalPredicate(when, ctx, allowStringExpr) {
  if (typeof when === "boolean") return when;
  if (typeof when === "function") return !!when(ctx);

  // triplet or array of triplets
  if (Array.isArray(when)) {
    if (when.length && Array.isArray(when[0])) {
      // array of conds => all must pass
      return when.every((c) => evalCond(c, ctx));
    }
    // single cond triplet
    return evalCond(when, ctx);
  }

  if (when && typeof when === "object") {
    const any = when.any ? !!when.any.some((c) => evalCond(c, ctx)) : undefined;
    const all = when.all ? when.all.every((c) => evalCond(c, ctx)) : undefined;
    const none = when.none ? !when.none.some((c) => evalCond(c, ctx)) : undefined;

    const parts = [any, all, none].filter((v) => v !== undefined);
    return parts.length ? parts.every(Boolean) : false;
  }

  if (typeof when === "string" && allowStringExpr) {
    try {
      // Limited eval with explicit scope; use cautiously in trusted apps.
      // eslint-disable-next-line no-new-func
      const fn = new Function("values", "user", "flags", "env", `return !!(${when});`);
      return !!fn(ctx.values, ctx.user, ctx.flags, ctx.env);
    } catch {
      return false;
    }
  }

  return false;
}

function mergeEffects(base, over) {
  return { ...(base || {}), ...(over || {}) };
}

export default function InlineCondition({
  when,
  then: thenFx,
  else: elseFx,
  deps = [],
  context,
  config,
  children,
  className,
  style,
}) {
  const cfg = React.useMemo(() => ({ ...DEFAULT_CFG, ...(config || {}) }), [config]);

  // form context (values for predicate)
  const methods = useFormContext?.();
  // watch only requested deps for performance; fall back to entire form if none.
  useWatch({ name: deps.length ? deps : undefined }); // re-render on deps change
  const values = methods?.getValues ? methods.getValues() : {};

  const ctx = React.useMemo(
    () => ({ values, user: context?.user, flags: context?.flags, env: context?.env }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(deps.map((d) => get(values, d))), context?.user, context?.flags, context?.env]
  );

  const active = evalPredicate(when, ctx, cfg.allowStringExpr);
  const effects = active ? mergeEffects({ show: true }, thenFx) : mergeEffects({ show: true }, elseFx);

  const hidden = effects.show === false;
  const disabled = !!effects.disable;
  const required = !!effects.require;
  const readOnly = !!effects.readOnly;
  const preserveSpace = !!effects.preserveSpace;

  const pass = cfg.passProps.reduce((acc, key) => {
    if (key === "hidden") acc.hidden = hidden;
    if (key === "disabled") acc.disabled = disabled;
    if (key === "required") acc.required = required;
    if (key === "readOnly") acc.readOnly = readOnly;
    return acc;
  }, {});

  const rootCls = [
    s.root,
    hidden ? (cfg.collapseHidden && !preserveSpace ? s.hiddenCollapse : s.hiddenReserve) : "",
    disabled ? s.isDisabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle = {
    ...(style || {}),
    ...(effects.style || {}),
    ...(disabled ? { opacity: cfg.reduceOpacityWhenDisabled } : {}),
  };

  // children can be a render function
  const renderKids =
    typeof children === "function"
      ? children({ active, effects: { hidden, disabled, required, readOnly } })
      : children;

  // shallow-inject props to direct children
  const injected = React.Children.map(renderKids, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      ...pass,
      className: [child.props.className, effects.className].filter(Boolean).join(" ") || undefined,
    });
  });

  // If not keeping mounted and hidden, render nothing
  if (hidden && !cfg.keepMountedWhenHidden && !preserveSpace) return null;

  return (
    <div
      className={rootCls}
      style={rootStyle}
      aria-hidden={hidden || undefined}
      aria-disabled={disabled || undefined}
    >
      {injected}
    </div>
  );
}
