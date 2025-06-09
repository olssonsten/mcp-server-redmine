import { z } from "zod";

const validModuleNames = [
  "boards",
  "calendar",
  "documents",
  "files",
  "gantt",
  "issue_tracking",
  "news",
  "repository",
  "time_tracking",
  "wiki",
] as const;

const validIncludeValues = [
  "trackers",
  "issue_categories",
  "enabled_modules",
  "time_entry_activities",
  "issue_custom_fields",
] as const;

// type ModuleName = (typeof validModuleNames)[number]; // Unused - commented out

export const ProjectQuerySchema = z.object({
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  name: z.string().optional(),
  status: z.union([z.literal(1), z.literal(5), z.literal(9)]).optional(), // 1: active, 5: archived, 9: closed
  is_public: z.boolean().optional(),
  include: z
    .string()
    .refine(
      (value) =>
        value
          .split(",")
          .every((item) => validIncludeValues.includes(item as typeof validIncludeValues[number])), // Corrected 'any'
      "Invalid include value. Must be comma-separated list of: trackers, issue_categories, enabled_modules, time_entry_activities, issue_custom_fields"
    )
    .optional(),
});

export const RedmineProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  identifier: z.string(),
  description: z.string().optional(),
  homepage: z.string().optional(),
  status: z.number(), // 1: active, 5: archived, 9: closed
  parent: z.optional(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  created_on: z.string(),
  updated_on: z.string(),
  is_public: z.boolean(),
  inherit_members: z.boolean().optional(),
  enabled_module_names: z.array(z.enum(validModuleNames)).optional(), // Renamed from enabled_modules to match Redmine response
  trackers: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
  issue_categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
  time_entry_activities: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        is_default: z.boolean().optional(),
        active: z.boolean().optional(),
      })
    )
    .optional(),
  custom_fields: z // Assuming this is part of 'include' for project details
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        value: z.union([z.string(), z.array(z.string())]), // Value can be complex
      })
    )
    .optional(),
  default_version: z.optional( // For default target version
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  default_assignee: z.optional( // For default assignee
     z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

// Export the query params type
export type ProjectQueryParams = z.infer<typeof ProjectQuerySchema>;
export type ModuleNames = z.infer<
  typeof RedmineProjectSchema
>["enabled_module_names"];
