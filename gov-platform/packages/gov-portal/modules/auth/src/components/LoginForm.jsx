import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema } from "@gov/library";
import defaultS from "@gov/styles/modules/auth/Auth.module.scss";
import { getComponent } from "@gov/core";

export default function LoginForm({ config, onSubmit, onSuccess, components = {}, classes  }) {
  const s = classes || defaultS;
  const AuthLayout = getComponent("AuthLayout");
  const AuthCard = getComponent("AuthCard");
  const Brand = getComponent("Brand");
  const FieldRenderer = getComponent("FieldRenderer");
  const CaptchaBox = getComponent("CaptchaBox");
  const AppButton = getComponent("AppButton");

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
    // NEW ↓ background image/fit/position/overlay/blur
    "login-bg-img":         config.style?.layout?.backgroundImage ? `url(${config.style.layout.backgroundImage})` : "none",
    "login-bg-fit":         config.style?.layout?.backgroundFit || "cover",
    "login-bg-pos":         config.style?.layout?.backgroundPosition || "center",
    "login-overlay":        config.style?.layout?.overlay || "transparent",
    "login-blur":           (config.style?.layout?.blurPx ?? 0) + "px",

    "login-card-w":         (config.style?.card?.widthPx ?? 480) + "px",
    "login-card-p":         (config.style?.card?.paddingPx ?? 24) + "px",
    "login-card-radius":    (config.style?.card?.radiusPx ?? 12) + "px",
    "login-card-border":    config.style?.card?.border || "1px solid #e5e7eb",
    "login-grid-cols":      String(config.style?.grid?.cols ?? 12),
    "login-grid-gap":       (config.style?.grid?.gapPx ?? 16) + "px",
    "login-button-mt":      (config.style?.button?.marginTopPx ?? 8) + "px",
    "field-bg":            config.style?.field?.bg || "#fff",
    "field-error":         config.style?.field?.errorColor  || "#ef4444",
    "field-focus":         config.style?.field?.focusColor  || "#0b5fff",
  };
  const elevation = config.style?.card?.elevation ?? 2;
  const place = config.style?.layout?.place || "center";// center|left|right|top-left|top-right|bottom-left|bottom-right

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
    <C.AuthLayout
      place={place}
      styleVars={styleVars}
      classes={s}
      decorations={config.visual?.decorations}
      animation={config.animation}
    >
      <form className="login-form" onSubmit={handleSubmit(async (payload) => {
        await submitFn(payload);
        onSuccess ? onSuccess(payload) : (config.onSuccessRoute && (window.location.href = config.onSuccessRoute));
      })} noValidate>
        <C.AuthCard variant={config.layout?.variant || "card"} elevation={elevation} classes={s} >
          {(config.brand && (config.brand.logo || config.brand.title || config.brand.subtitle)) ? (
            <C.Brand classes={s} {...config.brand} />
          ) : null}

          <div className={s.loginGrid}>
            {(config.fields || []).map((f) => (
              <C.FieldRenderer key={f.name} control={control} field={f} errors={errors} classes={s} />
            ))}
            {config.captcha?.provider === "dev" ? (
              <C.CaptchaBox control={control} cfg={config.captcha} errors={errors} classes={s} />
            ) : null}
          </div>

          <div className={`${s.submitRow} ${s[`align-${config.style?.button?.align}`] || ""}`}>
            <AppButton
              type="submit"
              variant={config.style?.button?.variant || "contained"}
              tone={config.style?.button?.tone || "primary"}
              size={config.style?.button?.size || "large"}
              fullWidth={!!config.style?.button?.fullWidth}
              loading={isSubmitting}
              className={s.submitBtn}
              buttonGap={1}
            >
              {config.submit?.label || "Sign In"}
            </AppButton>
            <AppButton
              type="submit"
              variant={config.style?.button?.variant || "contained"}
              tone={config.style?.button?.tone || "secondary"}
              size={config.style?.button?.size || "large"}
              fullWidth={!!config.style?.button?.fullWidth}
              loading={isSubmitting}
              className={s.submitBtn}
              buttonGap={1}
            >
              {config.register?.label || "Register"}
            </AppButton>
          </div>
        </C.AuthCard>
      </form>
    </C.AuthLayout>
  );
}
