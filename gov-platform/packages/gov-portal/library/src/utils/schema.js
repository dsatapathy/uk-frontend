import { z } from "zod";

export function buildSchema(fields = [], captchaCfg) {
  const shape = {};

  for (const f of fields) {
    const t = (f.type || "text").toLowerCase();
    let s;

    if (t === "checkbox") {
      s = z.boolean();
      if (f.required) s = s.refine(Boolean, { message: f.requiredMessage || "Required" });
    } else {
      let str = z.string();                           // ← no transform here
      if (f.required)    str = str.min(1, { message: f.requiredMessage || "Required" });
      if (f.minLength)   str = str.min(f.minLength, { message: f.minLengthMessage || `Min ${f.minLength} characters` });
      if (f.maxLength)   str = str.max(f.maxLength, { message: f.maxLengthMessage || `Max ${f.maxLength} characters` });
      if (f.pattern)     str = str.regex(new RegExp(f.pattern), { message: f.patternMessage || "Invalid format" });
      if (t === "email") str = str.email({ message: f.invalidMessage || "Invalid email" });
      s = str;
    }

    shape[f.name] = s;
  }

  if (captchaCfg?.provider === "dev") {
    const key = captchaCfg.name || "captcha";
    shape[key] = z.string().min(1, { message: "Captcha required" });
  }

  return z.object(shape);
}
