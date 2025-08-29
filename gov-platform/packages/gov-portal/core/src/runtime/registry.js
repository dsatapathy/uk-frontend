const REG = {
  components: new Map(),
  actions: new Map(),
  guards: new Map(),
  layouts: new Map(),
};

const DOC_LINK = "https://docs.gov-portal.dev/registry";

const warnDuplicate = (type, name) => {
  const stack = new Error().stack;
  console.warn(
    `${type} with name "${name}" already registered.\nSee ${DOC_LINK}#${type.toLowerCase()}\n${stack}`
  );
};

export const registerComponent = (name, comp, overwrite = false) => {
  if (REG.components.has(name)) {
    warnDuplicate("Component", name);
    if (!overwrite) return;
  }
  REG.components.set(name, comp);
};
export const getComponent = (name) => {
  if (!name) throw new Error("Component name is required");
  if (!REG.components.has(name))
    throw new Error(`Component "${name}" not found`);
  return REG.components.get(name);
};
export const registerAction = (name, fn, overwrite = false) => {
  if (REG.actions.has(name)) {
    warnDuplicate("Action", name);
    if (!overwrite) return;
  }
  REG.actions.set(name, fn);
};
export const getAction = (name) => {
  if (!name) throw new Error("Action name is required");
  if (!REG.actions.has(name))
    throw new Error(`Action "${name}" not found`);
  return REG.actions.get(name);
};
export const registerGuard = (name, fn, overwrite = false) => {
  if (REG.guards.has(name)) {
    warnDuplicate("Guard", name);
    if (!overwrite) return;
  }
  REG.guards.set(name, fn);
};
export const getGuard = (name) => {
  if (!name) throw new Error("Guard name is required");
  if (!REG.guards.has(name))
    throw new Error(`Guard "${name}" not found`);
  return REG.guards.get(name);
};
export const registerLayout = (name, comp, overwrite = false) => {
  if (REG.layouts.has(name)) {
    warnDuplicate("Layout", name);
    if (!overwrite) return;
  }
  REG.layouts.set(name, comp);
};
export const getLayout = (name) => {
  if (!name) throw new Error("Layout name is required");
  if (!REG.layouts.has(name))
    throw new Error(`Layout "${name}" not found`);
  return REG.layouts.get(name);
};
export default REG;
