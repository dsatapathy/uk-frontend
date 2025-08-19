import { GlobalStyles, useTheme } from "@mui/material";
export default function ThemeBridge() {
  const t = useTheme();
  return (
    <GlobalStyles styles={{
      ":root": {
        "--g-bg": t.palette.background.default,
        "--g-fg": t.palette.text.primary,
        "--g-primary": t.palette.primary.main,
        "--g-secondary": t.palette.secondary.main,
        "--g-border": t.palette.divider,
        "--g-radius": `${t.shape.borderRadius || 8}px`
      }
    }}/>
  );
}
