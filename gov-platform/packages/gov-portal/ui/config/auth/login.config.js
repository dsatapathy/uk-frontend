import { color } from "@mui/system";
import ukLogo from "../../assets/images/Logo.png";
import bgImg from "../../assets/images/logo-bg-3.png"; // optimized JPG/WEBP

const loginConfig = {
  brand: {
    logo: ukLogo,
    title: "UGVS-REAP : MIS",
    subtitle: "",
    labelSx: {
      color: "#fff",
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: 0.3,
      mb: 0.5,                  // spacing below the label
    },
  },

  layout: { variant: "card", place: "center" },

  style: {
    layout: {
      paddingPx: 24,          // outer — SCSS clamps anyway
      backgroundImage: bgImg,
      blurPx: 6,
    },
    card: {
      maxWidthPx: 480,        // feeds --login-card-w via your LoginForm.js
      paddingPx: 20,          // inner padding (SCSS clamps 16..24)
      radiusPx: 12,
      border: "1px solid var(--g-border)",
      elevation: 2,
    },
    grid: { cols: 12, gapPx: 12 },  // SCSS clamps 8..16
    field: { fullWidth: true, size: "small" },
    button: { align: "center", marginTopPx: 10 },
  },

  // decorations optional; remove if they distract
  visual: {
    decorations: [
      // hues are handled in CSS; keeping structure is fine
      { type: "blob", size: 320, top: "8%", left: "6%", opacity: 0.22, speed: 22 },
      { type: "blob", size: 260, bottom: "10%", right: "12%", opacity: 0.18, speed: 28 },
      { type: "ring", size: 220, top: "65%", left: "20%", opacity: 0.16, speed: 30 },
    ],
  },

  animation: { cardIn: "fadeUp", durationMs: 500 },

  fields: [
    {
      type: "text",
      name: "username",
      label: "User ID",
      labelSx: {
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: 0.3,
        mb: 0.5,                  // spacing below the label
      }, minLength: 3,
      icon: "person",
      grid: { span: { xs: 12, md: 12 } },
      placeholder: "Enter your user ID",
      ui: { showClear: true, showPrefix: true },
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      labelSx: {
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: 0.3,
        mb: 0.5,                  // spacing below the label
      }, placeholder: "Enter your password",
      required: true,
      minLength: 6,
      icon: "lock",
      grid: { span: { xs: 12, md: 12 } },
      ui: { showClear: false, showPrefix: true, showSuffix: true },
    },
  ],

  captcha: {
    provider: "dev", name: "captcha", length: 6, labelSx: {
      color: "#fff",
      fontWeight: 600,
      fontSize: "0.9rem",
      letterSpacing: 0.3,
      mb: 0.5,                  // spacing below the label
    },
  },

  submit: {
    label: "Sign In", endpoint: "v1/auth/login", method: "POST", labelSx: {
      color: "#fff",
      fontWeight: 600,
      fontSize: "0.9rem",
      letterSpacing: 0.3,
      mb: 0.5,                  // spacing below the label
    },
  },
  register: { label: "Register", redirect: "/register" },
  onSuccessRoute: "/landing",
};

export default loginConfig;
