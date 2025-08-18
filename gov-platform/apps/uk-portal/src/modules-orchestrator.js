// Central point to load/activate selected modules
export async function loadModules(app) {
    // Static list is best for tree-shaking. If you prefer env-driven, see note below.
    const mods = [
      () => import("@gov/mod-bpa"),
      () => import("@gov/mod-tl")
    ];
  
    for (const loader of mods) {
      const mod = await loader();
      mod.register?.(app);
    }
  }
  