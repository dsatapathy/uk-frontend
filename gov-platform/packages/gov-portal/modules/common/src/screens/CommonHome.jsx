import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getComponent } from "@gov/core";
import { useSelector } from "react-redux";
import { useConfig } from "@gov/library";
import {
  useNotifications,
  useModuleList,
  useCreateNotification,
} from "@gov/data";
import { loadLanding } from "@gov/ui";

export default function CommonHome() {
  const LandingTemplate = getComponent("LandingTemplate");
  const history = useHistory();
  const location = useLocation();

  const { config: landingConfig, loading: cfgLoading } = useConfig(loadLanding, "landing");
  const { user } = useSelector((s) => s.auth.user || {});
  const isAdmin = !!user?.roles?.includes?.("admin");

  const {
    data: notifications = [],
    refetch: refetchNotifications,
  } = useNotifications({ enabled: true });

  const moduleQueryDeps = React.useMemo(() => {
    const params = new URLSearchParams(location.search || "");
    const moduleId = params.get("id");
    return moduleId ? { id: moduleId } : {};
  }, [location.search]);

  const {
    data: modules = [],
    isLoading: modulesLoading,
  } = useModuleList({ enabled: true, deps: moduleQueryDeps });

  const createNotification = useCreateNotification({ token: user?.token });

  const onCreateNotification = React.useCallback(
    async (payload) => {
      await createNotification.mutateAsync(payload);
      await refetchNotifications?.();
    },
    [createNotification, refetchNotifications]
  );

  const onNavigate = React.useCallback(
    (mod, targetPath) => {
      const next = targetPath || mod?.path;
      if (!next) return;
      history.push(next);
    },
    [history]
  );

  if (cfgLoading || !LandingTemplate) return null;

  return (
    <LandingTemplate
      config={landingConfig}
      modules={modules}
      modulesLoading={modulesLoading}
      notifications={notifications}
      isAdmin={isAdmin}
      onNavigate={onNavigate}
      onCreateNotification={onCreateNotification}
      notificationsModalProps={{
        intent: "neutral",
        variant: "solid",
        radius: 1,
      }}
    />
  );
}
