import { z } from "zod";

/* ---------- shared auth/storage schemas ---------- */
export const authEndpointsSchema = z.object({
  baseURL: z.string().default("http://localhost:3001"),
  login: z.string().default("/api/auth/login"),
  refresh: z.string().default("/api/auth/refresh"),
  logout: z.string().default("/api/auth/logout"),
  me: z.string().default("/api/auth/me"),
});

export const storagePolicySchema = z.object({
  version: z.string().default("v1"),
  namespace: z.string().default("uk-portal"),
  mirrorToSession: z.boolean().default(true),
  ttlSeconds: z.number().optional(),
});

/* ---------- modules schema ---------- */
// single module entry
const moduleEntry = z.object({
  key: z.string(),
  basePath: z.string(),
  loader: z.any().optional(),       // function at runtime
  import: z.string().optional(),    // path for dynamic import
});

// modules as an array
const modulesArraySchema = z.array(moduleEntry);

// modules as an object with defaults + optional remote source
const modulesObjectSchema = z.object({
  defaults: z.object({
    list: z.array(moduleEntry).default([]),
    registry: z.record(z.any()).optional(), // record<string, any>
  }).default({ list: [] }),

  source: z.object({
    url: z.string().optional(),
    endpoint: z.string().optional(),
    params: z.record(z.any()).optional(),
    mapping: z.object({
      list: z.string().optional(),
      fields: z.object({
        key: z.string().optional(),
        basePath: z.string().optional(),
      }).partial().optional(),
    }).partial().optional(),
  }).partial().optional(),

  mergeStrategy: z.enum(["enabled-first", "replace", "append"]).optional(),
  onErrorFallback: z.enum(["defaults", "none"]).optional(),
});

const modulesSchema = z.union([modulesArraySchema, modulesObjectSchema]);

/* ---------- root config schema ---------- */
export const configSchema = z.object({
  target: z.string().default("#root"),
  base: z.string().default("/uk-portal"),

  app: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
  }).default({}),

  theme: z.any().optional(),

  layout: z.object({
    sidebar: z.any().default({}),
    component: z.any().optional(),
    header: z.any().optional(),
  }).default({}),

  modules: modulesSchema.default([]),

  redirects: z.array(z.any()).default([]),

  auth: z.object({
    strategy: z.string().default("none"), // or z.enum(["none","jwt","oidc","custom"]).default("none")
    login: z.object({ path: z.string().default("/login") }).optional(),
    publicPaths: z.array(z.string()).default(["/login", "/register", "/forgot", "/otp"]),
    endpoints: authEndpointsSchema.default({}),
    storage: storagePolicySchema.default({}),
  })
  .catchall(z.any())
  .default({ strategy: "none" }),

  hooks: z.object({}).catchall(z.any()).default({}),
  context: z.object({}).catchall(z.any()).default({}),
});
