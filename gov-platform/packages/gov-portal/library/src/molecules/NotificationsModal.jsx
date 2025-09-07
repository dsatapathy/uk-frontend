// molecules/NotificationsModal.jsx (DS version)
import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    Chip,
    Link as MuiLink,
    Stack,
    Alert,
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
    variant = "soft",
    radius = "md",
    maxWidth = "sm",
}) {
    const [form, setForm] = React.useState({ title: "", summary: "", link: "" });
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);

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
        : notifications?.items
        ?? notifications?.data
        ?? [];
    return (
        <DSDialog
            open={open}
            onClose={onClose}
            title="Government Notifications"
            intent={intent}
            variant={variant}
            radius={radius}
            maxWidth={maxWidth}
            actions={
                <>
                    <AppButton variant="ghost" onClick={onClose}>
                        Close
                    </AppButton>
                    {isAdmin && (
                        <AppButton
                            intent="primary"
                            variant="solid"
                            onClick={submit}
                            disabled={saving || !form.title.trim()}
                        >
                            {saving ? "Saving…" : "Add Notification"}
                        </AppButton>
                    )}
                </>
            }
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <List dense>
                {list?.map((n) => (
                    <ListItem key={n.id} alignItems="flex-start" sx={{ alignItems: "center" }}>
                        <ListItemText
                            primary={n.title}
                            secondary={
                                <>
                                    <Chip
                                        size="small"
                                        label={new Date(n.date).toLocaleDateString()}
                                        sx={{ mr: 1 }}
                                    />
                                    {n.summary}
                                    {n.link && (
                                        <>
                                            {" "}
                                            <MuiLink href={n.link} target="_blank" rel="noopener">
                                                Read
                                            </MuiLink>
                                        </>
                                    )}
                                </>
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
                    />
                    <InputText
                        label="Summary"
                        size="small"
                        multiline
                        minRows={2}
                        value={form.summary}
                        onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
                    />
                    <InputText
                        label="Link (optional)"
                        size="small"
                        value={form.link}
                        onChange={(e) => setForm((s) => ({ ...s, link: e.target.value }))}
                    />
                </Stack>
            )}
        </DSDialog>
    );
});
