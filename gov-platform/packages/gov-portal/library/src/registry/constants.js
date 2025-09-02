import { lazyModule } from "@gov/core";

const getMenuMod = lazyModule(() => import("../utils/menu-utils.js"));

// Keep function name the same
export const getDRAWER_WIDTH = async () => {
  const { DRAWER_WIDTH } = await getMenuMod();
  return DRAWER_WIDTH;
};
