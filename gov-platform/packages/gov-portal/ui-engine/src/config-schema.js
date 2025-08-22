import { z } from "zod";

export const authEndpointsSchema = z.object({
  baseURL: z.string().default("http://localhost:3001"),
  login: z.string().default("/api/auth/login"),
  refresh: z.string().default("/api/auth/refresh"),
  logout: z.string().default("/api/auth/logout"),
  me: z.string().default("/api/auth/me"),
});

export const storagePolicySchema = z.object({
  version: z.string().default("v1"), // bump to invalidate old keys
  namespace: z.string().default("uk-portal"), // app/tenant aware keys
  mirrorToSession: z.boolean().default(true), // also write to sessionStorage
  ttlSeconds: z.number().optional(), // optional token TTL override
});

export const authSchema = z.object({
  strategy: z.enum(["none", "jwt", "oidc", "custom"]).default("jwt"),
  publicPaths: z.array(z.string()).default(["/login", "/register", "/forgot", "/otp"]),
  login: z.object({ path: z.string().default("/login") }),
  endpoints: authEndpointsSchema,
  storage: storagePolicySchema.default({}),
});

export const configSchema = z.object({
  // ... your existing fields ...
  auth: authSchema,
});
