// packages/data/src/hooks/options.js (or your current file)

import { http } from "../bootstrap";
import { useRQQuery, useRQMutation } from "../rq";

/* ------------------------ endpoint registry + helpers ------------------------ */
/**
 * Minimal string-template resolver for request bodies:
 *   "$values.district" -> ctx.values.district
 */
const getDeep = (obj, path) =>
  String(path || "")
    .split(".")
    .reduce((a, k) => (a == null ? a : a[k]), obj);

export const resolveTemplate = (obj, ctx) => {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((x) => resolveTemplate(x, ctx));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.startsWith("$")) {
      // Support "$values.x.y" and "$query" / "$page" etc.
      const key = v.slice(1);
      const val =
        key.startsWith("values.")
          ? getDeep(ctx, key) // look under ctx.values.*
          : ctx[key]; // allow $query, $page, $district, etc.
      out[k] = val;
    } else if (v && typeof v === "object") {
      out[k] = resolveTemplate(v, ctx);
    } else {
      out[k] = v;
    }
  }
  return out;
};

/**
 * Optional central registry so schema can be minimal (`endpointKey` only).
 * You can extend/override per field via `options.request`.
 */
export const OPTIONS_ENDPOINTS = {
  // ───── Location chain ─────
  districts: {
    method: "post",
    url: "v1/master/data",
    bodyTemplate: { type: "district" },
    select: (resp) => resp?.data ?? resp ?? [],
  },
  blocks: {
    method: "post",
    url: "v1/master/data",
    bodyTemplate: { type: "block", district: "$values.district" },
    select: (resp) => resp?.data ?? resp ?? [],
  },
  gps: {
    method: "post",
    url: "v1/master/data",
    bodyTemplate: {
      type: "gp",
      district: "$values.district",
      block: "$values.block",
    },
    select: (resp) => resp?.data ?? resp ?? [],
  },
  villages: {
    method: "post",
    url: "v1/master/data",
    bodyTemplate: {
      type: "village",
      district: "$values.district",
      block: "$values.block",
      gp: "$values.gp",
    },
    select: (resp) => resp?.data ?? resp ?? [],
  },
  // ───── Add more keys here (clf, vo, shg, etc.) the same way ─────
};

/* ------------------------------ useOptions ------------------------------ */
/**
 * Enhanced hook:
 * - honors registry config by endpointKey
 * - supports per-field override via `request` option
 * - supports GET (params) and POST (JSON body)
 * - keeps your old defaults working when no config is provided
 *
 * Usage (existing):
 *   useOptions("districts", { query, deps, enabled })
 *
 * Optional per-field override (if you pass it from the UI):
 *   useOptions("blocks", { query, deps, request: { method:'post', url:'/x', bodyTemplate:{...} }})
 */
export function useOptions(
  endpointKey,
  {
    query,
    page = 1,
    deps = {},
    endpoint,                 // string override url (legacy)
    request,                  // { method, url, bodyTemplate, buildBody, buildParams, select }
    enabled = true,
    staleTime = 10 * 60 * 1000,
  } = {}
) {
  // Merge precedence: per-call request > registry[endpointKey] > default GET
  const reg = OPTIONS_ENDPOINTS[endpointKey] || {};
  const cfg = { ...reg, ...(request || {}) };

  // If caller forces `endpoint` (string), prefer it
  const url = endpoint || cfg.url || (endpointKey ? `/options/${endpointKey}` : undefined);
  const method = (cfg.method || (endpoint ? "get" : "get")).toLowerCase();

  // Build context visible to templates/builders
  // Expose "values" (if present in deps) and also flat keys
  const context = {
    query,
    page,
    ...deps,
    values: deps.values || deps, // tolerate either shape
  };

  // Build params/body depending on method
  let params, data;
  if (method === "get") {
    params = cfg.buildParams ? cfg.buildParams(context) : { q: query, page, ...deps };
  } else {
    const templated = cfg.bodyTemplate ? resolveTemplate(cfg.bodyTemplate, context) : null;
    data = cfg.buildBody ? cfg.buildBody(context) : (templated || { q: query, page, ...deps });
  }

  // Optional response mapper
  const select = cfg.select || ((resp) => resp?.data ?? resp ?? []);

  return useRQQuery({
    key: ["options", endpointKey || "custom", query, JSON.stringify(deps)],
    url,
    method,
    params,
    data,      // 👈 this is the JSON body for POST/PUT/PATCH
    deps,
    enabled: enabled && !!url,
    staleTime,
    select,
  });
}

/* ------------------------------ other hooks ------------------------------ */

export function useFileUpload() {
  return useRQMutation({
    url: "/files/upload",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    buildFormData: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      return fd;
    },
  });
}

export function useSaveDraft(formId, entityId) {
  return useRQMutation({
    url: `/forms/${formId}/${entityId}/draft`,
    method: "post",
  });
}

export function useSubmitForm(formId, entityId) {
  return useRQMutation({
    url: `/forms/${formId}/${entityId}/submit`,
    method: "post",
  });
}

/* ------------------------------- utils/api ------------------------------- */

const accept304 = (s) => (s >= 200 && s < 300) || s === 304;

export async function getMemberProfile(memberId, { signal } = {}) {
  if (memberId == null || String(memberId).trim() === "") return null; // soft guard
  const resp = await http().request({
    url: `/members/${memberId}`,
    method: "get",
    signal, // allows React Query (or AbortController) to cancel
    validateStatus: accept304,
  });
  return resp.data;
}
