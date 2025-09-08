// molecules/NotificationsModal.jsx (responsive DS version)
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Link as MuiLink,
  Stack,
  Alert,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import InputText from "../atoms/InputText";
import AppButton from "../atoms/AppButton";
import DSDialog from "../atoms/DSDialog";

export const NotificationsModal = React.memo(function NotificationsModal({
  open,
  onClose,
  notifications,
  isAdmin,
  onCreate,
  intent = "neutral",
  variant = "solid",   // solid by default so background is opaque
  radius = "md",
  maxWidth = "sm",
}) {
  const [form, setForm] = React.useState({ title: "", summary: "", link: "" });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const submit = async () => {
    try {
      setSaving(true);
      setError(null);
      await onCreate?.(form);
      setForm({ title: "", summary: "", link: "" });
    } catch (e) {
      setError(e?.message || "Failed to add notification");
    } finally {
      setSaving(false);
    }
  };

  const list = Array.isArray(notifications)
    ? notifications
    : notifications?.items ?? notifications?.data ?? [];

  return (
    <DSDialog
      open={open}
      onClose={onClose}
      title="Government Notifications"
      intent={intent}
      variant={variant}
      radius={radius}
      // Mobile-friendly dialog chrome
      fullScreen={isXs}
      maxWidth={isXs ? false : maxWidth}
      PaperProps={{
        sx: {
          m: isXs ? 0 : 2,
          borderRadius: isXs ? 0 : 2,
          width: isXs ? "100%" : undefined,
        },
      }}
      // Responsive actions layout
      actions={
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1}
          justifyContent="flex-end"
          alignItems={{ xs: "stretch", sm: "center" }}
          width="100%"
        >
          <AppButton variant="ghost" onClick={onClose} fullWidth={isXs}>
            Close
          </AppButton>
          {isAdmin && (
            <AppButton
              intent="primary"
              variant="solid"
              onClick={submit}
              disabled={saving || !form.title.trim()}
              fullWidth={isXs}
            >
              {saving ? "Saving…" : "Add Notification"}
            </AppButton>
          )}
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Scrollable content area so tall lists/forms don't overflow */}
      <Box
        sx={{
          maxHeight: { xs: "60vh", sm: "50vh" },
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        <List dense disablePadding>
          {list.map((n) => (
            <ListItem
              key={n.id}
              alignItems="flex-start"
              sx={{ alignItems: "center", px: 0, py: 1 }}
            >
              <ListItemText
                primaryTypographyProps={{ fontWeight: 600, lineHeight: 1.3 }}
                secondaryTypographyProps={{
                  component: "div",
                  sx: { wordBreak: "break-word" },
                }}
                primary={n.title}
                secondary={
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                    sx={{ mt: 0.25 }}
                  >
                    <Chip
                      size="small"
                      label={new Date(n.date).toLocaleDateString()}
                    />
                    <span>{n.summary}</span>
                    {n.link && (
                      <MuiLink
                        href={n.link}
                        target="_blank"
                        rel="noopener"
                        sx={{ wordBreak: "break-all" }}
                      >
                        Read
                      </MuiLink>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>

        {isAdmin && (
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <InputText
              label="Title"
              size="small"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              fullWidth
            />
            <InputText
              label="Summary"
              size="small"
              multiline
              minRows={3}
              value={form.summary}
              onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
              fullWidth
            />
            <InputText
              label="Link (optional)"
              size="small"
              value={form.link}
              onChange={(e) => setForm((s) => ({ ...s, link: e.target.value }))}
              fullWidth
            />
          </Stack>
        )}
      </Box>
    </DSDialog>
  );
});
