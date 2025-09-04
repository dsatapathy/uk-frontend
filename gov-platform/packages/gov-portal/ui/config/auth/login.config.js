// login.config.ts/js
import ukLogo from "../../assets/images/Logo.png";
import bgImg from "../../assets/images/bg-3.png"; // any large, optimized JPG/WEBP

const loginConfig = {
  brand: { logo: ukLogo, title: "UGVS-REAP : MIS", subtitle: "" },

  layout: { variant: "card", place: "center" },
  api: { baseURL: "http://localhost:3001" },
  style: {
    layout: {
      paddingPx: 24,
      background: "linear-gradient(180deg,#f8fafc,#fff)", // fallback if image fails
      // NEW ↓
      backgroundImage: '',
      backgroundFit: "cover",        // cover | contain
      backgroundPosition: "center",  // css background-position
      overlay: "rgba(255,255,255,.6)",  // glass overlay on top of bg
      blurPx: 6,                         // backdrop blur for glass effect
    },
    card: { widthPx: 520, paddingPx: 28, radiusPx: 12, border: "1px solid #e5e7eb", elevation: 2 },
    grid: { cols: 12, gapPx: 12 },
    field: { size: "small" },
    button: { align: "center", marginTopPx: 12 },
  },

  // optional animated decorations (rendered by AuthLayout)
  visual: {
    decorations: [
      { type: "blob", size: 340, top: "8%",  left: "6%",  hue: 210, opacity: .25, speed: 22 },
      { type: "blob", size: 280, bottom: "10%", right: "12%", hue: 270, opacity: .22, speed: 28 },
      { type: "ring", size: 220, top: "65%", left: "20%", hue: 180, opacity: .18, speed: 30 }
    ]
  },

  animation: {
    cardIn: "fadeUp",   // fadeUp | scaleIn | none
    durationMs: 500,
  },

  fields: [
    { type: "text",     name: "username", label: "User ID", required: true, minLength: 3, icon: "person",
      grid: { span: { xs: 12, md: 12 } } },
    { type: "password", name: "password", label: "Password", required: true, minLength: 6, icon: "lock",
      grid: { span: { xs: 12, md: 12 } } },
    { type: "checkbox", name: "remember", label: "Remember me", grid: { span: { xs: 12 } } },
  ],

  captcha: { provider: "dev", name: "captcha", length: 6 },

  submit: { label: "Sign In", endpoint: "/api/auth/login", method: "POST" },
  register: { label: "Register", redirect: "/uk-portal/register" },
  onSuccessRoute: "/uk-portal/landing"
};

export default loginConfig;
