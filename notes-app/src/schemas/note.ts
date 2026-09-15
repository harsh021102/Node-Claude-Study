import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  body: z.string().max(10_000).default(""),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    body: z.string().max(10_000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const listQuerySchema = z.object({
  search: z.string().optional,
  limit: z.coerce.number().int().min(1).max(100).default(20),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  sort: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
