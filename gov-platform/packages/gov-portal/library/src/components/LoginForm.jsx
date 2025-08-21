import * as React from "react";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema } from "../utils/schema";
import { AuthLayout } from "./AuthLayout.jsx";
import { AuthCard } from "./AuthCard.jsx";
import { Brand } from "./Brand.jsx";
import { FieldRenderer } from "../form/FieldRenderer.jsx";
import { CaptchaBox } from "./CaptchaBox.jsx";
import s from "@gov/styles/modules/auth/Auth.module.scss";

export function LoginForm({ config, onSubmit, onSuccess, components = {} }) {
  const C = {
    AuthLayout: components.AuthLayout || AuthLayout,
    AuthCard: components.AuthCard || AuthCard,
    Brand: components.Brand || Brand,
    FieldRenderer: components.FieldRenderer || FieldRenderer,
    CaptchaBox: components.CaptchaBox || CaptchaBox,
  };

  const schema = React.useMemo(() => buildSchema(config.fields || [], config.captcha), [config]);

  const defaultValues = {};
  (config.fields || []).forEach((f) => (defaultValues[f.name] = f.initialValue ?? (f.type === "checkbox" ? false : "")));
  if (config.captcha?.provider === "dev") defaultValues[config.captcha.name || "captcha"] = "";

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  // CSS variables from config (all px values supported)
  const styleVars = {
    "login-pad":            (config.style?.layout?.paddingPx ?? 24) + "px",
    "login-bg":             config.style?.layout?.background || "transparent",
    "login-card-w":         (config.style?.card?.widthPx ?? 480) + "px",
    "login-card-p":         (config.style?.card?.paddingPx ?? 24) + "px",
    "login-card-radius":    (config.style?.card?.radiusPx ?? 12) + "px",
    "login-card-border":    config.style?.card?.border || "1px solid #e5e7eb",
    "login-grid-cols":      String(config.style?.grid?.cols ?? 12),
    "login-grid-gap":       (config.style?.grid?.gapPx ?? 16) + "px",
    "login-button-mt":      (config.style?.button?.marginTopPx ?? 8) + "px",
  };
  const elevation = config.style?.card?.elevation ?? 2;
  const place = config.style?.layout?.place || "center"; // center|left|right|top-left|top-right|bottom-left|bottom-right

  async function defaultSubmit(payload) {
    if (!config?.submit?.endpoint) return { ok: true };
    const res = await fetch(config.submit.endpoint, {
      method: config.submit.method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }
  const submitFn = onSubmit || defaultSubmit;

  return (
    <C.AuthLayout place={place} styleVars={styleVars} >
      <form className="login-form" onSubmit={handleSubmit(async (payload) => {
        await submitFn(payload);
        onSuccess ? onSuccess(payload) : (config.onSuccessRoute && (window.location.href = config.onSuccessRoute));
      })} noValidate>
        <C.AuthCard variant={config.layout?.variant || "card"} elevation={elevation}>
          {(config.brand && (config.brand.logo || config.brand.title || config.brand.subtitle)) ? (
            <C.Brand {...config.brand} />
          ) : null}

          <div className="login-grid">
            {(config.fields || []).map((f) => (
              <C.FieldRenderer key={f.name} control={control} field={f} errors={errors} />
            ))}
            {config.captcha?.provider === "dev" ? (
              <C.CaptchaBox control={control} cfg={config.captcha} errors={errors} />
            ) : null}
          </div>

          <div className={`submit-row align-${config.style?.button?.align || "left"}`}>
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} className="submit-btn">
              {config.submit?.label || "Sign In"}
            </Button>
          </div>
        </C.AuthCard>
      </form>
    </C.AuthLayout>
  );
}
