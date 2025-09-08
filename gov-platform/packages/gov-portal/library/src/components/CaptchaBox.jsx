import * as React from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Stack,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";

export function CaptchaBox({ control, cfg = {}, errors, classes }) {
  const s = classes || {};
  const name = cfg.name || "captcha";
  const length = cfg.length || 6;

  const make = React.useCallback((n) => {
    const cs = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let x = "";
    for (let i = 0; i < n; i++) x += cs[Math.floor(Math.random() * cs.length)];
    return x;
  }, []);

  const [code, setCode] = React.useState(() => make(length));
  React.useEffect(() => { setCode(make(length)); }, [length, make]);

  const refresh = () => setCode(make(length));

  return (
    <Box className={s.gridItem} sx={{ "--span-xs": 12, width: "100%" }}>
      <Stack
        className={s.captchaRow}
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ width: "100%" }}
      >
        {/* Captcha display (read-only) */}
        <TextField
          value={code}
          label={cfg.captchaLabel || "Captcha"}
          inputProps={{ readOnly: true }}
          fullWidth
          sx={{
            // On desktop keep it compact; on mobile let it fill
            width: { xs: "100%", md: 180 },
            flexShrink: 0,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={refresh}
                  size="small"
                  aria-label="refresh-captcha"
                  title="Refresh captcha"
                >
                  <RefreshIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        {/* User input */}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={cfg.label || "Enter captcha"}
              error={!!errors?.[name]}
              helperText={errors?.[name]?.message || ""}
              fullWidth
              autoComplete="off"
              sx={{ flexGrow: 1 }}
            />
          )}
        />
      </Stack>
    </Box>
  );
}
