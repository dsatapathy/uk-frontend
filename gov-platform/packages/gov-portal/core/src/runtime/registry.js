const REG = {
  components: new Map(),
  actions: new Map(),
  guards: new Map(),
  layouts: new Map(),
};

const warnDuplicate = (type, name) =>
  console.warn(`${type} with name "${name}" already registered`);

export const registerComponent = (name, comp, overwrite = false) => {
  if (REG.components.has(name)) {
    warnDuplicate("Component", name);
    if (!overwrite) return;
  }
  REG.components.set(name, comp);
};
export const getComponent = (name) => REG.components.get(name);

export const registerAction = (name, fn, overwrite = false) => {
  if (REG.actions.has(name)) {
    warnDuplicate("Action", name);
    if (!overwrite) return;
  }
  REG.actions.set(name, fn);
};
export const getAction = (name) => REG.actions.get(name);

export const registerGuard = (name, fn, overwrite = false) => {
  if (REG.guards.has(name)) {
    warnDuplicate("Guard", name);
    if (!overwrite) return;
  }
  REG.guards.set(name, fn);
};
export const getGuard = (name) => REG.guards.get(name);

export const registerLayout = (name, comp, overwrite = false) => {
  if (REG.layouts.has(name)) {
    warnDuplicate("Layout", name);
    if (!overwrite) return;
  }
  REG.layouts.set(name, comp);
};
export const getLayout = (name) => REG.layouts.get(name);

export default REG;
