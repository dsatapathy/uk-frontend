import ukLogo from "../../assets/images/Logo.png";
const loginConfig = {
    brand: { logo: ukLogo, title: "UK Portal", subtitle: "UGVS-REAP : MIS" },
  
    layout: { variant: "card" },
  
    style: {
      layout: { place: "center", paddingPx: 24, background: "linear-gradient(180deg,#f8fafc,#fff)" },
      card:   { widthPx: 520, paddingPx: 28, radiusPx: 12, border: "1px solid #e5e7eb", elevation: 2 },
      grid:   { cols: 12, gapPx: 16 },
      button: { align: "right", marginTopPx: 12 },
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
    onSuccessRoute: "/"
  };
  
  export default loginConfig;
  