import * as React from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import { Controller } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";

export function CaptchaBox({ control, cfg = {}, errors, classes }) {
  const s = classes || {};
  const name = cfg.name || "captcha";
  const length = cfg.length || 6;
  const [code, setCode] = React.useState(make(length));
  function make(n){ const cs="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let x=""; for(let i=0;i<n;i++) x+=cs[Math.floor(Math.random()*cs.length)]; return x;}
  const refresh = () => setCode(make(length));
  return (
    <div className={s.gridItem} style={{ "--span-xs": 12 }}>
      <div className={s.captchaRow}>
        <TextField value={code} label="Captcha"
          InputProps={{ readOnly: true, endAdornment: (
            <InputAdornment position="end">
              <Button onClick={refresh} size="small" aria-label="refresh-captcha"><RefreshIcon fontSize="small" /></Button>
            </InputAdornment>)}}/>
        <Controller name={name} control={control}
          render={({ field }) => (
            <TextField {...field} label={cfg.label || "Enter captcha"}
              error={!!errors?.[name]} helperText={errors?.[name]?.message || ""}/>
          )}/>
      </div>
    </div>
  );
}
