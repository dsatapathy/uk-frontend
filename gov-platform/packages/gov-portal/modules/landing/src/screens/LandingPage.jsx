// page/LandingPage.jsx (DS + RQ version)
import React from "react";
import { Container } from "@mui/material";
import { useConfig } from "@gov/library";

import {
  useNotifications,
  useModuleList,
  useCreateNotification,
} from "@gov/data";
import { getComponent } from "@gov/core";
import { useSelector } from "react-redux";
import { loadLanding } from "@gov/ui";

export default function LandingPage() {
  const DSBox = getComponent("DSBox");
  const AttentionBar = getComponent("AttentionBar");
  const NotificationsModal = getComponent("NotificationsModal");
  const ModuleGrid = getComponent("ModuleGrid");
  const { config: landingConfig, loading: cfgLoading } = useConfig(loadLanding, "landing");
  const { user } = useSelector((s) => s.auth.user || {});  
  const isAdmin = !!user?.roles?.includes?.("admin");
  // — Data Fetching (RQ) —
  const {
    data: notifications = [],
    isLoading: notifLoading,
    refetch: refetchNotifications,
  } = useNotifications({ enabled: true });

  const {
    data: modules = [],
    isLoading: modulesLoading,
  } = useModuleList({ enabled: true });

  const createNotification = useCreateNotification({ token: user?.token });

  // — Modal state —
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  if (cfgLoading) return null;

  const onCreateNotification = async (payload) => {
    await createNotification.mutateAsync(payload);
    // If your RQ layer auto-invalidate is not wired, call refetch:
    await refetchNotifications?.();
  };

  const onNavigate = (mod) => {
    // analytics / prefetch hooks can go here
  };

  // — Config-driven sections render —
  const sections = landingConfig.layout.sectionsOrder.map((key) => {
    switch (key) {
      case "attentionBar":
        if (!landingConfig.attentionBar?.enabled) return null;
        return (
          <DSBox key="attentionBar" mb={2}>
            <AttentionBar
              config={landingConfig.attentionBar}
              onOpenNotifications={openModal}
              isAdmin={isAdmin}
              onOpenEditor={openModal}
            />
          </DSBox>
        );
      case "modulesGrid":
        return (
          <DSBox key="modulesGrid" mt={2}>
            <ModuleGrid
              modules={modules}
              loading={modulesLoading}
              onNavigate={onNavigate}
              config={{ layout: landingConfig.layout, modules: landingConfig.modules }}
            />
          </DSBox>
        );
      default:
        return null;
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      {sections}
      <NotificationsModal
        radius={1}
        open={open}
        onClose={closeModal}
        notifications={notifications}
        isAdmin={isAdmin}
        onCreate={onCreateNotification}
        // Optional DS surface props:
        intent="neutral"
        variant="solid"
      />
    </Container>
  );
}
