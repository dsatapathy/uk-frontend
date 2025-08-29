import { z } from 'zod';

export function buildZodFromSchema(schema) {
  const shape = {};
  const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

  schema.sections?.forEach((sec) => {
    sec.fields?.forEach((f) => {
      let zf = baseForType(f.type);
      (f.validations || []).forEach((v) => {
        switch (v.type) {
          case 'required': zf = zf.refine((val) => !(val === undefined || val === null || val === ''), { message: v.message || 'Required' }); break;
          case 'min': zf = zf.refine((val) => val == null || Number(val) >= v.value, { message: v.message || `Min ${v.value}` }); break;
          case 'max': zf = zf.refine((val) => val == null || Number(val) <= v.value, { message: v.message || `Max ${v.value}` }); break;
          case 'minLength': zf = zf.refine((val) => val == null || String(val).length >= v.value, { message: v.message || `Min length ${v.value}` }); break;
          case 'maxLength': zf = zf.refine((val) => val == null || String(val).length <= v.value, { message: v.message || `Max length ${v.value}` }); break;
          case 'pattern': zf = zf.refine((val) => val == null || new RegExp(v.value).test(String(val)), { message: v.message || 'Invalid format' }); break;
          case 'email': zf = zf.refine((val) => val == null || emailRegex.test(String(val)), { message: v.message || 'Invalid email' }); break;
          default: break;
        }
      });
      shape[f.id] = zf;
    });
  });

  return z.object(shape);
}

function baseForType(t) {
  switch (t) {
    case 'number': return z.union([z.number(), z.string()]);
    case 'checkbox': return z.boolean().or(z.literal(undefined));
    case 'date':
    case 'time':
    case 'datetime':
    case 'text':
    case 'password':
    case 'email':
    case 'tel':
    case 'url':
    case 'textarea':
    case 'select':
    case 'autocomplete':
    case 'multiselect':
    default: return z.any();
  }
}
