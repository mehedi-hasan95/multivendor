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

export const productSchema = z
  .object({
    title: z.string().min(2, { message: "Product name is required" }),
    price: z.coerce
      .number({ message: "Price is required" })
      .int()
      .positive({ message: "Must be a positive number" }),
    basePrice: z.coerce
      .number({ message: "Price is required" })
      .int()
      .positive({ message: "Must be a positive number" }),
    description: z.string().min(2, { message: "Description is required" }),
    categoryId: z.string({ message: "Please select a category" }),
    subCategoryId: z.string({ message: "Please select a sub-category" }),
    stock: z.coerce
      .number()
      .int()
      .positive({ message: "Must be a positive number" })
      .optional(),
    hasDiscount: z.boolean(),
    discount: z.coerce
      .number()
      .int()
      .min(0, { message: "Must be a positive number" })
      .lte(100, { message: "Discount cannot exceed 100" })
      .optional(),
    discountcode: z.string({ message: "Add Cuppon Code" }).optional(),
    images: z.object({ url: z.string() }).array(),
  })
  .refine((data) => data.basePrice >= data.price, {
    message: "Base price must be less than or equal to price",
    path: ["basePrice"],
  })
  .refine(
    (data) => {
      if (data.discount !== undefined) {
        return !!data.discountcode?.trim();
      }
      return true;
    },
    {
      message: "Discount code is required when discount is applied",
      path: ["discountcode"],
    }
  )
  .refine(
    (data) => {
      if (data.hasDiscount === true) {
        return !!data.discount;
      }
      return true;
    },
    {
      message:
        "Discount code and persentage is required when discount is applied",
      path: ["discount"],
    }
  );
