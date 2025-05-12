import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  slug: z
    .string({ message: "Slug is required." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
    }),
  color: z
    .string({ message: "Color is required." })
    .trim()
    .regex(/^#[0-9A-F]{6}$/i, { message: "Invalid hex color format." })
    .optional(),
});

export const subCategorySchema = z.object({
  name: z.string().min(2, {
    message: "Sbu Category name must be at least 2 characters.",
  }),
  slug: z
    .string({ message: "Slug is required." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
    }),
  categorySlug: z.string().min(2, {
    message: "Please select the category.",
  }),
});
