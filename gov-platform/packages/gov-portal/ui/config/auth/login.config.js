// login.config.js
import ukLogo from "../../assets/images/Logo.png";
import bgImg from "../../assets/images/logo-bg-3.png"; // optimized JPG/WEBP

const loginConfig = {
  brand: {
    logo: ukLogo,
    title: "UGVS-REAP : MIS",
    subtitle: "",
  },

  layout: { variant: "card", place: "center" },
  api: { baseURL: "http://localhost:3001" },

  style: {
    layout: {
      paddingPx: 24,
      background: "linear-gradient(180deg,#f8fafc,#fff)", // fallback
      backgroundImage: bgImg,
      backgroundFit: "cover",
      backgroundPosition: "center",
      overlay: "rgba(255,255,255,.6)",
      blurPx: 6,
    },
    card: {
      maxWidthPx: 520,        // treated as a max; card CSS remains fluid
      paddingPx: 28,
      radiusPx: 12,
      border: "1px solid #e5e7eb",
      elevation: 2,
    },
    grid: { cols: 12, gapPx: 12 },

    // Global defaults consumed by FieldRenderer -> InputText
    field: {
      fullWidth: true,        // let MUI stretch inside its grid cell
      size: "small",          // "small" | "medium" (InputText maps to "sm"/"md")
      // No width tokens here; purely responsive
    },

    button: { align: "center", marginTopPx: 12 },
  },

  visual: {
    decorations: [
      { type: "blob", size: 340, top: "8%", left: "6%", hue: 210, opacity: 0.25, speed: 22 },
      { type: "blob", size: 280, bottom: "10%", right: "12%", hue: 270, opacity: 0.22, speed: 28 },
      { type: "ring", size: 220, top: "65%", left: "20%", hue: 180, opacity: 0.18, speed: 30 },
    ],
  },

  animation: { cardIn: "fadeUp", durationMs: 500 },

  fields: [
    {
      type: "text",
      name: "username",
      label: "User ID",
      required: true,
      minLength: 3,
      icon: "person",
      grid: { span: { xs: 12, md: 12 } },
      placeholder: "Enter your user ID",
      // optional per-field UI overrides for InputText
      ui: {
        showClear: true,
        showPrefix: true,
      },
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      required: true,
      minLength: 6,
      icon: "lock",
      grid: { span: { xs: 12, md: 12 } },
      ui: {
        showClear: false,  // usually off for password
        showPrefix: true,
        showSuffix: true,  // enables the toggle button suffix
      },
    },
    // { type: "checkbox", name: "remember", label: "Remember me", grid: { span: { xs: 12 } } },
  ],

  captcha: { provider: "dev", name: "captcha", length: 6 },

  submit: { label: "Sign In", endpoint: "/api/auth/login", method: "POST" },
  register: { label: "Register", redirect: "/uk-portal/register" },
  onSuccessRoute: "/uk-portal/landing",
};

export default loginConfig;
