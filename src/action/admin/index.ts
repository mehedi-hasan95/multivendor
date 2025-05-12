"use server";

import { authSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { categorySchema, subCategorySchema } from "@/schemas/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// crate category
export const createCategoryAction = async (
  values: z.infer<typeof categorySchema>
) => {
  try {
    const userRole = await authSession();
    if (userRole?.user.role !== "admin") {
      return { error: "Unauthorize user" };
    }
    const uniqueSlue = await db.categories.findUnique({
      where: {
        slug: values.slug,
      },
    });
    if (uniqueSlue) {
      return { error: "Slug already exit, try another slug" };
    }
    await db.categories.create({
      data: values,
    });

    revalidatePath("/admin/categories");
    return { success: "Category created successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

// get categories
export const getCategoriesAction = async () => {
  const categories = await db.categories.findMany({
    include: {
      SubCategories: true,
    },
  });
  return categories;
};

// get single category
export const getSingelCategoyAction = async (slug: string) => {
  const category = await db.categories.findUnique({
    where: {
      slug,
    },
  });
  return category;
};

// update a category
export const updateCategoryAction = async (
  id: string,
  slug: string,
  values: z.infer<typeof categorySchema>
) => {
  try {
    const userRole = await authSession();
    if (userRole?.user.role !== "admin") {
      return { error: "Unauthorize user" };
    }
    const uniqueSlue = await db.categories.findUnique({
      where: {
        slug: values.slug,
      },
    });
    if (uniqueSlue && uniqueSlue.id !== id) {
      return { error: "Slug already exit, try another slug" };
    }
    await db.categories.update({
      where: {
        slug,
      },
      data: { ...values },
    });

    revalidatePath("/admin/categories");
    return { success: "Category update successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

// get single category
export const getSingelCategory = async (slug: string) => {
  const category = await db.categories.findUnique({
    where: { slug },
  });
  return category;
};

// create sub category

export const createSubCategory = async (
  category: string,
  values: z.infer<typeof subCategorySchema>
) => {
  try {
    const userRole = await authSession();
    if (userRole?.user.role !== "admin") {
      return { error: "Unauthorize user" };
    }
    const uniqueSlue = await db.categories.findUnique({
      where: {
        slug: category,
      },
    });
    if (!uniqueSlue) {
      return { error: "This category doesn't exist" };
    }
    await db.subCategories.create({
      data: values,
    });

    revalidatePath("/admin/categories");
    return { success: "Category update successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
