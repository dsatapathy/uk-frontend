const landingConfig = {
  layout: {
    sectionsOrder: ["attentionBar", "modulesGrid"],
    cardHeight: 240,
    skeletonCount: 6,
    itemProps: { xs: 12, sm: 6, md: 4, lg: 3 },
  },
  attentionBar: {
    enabled: true,
    variant: "elevated",
    left: {
      title: "Stay informed",
      subtitle: "Review the latest notifications and module updates.",
    },
    right: {
      ctaLabel: "Notifications",
      showEditForAdmin: true,
    },
  },
  modules: {
    navIcon: "open_in_new",
  },
};

export default landingConfig;
