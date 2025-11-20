const ABSOLUTE_URL_RE = /^[a-zA-Z][a-zA-Z0-9+\-.]*:/;

export function normalizeRoutePath(value) {
  if (value === undefined || value === null) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (ABSOLUTE_URL_RE.test(raw) || raw.startsWith("//")) return raw;
  const sanitized = raw.replace(/^\/+/, "/");
  return sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
}

export function isExternalRoute(path) {
  if (!path) return false;
  const raw = String(path).trim();
  if (!raw) return false;
  return ABSOLUTE_URL_RE.test(raw) || raw.startsWith("//");
}
