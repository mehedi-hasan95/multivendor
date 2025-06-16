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
    tagSlug: z.string({ message: "Please select a category" }),
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

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, { message: "At least 2 characters are required" })
    .regex(/^(?!.*  )[A-Za-z0-9 ]+$/, {
      message: "Only letters, numbers, and single spaces are allowed",
    }),
  slug: z
    .string({ message: "Slug is required." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
    }),
});

export const purchaseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.coerce.number().min(1),
  title: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number().nullable().optional(),
  sellerUserName: z.string(),
  sale: z.coerce.number().optional(),
  imageUrl: z.string(),
});

export const ratingsSchame = z.object({
  rating: z.coerce.number().min(0).max(5).optional(),
  review: z.string().optional(),
});
