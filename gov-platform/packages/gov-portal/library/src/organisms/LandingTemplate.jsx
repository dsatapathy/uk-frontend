import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import DSBox from "../atoms/DSBox";
import { AttentionBar } from "../molecules/AttentionBar";
import { ModuleGrid } from "./ModuleGrid";
import { NotificationsModal } from "../molecules/NotificationsModal";

export default function LandingTemplate({
  config = {},
  modules = [],
  modulesLoading = false,
  notifications = [],
  isAdmin = false,
  onNavigate,
  onCreateNotification,
  containerProps,
  attentionBarProps,
  moduleGridProps,
  notificationsModalProps,
}) {
  const attentionConfig = config.attentionBar || {};
  const layout = config.layout || {};

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Container
      {...containerProps}
      sx={{ py: { xs: 2, md: 3 }, ...(containerProps?.sx || {}) }}
    >
      {attentionConfig.enabled && (
        <DSBox mb={2}>
          <AttentionBar
            config={attentionConfig}
            isAdmin={isAdmin}
            onOpenNotifications={() => setModalOpen(true)}
            onOpenEditor={() => setModalOpen(true)}
            {...attentionBarProps}
          />
        </DSBox>
      )}

      <DSBox mt={2}>
        <ModuleGrid
          modules={modules}
          loading={modulesLoading}
          onNavigate={onNavigate}
          config={{ layout, modules: config.modules || {} }}
          {...moduleGridProps}
        />
      </DSBox>

      <NotificationsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notifications={notifications}
        isAdmin={isAdmin}
        onCreate={onCreateNotification}
        {...notificationsModalProps}
      />
    </Container>
  );
}

LandingTemplate.propTypes = {
  config: PropTypes.shape({
    layout: PropTypes.object,
    attentionBar: PropTypes.shape({
      enabled: PropTypes.bool,
    }),
    modules: PropTypes.object,
  }),
  modules: PropTypes.array,
  modulesLoading: PropTypes.bool,
  notifications: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isAdmin: PropTypes.bool,
  onNavigate: PropTypes.func,
  onCreateNotification: PropTypes.func,
  containerProps: PropTypes.object,
  attentionBarProps: PropTypes.object,
  moduleGridProps: PropTypes.object,
  notificationsModalProps: PropTypes.object,
};
