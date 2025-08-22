import { getComponent } from "@gov/core";

export default function RenderButton({cfg, key, isSubmitting, classes}) {
    const AppButton = getComponent("AppButton");
    const s = classes || {};
    const isRedirect = !!cfg.redirect;
  
    return (
      <AppButton
        key={key}
        type={isRedirect ? "button" : "submit"}
        variant={cfg.variant || "contained"}
        tone={cfg.tone || (isRedirect ? "secondary" : "primary")}
        size={cfg.size || "large"}
        fullWidth={!!cfg.fullWidth}
        loading={!isRedirect && isSubmitting}
        className={s.submitBtn}
        buttonGap={1}
        onClick={() => {
          if (isRedirect) window.location.href = cfg.redirect;
        }}
      >
        {cfg.label}
      </AppButton>
    );
  }
  