// components/form/validation/ValidationFactory.js
import { z } from "zod";

/**
 * Build a Zod schema from your JSON form schema.
 * Supports field types: text|password|email|tel|url|textarea|autocomplete (string),
 * number (coerced), checkbox (boolean), date|datepicker (Date), repeater (array of objects).
 */

const DEFAULT_OPTS = {
  trimStrings: true,
  allowEmptyWhenNotRequired: true,
  messages: {
    required: "This field is required",
    invalidEmail: "Enter a valid email",
    invalidUrl: "Enter a valid URL",
    invalidPattern: "Invalid format",
    tooShort: (n) => `Must be at least ${n} characters`,
    tooLong: (n) => `Must be at most ${n} characters`,
    minValue: (n) => `Must be ≥ ${n}`,
    maxValue: (n) => `Must be ≤ ${n}`,
    integer: "Must be an integer",
    positive: "Must be positive",
    nonnegative: "Must be ≥ 0",
    notInEnum: "Choose a valid value",
    equals: "Value does not match",
    notEquals: "Value must differ",
    requiredIf: "This field is required",
    sameAs: "Values do not match",
    minDate: (d) => `Date must be on/after ${d}`,
    maxDate: (d) => `Date must be on/before ${d}`,
  },
};

/* ---------------- helpers ---------------- */

function isEmpty(v) {
  return (
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0)
  );
}
function toNumber(v) {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
function toDate(v) {
  if (v === "" || v === null || v === undefined) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
function getAtPath(root, path) {
  return String(path || "")
    .split(".")
    .reduce((a, k) => (a == null ? a : a[k]), root);
}
function makeRegex(pat, flags) {
  try {
    return new RegExp(pat, flags);
  } catch {
    return null;
  }
}

/* ------------- base schema by field.type ------------- */
/** NOTE: repeater is NOT handled here; it is built in buildZodFromSchema */
function baseForField(field, opts) {
  const t = (field.type || "text").toLowerCase();
  const allowEmpty = !!opts.allowEmptyWhenNotRequired;

  switch (t) {
    case "number": {
      // coerce text -> number; allow undefined for empty if not required
      let s = z.preprocess((v) => toNumber(v), z.number({ invalid_type_error: "Must be a number" }));
      return allowEmpty ? s.optional() : s;
    }
    case "checkbox": {
      let s = z.boolean({ invalid_type_error: "Must be true/false" });
      return allowEmpty ? s.optional() : s;
    }
    case "date":
    case "datepicker": {
      let s = z.preprocess((v) => toDate(v), z.date({ invalid_type_error: "Invalid date" }));
      return allowEmpty ? s.optional() : s;
    }
    // strings: text/password/email/tel/url/textarea/autocomplete/…
    default: {
      let s = z
        .string()
        .transform((x) => (opts.trimStrings ? String(x ?? "").trim() : String(x ?? "")));
      // If empty & not required, normalize to "" so RHF stays happy
      return allowEmpty ? s.optional().or(z.literal("")) : s;
    }
  }
}

/* ------------- apply validators ------------- */
function applyValidatorsToFieldSchema(base, field, opts) {
  const vlist = Array.isArray(field.validations) ? field.validations : [];
  const t = (field.type || "text").toLowerCase();
  let sch = base;

  for (const v of vlist) {
    const type = String(v?.type || "").toLowerCase();
    const msg = v?.message;

    switch (type) {
      case "required": {
        if (t === "checkbox") {
          sch = sch.refine((val) => val === true, { message: msg || opts.messages.required });
        } else {
          sch = sch.refine((val) => !isEmpty(val), { message: msg || opts.messages.required });
        }
        break;
      }
      case "minlength": {
        const n = Number(v.value || 0);
        sch = sch.pipe(z.string().min(n, { message: msg || opts.messages.tooShort(n) }));
        break;
      }
      case "maxlength": {
        const n = Number(v.value || 0);
        sch = sch.pipe(z.string().max(n, { message: msg || opts.messages.tooLong(n) }));
        break;
      }
      case "pattern": {
        const re = makeRegex(v.value, v.flags);
        if (re) sch = sch.pipe(z.string().regex(re, { message: msg || opts.messages.invalidPattern }));
        break;
      }
      case "email": {
        sch = sch.pipe(z.string().email({ message: msg || opts.messages.invalidEmail }));
        break;
      }
      case "url": {
        sch = sch.pipe(z.string().url({ message: msg || opts.messages.invalidUrl }));
        break;
      }
      case "min": {
        const n = v.value;
        if (t === "date" || t === "datepicker") {
          const d = toDate(n);
          if (d)
            sch = sch.refine((val) => !val || val >= d, {
              message: msg || opts.messages.minDate(d.toLocaleDateString()),
            });
        } else {
          const num = Number(n);
          sch = sch.pipe(z.number().min(num, { message: msg || opts.messages.minValue(num) }));
        }
        break;
      }
      case "max": {
        const n = v.value;
        if (t === "date" || t === "datepicker") {
          const d = toDate(n);
          if (d)
            sch = sch.refine((val) => !val || val <= d, {
              message: msg || opts.messages.maxDate(d.toLocaleDateString()),
            });
        } else {
          const num = Number(n);
          sch = sch.pipe(z.number().max(num, { message: msg || opts.messages.maxValue(num) }));
        }
        break;
      }
      case "integer": {
        sch = sch.pipe(z.number().int({ message: msg || opts.messages.integer }));
        break;
      }
      case "positive": {
        sch = sch.pipe(z.number().positive({ message: msg || opts.messages.positive }));
        break;
      }
      case "nonnegative": {
        sch = sch.pipe(z.number().nonnegative({ message: msg || opts.messages.nonnegative }));
        break;
      }
      case "enum": {
        const vals = Array.isArray(v.values) ? v.values : [];
        sch = sch.refine((val) => isEmpty(val) || vals.includes(val), {
          message: msg || opts.messages.notInEnum,
        });
        break;
      }
      case "equals": {
        sch = sch.refine((val) => isEmpty(val) || String(val) === String(v.value), {
          message: msg || opts.messages.equals,
        });
        break;
      }
      case "notequals": {
        sch = sch.refine((val) => isEmpty(val) || String(val) !== String(v.value), {
          message: msg || opts.messages.notEquals,
        });
        break;
      }
      // "sameAs" and "requiredIf" are handled at the object level (superRefine)
      default:
        break;
    }
  }

  // collect cross-field rules for superRefine
  const cross = vlist.filter((vv) =>
    ["sameas", "requiredif"].includes(String(vv.type || "").toLowerCase())
  );

  return { schema: sch, cross };
}

/* ------------- public helpers ------------- */
export function buildFieldZod(field, options) {
  const opts = { ...DEFAULT_OPTS, ...(options || {}) };
  const base = baseForField(field, opts);
  return applyValidatorsToFieldSchema(base, field, opts);
}

/* ------------- main: build object schema ------------- */
export function buildZodFromSchema(schema, options) {
  const opts = { ...DEFAULT_OPTS, ...(options || {}) };
  const shape = {};
  const crossRules = []; // { fieldId, v }

  (schema.sections || []).forEach((sec) => {
    (sec.fields || []).forEach((f) => {
      const t = (f.type || "text").toLowerCase();

      if (t === "repeater" || t === "array") {
        // Build child object shape
        const childShape = {};
        (f.item?.fields || []).forEach((child) => {
          const { schema: childZ, cross } = buildFieldZod(child, opts);
          childShape[child.id] = childZ;
          // NOTE: cross validators inside a repeater row are not wired here.
          // You can extend this to support nested superRefine if needed.
        });

        let arrZ = z.array(z.object(childShape));
        if (Number.isFinite(f.min)) arrZ = arrZ.min(f.min, { message: opts.messages.minValue(f.min) });
        if (Number.isFinite(f.max)) arrZ = arrZ.max(f.max, { message: opts.messages.maxValue(f.max) });

        shape[f.id] = arrZ;
        return;
      }

      // normal scalar/object field
      const { schema: fieldZ, cross } = buildFieldZod(f, opts);
      shape[f.id] = fieldZ;
      cross.forEach((v) => crossRules.push({ fieldId: f.id, v, field: f }));
    });
  });

  let obj = z.object(shape);

  if (crossRules.length === 0) return obj;

  // add cross-field validations
  return obj.superRefine((data, ctx) => {
    for (const { fieldId, v } of crossRules) {
      const type = String(v?.type || "").toLowerCase();
      const msg = v?.message;

      if (type === "sameas") {
        // { type: "sameAs", other: "values.password" }
        const otherPath = String(v.other || "");
        const otherVal = otherPath.startsWith("values.")
          ? getAtPath(data, otherPath.replace(/^values\./, ""))
          : undefined;
        if (data[fieldId] !== otherVal) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [fieldId], message: msg || opts.messages.sameAs });
        }
      }

      if (type === "requiredif") {
        // { type: "requiredIf", when: "values.state", op?: "filled"|... , value? }
        const when = String(v.when || "");
        const op = String(v.op || "filled").toLowerCase();
        const rhs = v.value;
        const left = when.startsWith("values.")
          ? getAtPath(data, when.replace(/^values\./, ""))
          : undefined;

        let condition = false;
        switch (op) {
          case "filled": condition = !isEmpty(left); break;
          case "empty": condition = isEmpty(left); break;
          case "==": condition = String(left) === String(rhs); break;
          case "!=": condition = String(left) !== String(rhs); break;
          case ">": condition = Number(left) > Number(rhs); break;
          case ">=": condition = Number(left) >= Number(rhs); break;
          case "<": condition = Number(left) < Number(rhs); break;
          case "<=": condition = Number(left) <= Number(rhs); break;
          case "in": condition = Array.isArray(rhs) && rhs.includes(left); break;
          case "not-in": condition = Array.isArray(rhs) && !rhs.includes(left); break;
          default: condition = !isEmpty(left);
        }

        if (condition) {
          const val = data[fieldId];
          const ok = !(isEmpty(val) || val === false);
          if (!ok) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [fieldId], message: msg || opts.messages.requiredIf });
          }
        }
      }
    }
  });
}
