import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchemaLazy } from "@gov/library";
import defaultS from "@gov/styles/modules/auth/Auth.module.scss";
import { getComponent } from "@gov/core";

function LoginFormInner({ config, onSubmit, onSuccess, components, classes, schema }) {
  const s = classes || defaultS;
  const AuthLayout    = getComponent("AuthLayout");
  const AuthCard      = getComponent("AuthCard");
  const Brand         = getComponent("Brand");
  const FieldRenderer = getComponent("FieldRenderer");
  const CaptchaBox    = getComponent("CaptchaBox");
  const RenderButton  = getComponent("RenderButton");

  const C = {
    AuthLayout:    components?.AuthLayout    || AuthLayout,
    AuthCard:      components?.AuthCard      || AuthCard,
    Brand:         components?.Brand         || Brand,
    FieldRenderer: components?.FieldRenderer || FieldRenderer,
    CaptchaBox:    components?.CaptchaBox    || CaptchaBox,
  };

  // default values (pure)
  const defaultValues = React.useMemo(() => {
    const dv = {};
    (config.fields || []).forEach((f) => {
      dv[f.name] = f.initialValue ?? (f.type === "checkbox" ? false : "");
    });
    if (config.captcha?.provider === "dev") {
      dv[config.captcha.name || "captcha"] = "";
    }
    return dv;
  }, [config.fields, config.captcha]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  // CSS vars from config
  const styleVars = {
    "login-pad": (config.style?.layout?.paddingPx ?? 24) + "px",
    "login-bg": config.style?.layout?.background || "transparent",
    "login-bg-img": config.style?.layout?.backgroundImage ? `url(${config.style.layout.backgroundImage})` : "none",
    "login-bg-fit": config.style?.layout?.backgroundFit || "cover",
    "login-bg-pos": config.style?.layout?.backgroundPosition || "center",
    "login-overlay": config.style?.layout?.overlay || "transparent",
    "login-blur": (config.style?.layout?.blurPx ?? 0) + "px",
    "login-card-w": (config.style?.card?.widthPx ?? 480) + "px",
    "login-card-p": (config.style?.card?.paddingPx ?? 24) + "px",
    "login-card-radius": (config.style?.card?.radiusPx ?? 12) + "px",
    "login-card-border": config.style?.card?.border || "1px solid #e5e7eb",
    "login-grid-cols": String(config.style?.grid?.cols ?? 12),
    "login-grid-gap": (config.style?.grid?.gapPx ?? 16) + "px",
    "login-button-mt": (config.style?.button?.marginTopPx ?? 8) + "px",
    "field-bg": config.style?.field?.bg || "#fff",
    "field-error": config.style?.field?.errorColor || "#ef4444",
    "field-focus": config.style?.field?.focusColor || "#0b5fff",
  };
  const elevation = config.style?.card?.elevation ?? 2;
  const place = config.style?.layout?.place || "center";

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
      <form
        className="login-form"
        onSubmit={handleSubmit(async (payload) => {
          const res = await submitFn(payload);
          onSuccess
            ? onSuccess(res, payload)
            : (config.onSuccessRoute && (window.location.href = config.onSuccessRoute));
        })}
        noValidate
      >
        <C.AuthCard variant={config.layout?.variant || "card"} elevation={elevation} classes={s}>
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
            {config.submit   && (<RenderButton cfg={config.submit}   key="submit"   isSubmitting={isSubmitting} classes={s} />)}
            {config.register && (<RenderButton cfg={config.register} key="register" isSubmitting={isSubmitting} classes={s} />)}
            {config.back     && (<RenderButton cfg={config.back}     key="back"     isSubmitting={isSubmitting} classes={s} />)}
          </div>
        </C.AuthCard>
      </form>
    </C.AuthLayout>
  );
}

export default function LoginForm(props) {
  const { config } = props;

  // Load schema lazily in the shell
  const [schema, setSchema] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sc = await buildSchemaLazy(config.fields || [], config.captcha);
        if (alive) setSchema(sc);
      } catch (e) {
        console.error("[LoginForm] Failed to build schema:", e);
        if (alive) setSchema(null);
      }
    })();
    return () => { alive = false; };
  }, [config.fields, config.captcha]);

  if (!schema) return null; // or a spinner

  return <LoginFormInner {...props} schema={schema} />;
}
