// AuthLayout.jsx
import * as React from "react";

export function AuthLayout({
  children, className = "", styleVars = {}, place = "center",
  decorations = [], animation = {}, classes
}) {
  const s = classes || {};
  const style = {};
  for (const k in styleVars) style[k.startsWith("--") ? k : `--${k}`] = styleVars[k];
  const pos = s[`pos-${place}`] || "";

  // respect reduced motion
  const prefersReduced = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={`${s.authLayout} ${pos} ${className}`} style={style}>
      {/* background & overlay are via CSS vars, but we add optional animated decorations */}
      <div className={s.bgLayer} aria-hidden />
      {decorations?.map((d, i) => (
        <div
          key={i}
          className={`${s.decor} ${s[`decor-${d.type || "blob"}`]} ${prefersReduced ? s.noMotion : ""}`}
          style={{
            "--decor-size": `${d.size || 280}px`,
            "--decor-hue": d.hue ?? 220,
            "--decor-opacity": d.opacity ?? 0.2,
            "--decor-speed": `${d.speed || 24}s`,
            top: d.top, left: d.left, right: d.right, bottom: d.bottom
          }}
          aria-hidden
        />
      ))}
      <div
        className={`${s.cardIn} ${s[animation?.cardIn || "fadeUp"]} ${prefersReduced ? s.noMotion : ""}`}
        style={{ "--cardIn-duration": `${animation?.durationMs || 500}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
