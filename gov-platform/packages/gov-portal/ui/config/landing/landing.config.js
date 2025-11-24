const landingConfig = {
  layout: {
    sectionsOrder: ["attentionBar", "modulesGrid"], // config-driven order
    maxGridColumns: { xs: 1, sm: 2, md: 3, lg: 4 },
    cardAspectRatio: 1.2, // width/height ratio hint for media/illustrations
  },
  attentionBar: {
    enabled: true,
    variant: "elevated", // "flat" | "elevated" | "outlined"
    left: {
      title: "Welcome to the UGVS REAP-MIS Application",
      subtitle:
        "To know more details, please click on the tiles or icons below.",
    },
    right: {
      ctaLabel: "View Notifications",
      showEditForAdmin: true,
    },
    animation: { type: "slide", direction: "down", duration: 350 },
  },
  modules: {
    // Card UI defaults; actual list comes from API
    animation: { type: "stagger-fade-up", duration: 240, stagger: 60 },
    navIcon: "Launch", // Fallback icon for nav action
  },
};

export default landingConfig;