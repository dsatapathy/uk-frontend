import ukLogo from "@gov/ui/assets/images/Logo.png";

const registerConfig = {
  brand: { logo: ukLogo, title: "UGVS-REAP : MIS", subtitle: "" },

  layout: { variant: "card", place: "center" },

  style: {
    layout: {
      paddingPx: 24,
      background: "linear-gradient(180deg,#f8fafc,#fff)",
      backgroundImage: "",
      backgroundFit: "cover",
      backgroundPosition: "center",
      overlay: "rgba(255,255,255,.6)",
      blurPx: 6,
    },
    card: { widthPx: 520, paddingPx: 28, radiusPx: 12, border: "1px solid #e5e7eb", elevation: 2 },
    grid: { cols: 12, gapPx: 12 },
    field: { size: "small" },
    button: { align: "center", marginTopPx: 12 },
  },

  visual: {
    decorations: [
      { type: "blob", size: 340, top: "8%", left: "6%", hue: 210, opacity: 0.25, speed: 22 },
      { type: "blob", size: 280, bottom: "10%", right: "12%", hue: 270, opacity: 0.22, speed: 28 },
      { type: "ring", size: 220, top: "65%", left: "20%", hue: 180, opacity: 0.18, speed: 30 },
    ],
  },

  animation: {
    cardIn: "fadeUp",
    durationMs: 500,
  },

  fields: [
    {
      type: "text",
      name: "username",
      label: "Enter User ID",
      required: true,
      minLength: 3,
      icon: "person",
      grid: { span: { xs: 12, md: 12 } },
    },
    {
      type: "text",
      name: "confirmUsername",
      label: "Re-enter User ID",
      required: true,
      minLength: 3,
      icon: "person",
      grid: { span: { xs: 12, md: 12 } },
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      required: true,
      minLength: 6,
      icon: "lock",
      grid: { span: { xs: 12, md: 12 } },
    },
  ],

  submit: { label: "Sign In", endpoint: "v1/auth/register", method: "POST" },
  back: { label: "Back", redirect: "/login" },
  onSuccessRoute: "/",
};

export default registerConfig;
