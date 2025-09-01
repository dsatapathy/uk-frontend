export function makeStorage(namespace) {
    const key = (n) => `${namespace}:${n}`;
    return {
      get(name) {
        try {
          const a = localStorage.getItem(key(name));
          const b = sessionStorage.getItem(key(name));
          return a ? JSON.parse(a) : b ? JSON.parse(b) : null;
        } catch (_) { return null; }
      },
      set(name, value, scope) {
        try {
          const s = scope === "local" ? localStorage : sessionStorage;
          s.setItem(key(name), JSON.stringify(value));
          if (scope === "local") sessionStorage.removeItem(key(name));
          else localStorage.removeItem(key(name));
        } catch (_) {}
      },
      remove(name) {
        try {
          localStorage.removeItem(key(name));
          sessionStorage.removeItem(key(name));
        } catch (_) {}
      },
    };
  }