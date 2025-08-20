// src/engine/sidebar.js
import { applySidebarMerge, getByPath } from "./utils";
// import { bootstrapFlags } from "./constants";

export async function bootstrapSidebar({ config, http, app, sidebarCfg, appInfo }) {
  // if (bootstrapFlags.sidebar) return;
  // bootstrapFlags.sidebar = true;

  const s = sidebarCfg?.source;
  const defaults = sidebarCfg?.defaults || sidebarCfg?.nav || [];
  const mergeStrategy = sidebarCfg?.mergeStrategy || "replace";

  if (!s) {
    if (defaults?.length) app.addNav?.(defaults);
    return;
  }

  try {
    const url = s.endpoint ? config.http?.endpoints?.[s.endpoint]?.url : s.url || s.endpoint;
    const params = {
      ...(s.params || {}),
      tenant: appInfo?.tenant,
      locale: config.i18n?.defaultLocale,
      role: config.auth?.currentUser?.role,
    };

    const { data } = await http.get(url, { params, retry: false });

    const listPath = s.mapping?.list || "items";
    const serverItems =
      (data && (listPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data) || data.items)) || [];

    const map = s.mapping?.fields;
    const mapped = map
      ? serverItems.map((it) => ({
          key: getByPath(it, map.key, it.code),
          text: getByPath(it, map.text, it.label),
          to: getByPath(it, map.to, it.route),
          icon: getByPath(it, map.icon, it.icon),
          visibleWhen: {
            roles: getByPath(it, map?.visibleWhen?.roles, it.roles),
            perms: getByPath(it, map?.visibleWhen?.perms, it.permissions),
            expr: getByPath(it, map?.visibleWhen?.expr, it.expr),
          },
        }))
      : serverItems;

    const finalNav = applySidebarMerge(defaults, mapped, mergeStrategy);
    if (finalNav?.length) app.addNav?.(finalNav);
  } catch (e) {
    if (sidebarCfg?.onErrorFallback === "defaults" && defaults?.length) {
      app.addNav?.(defaults);
    }
  }
}
