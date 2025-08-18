// Simple runtime registry
const REG = {
    components: new Map(),
    actions: new Map(),
    guards: new Map(),
    layouts: new Map(),
  };
  
  export const registerComponent = (name, comp) => REG.components.set(name, comp);
  export const getComponent = (name) => REG.components.get(name);
  
  export const registerAction = (name, fn) => REG.actions.set(name, fn);
  export const getAction = (name) => REG.actions.get(name);
  
  export const registerGuard = (name, fn) => REG.guards.set(name, fn);
  export const getGuard = (name) => REG.guards.get(name);
  
  export const registerLayout = (name, comp) => REG.layouts.set(name, comp);
  export const getLayout = (name) => REG.layouts.get(name);
  
  export default REG;
  