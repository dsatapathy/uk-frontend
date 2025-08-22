// A tiny, safe, namespaced, versioned storage with optional TTL and mirror to session.
const memoryStore = (() => {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => { m.set(k, String(v)); },
      removeItem: (k) => { m.delete(k); },
      key: (i) => Array.from(m.keys())[i] ?? null,
      get length() { return m.size; },
      clear: () => m.clear(),
    };
  })();
  
  // Safely pick local/session storage, falling back to memory on errors (e.g., privacy mode)
  function safeScope(scope) {
    try {
      if (scope === "local" && typeof localStorage !== "undefined") return localStorage;
      if (scope === "session" && typeof sessionStorage !== "undefined") return sessionStorage;
    } catch (_) {}
    return memoryStore;
  }
function makeKey(policy, key) {
    return `${policy.namespace}:${policy.version}:${key}`;
}

function nowSec() {
    return Math.floor(Date.now() / 1000);
}

export default class VersionedStorage {
    constructor(policy) {
        this.policy = policy;
    }

    set(key, value, opts) {
        const payload = {
            v: 1,
            exp: (() => {
                const ttl = opts?.ttlSeconds ?? this.policy.ttlSeconds;
                return ttl ? nowSec() + ttl : undefined;
            })(),
            data: value,
        };

        const k = makeKey(this.policy, key);
        const serialized = JSON.stringify(payload);
        const primary = safeScope(opts?.scope ?? "local");
        primary.setItem(k, serialized);

        if (this.policy.mirrorToSession && (opts?.scope ?? "local") === "local") {
            safeScope("session").setItem(k, serialized);
        }
    }

    get(key, opts) {
        const k = makeKey(this.policy, key);
        const primary = safeScope(opts?.scope ?? "local");
        const raw =
            primary.getItem(k) ??
            (this.policy.mirrorToSession ? safeScope("session").getItem(k) : null);

        if (!raw) return undefined;

        try {
            const parsed = JSON.parse(raw);
            if (parsed.exp && parsed.exp < nowSec()) {
                this.remove(key);
                return undefined;
            }
            return parsed.data;
        } catch {
            return undefined;
        }
    }

    remove(key) {
        const k = makeKey(this.policy, key);
        safeScope("local").removeItem(k);
        safeScope("session").removeItem(k);
        memoryStore.removeItem(k);
    }

    // Helpful for cross-tab auth sync
    static onAnyStorageChange(handler) {
        if (typeof window !== "undefined") {
            window.addEventListener("storage", handler);
            return () => window.removeEventListener("storage", handler);
        }
        return () => { };
    }
}
