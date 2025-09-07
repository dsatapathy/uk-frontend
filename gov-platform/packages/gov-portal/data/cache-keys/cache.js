// cache.js

// 🔑 Utility: normalize key (array or string) → stable string
function normalizeKey(k) {
  if (Array.isArray(k)) return JSON.stringify(k);
  return String(k);
}

const _cache = new Map();

export const getCache = (k) => _cache.get(normalizeKey(k));

export const setCache = (k, v) => {
  _cache.set(normalizeKey(k), v);
  return v;
};

export const delCache = (k) => _cache.delete(normalizeKey(k));

export const clearCache = () => _cache.clear();

// optional: expose Map if you need iteration/debugging
export const _internalCache = _cache;
