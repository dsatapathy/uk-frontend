import * as React from "react";
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";
import InputText from "../atoms/InputText"; // adjust the path if needed

export default function CaptchaBox({ control, cfg = {}, errors, classes, field }) {
  const { setValue, trigger } = useFormContext?.() || {};
  const { labelSx } = field;  
  const s = classes || {};
  const name = cfg.name || "captcha";
  const length = cfg.length || 6;
  const inputRef = React.useRef(null);

  const make = React.useCallback((n) => {
    const cs = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let x = "";
    for (let i = 0; i < n; i++) x += cs[Math.floor(Math.random() * cs.length)];
    return x;
  }, []);

  const [code, setCode] = React.useState(() => make(length));
  React.useEffect(() => { setCode(make(length)); }, [length, make]);

  const refresh = () => {
    setCode(make(length));
    // clear user input + revalidate, then focus
    setValue?.(name, "");
    trigger?.(name);
    try { inputRef.current?.focus?.(); } catch {}
  };

  const refreshBtn = (
    <Button
      onClick={refresh}
      size="small"
      aria-label="refresh captcha"
      title="Refresh captcha"
      tabIndex={0}
      endIcon={<RefreshIcon fontSize="small" />}
    >
      Refresh
    </Button>
  );

  const errObj = errors?.[name];
  const errMsg = errObj?.message || "";

  return (
    <Box className={s.gridItem} sx={{ "--span-xs": 12, width: "100%" }}>
      <Stack
        className={s.captchaRow}
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ width: "100%" }}
      >
        {/* Captcha display (read-only) with label on top */}
        <FormControl
          fullWidth
          margin="normal"
          disabled={false}
          error={false}
          sx={{ width: { xs: "100%", md: 220 }, flexShrink: 0 }}
        >
          <FormLabel htmlFor={`${name}-display`} sx={{ ...(labelSx || {}) }}>
            {cfg.captchaLabel || "Captcha"}
          </FormLabel>

          <InputText
            id={`${name}-display`}
            name={`${name}-display`}
            value={code}
            onChange={() => {}}
            readOnly
            suffix={refreshBtn}
            config={{
              variant: "outlined",
              size: "sm",
              fullWidth: true,
              showClear: false,
              showPrefix: false,
              showSuffix: true,
              showCharCount: false,
              autoComplete: "off",
            }}
            textFieldProps={{
              margin: "none",
              helperText: undefined,
              InputProps: { readOnly: true, "aria-readonly": true },
            }}
          />

          {/* no helper text for display */}
        </FormControl>

        {/* User input — label on top + validation */}
        <Controller
          name={name}
          control={control}
          rules={{
            required: cfg.required ?? "Captcha is required",
            validate: (v) =>
              (v ?? "").toString().trim().toUpperCase() === code
                ? true
                : (cfg.mismatchMessage || "Captcha does not match"),
          }}
          render={({ field }) => (
            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errObj}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <FormLabel htmlFor={name} sx={{ ...(labelSx || {}) }}>
                {cfg.label || "Enter captcha"}
              </FormLabel>

              <InputText
                id={name}
                name={name}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={inputRef}
                placeholder={cfg.placeholder}
                type="text"
                error={!!errObj}
                ariaDescribedBy={`${name}-help`}
                config={{
                  variant: "outlined",
                  size: "sm",
                  fullWidth: true,
                  showClear: true,
                  showPrefix: false,
                  showSuffix: false,
                  showCharCount: false,
                  autoComplete: "off",
                  ...(cfg.ui || {}),
                }}
                inputProps={{ maxLength: cfg.maxLength }}
                textFieldProps={{
                  margin: "none",
                  helperText: undefined, // helper below
                  autoComplete: "off",
                }}
              />

              <FormHelperText id={`${name}-help`}>
                {errMsg}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Stack>
    </Box>
  );
}
