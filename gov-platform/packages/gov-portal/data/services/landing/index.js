// services/landing.rq.js
import { useRQQuery, useRQMutation } from "../rq";

/** ───────────────────────────── Notifications ───────────────────────────── **/

// GET /notifications
export function useNotifications({
  query,            // optional: search term
  page = 1,
  deps = {},
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 min (tweak as needed)
} = {}) {
  return useRQQuery({
    key: ["notifications", { query, page, ...deps }],
    url: "/notifications",
    method: "get",
    params: { q: query, page, ...deps },
    deps,
    enabled,
    staleTime,
  });
}

// POST /notifications
export function useCreateNotification({ token } = {}) {
  return useRQMutation({
    url: "/notifications",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // data you pass to mutate(payload) becomes the request body
  });
}

/** ───────────────────────────────── Modules ─────────────────────────────── **/

// GET /modules
export function useModuleList({
  query,            // optional: filter/search
  page = 1,
  deps = {},
  enabled = true,
  staleTime = 10 * 60 * 1000, // 10 min cache by default
} = {}) {
  return useRQQuery({
    key: ["modules", { query, page, ...deps }],
    url: "/modules",
    method: "get",
    params: { q: query, page, ...deps },
    deps,
    enabled,
    staleTime,
  });
}
