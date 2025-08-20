import { z } from "zod";
// describe one module entry
const moduleEntry = z.object({
    key: z.string(),
    basePath: z.string(),
    loader: z.any().optional(),  // function
    import: z.string().optional() // string path for dynamic import
});

// modules as an array (simple mode)
const modulesArraySchema = z.array(moduleEntry);

// modules as an object (defaults/registry  optional remote source)
const modulesObjectSchema = z.object({
    defaults: z.object({
        list: z.array(moduleEntry).default([]),
        registry: z.record(z.string(), z.any()).optional()
    }).default({ list: [] }),
    source: z.object({
        url: z.string().optional(),
        endpoint: z.string().optional(),
        params: z.record(z.any()).optional(),
        mapping: z.object({
            list: z.string().optional(),
            fields: z.object({
                key: z.string().optional(),
                basePath: z.string().optional()
            }).partial().optional()
        }).partial().optional()
    }).partial().optional(),
    mergeStrategy: z.enum(["enabled-first", "replace", "append"]).optional(),
    onErrorFallback: z.enum(["defaults", "none"]).optional()
});
const modulesSchema = z.union([modulesArraySchema, modulesObjectSchema]);
export const configSchema = z.object({
    target: z.string().default("#root"),
    base: z.string().default("/uk-portal"),
    app: z
        .object({
            name: z.string().optional(),
            logo: z.string().optional(),
        })
        .default({}),
    theme: z.any().optional(),
    layout: z
        .object({
            sidebar: z.any().default({}),
            component: z.any().optional(),
            header: z.any().optional(),
        })
        .default({}),
    modules: modulesSchema.default([]),
    redirects: z.array(z.any()).default([]),
    auth: z
        .object({
            strategy: z.string().default("none"),
        })
        .catchall(z.any())
        .default({ strategy: "none" }),
    hooks: z.object({}).catchall(z.any()).default({}),
    context: z.object({}).catchall(z.any()).default({}),
});
