export const keys = {
    me: () => ["me"],
    sidebar: (tenant, role, locale) => ["sidebar", tenant, role, locale],
    modules: (tenant) => ["modules", tenant],
  };
  