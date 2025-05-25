"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BackdropGradient from "@/components/generated/backdrop-gradient";
import { Input } from "@/components/ui/input";
import { subCategorySchema } from "@/schemas/schemas";
import { createSubCategory, updateSubCategoryAction } from "@/action/admin";
import { toast } from "sonner";
import { SubCategories } from "@/generated/prisma";
import { LoadingButton } from "@/components/common/loading-button";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface SubCategoryFormProps {
  catSlug: string;
  initialData: SubCategories | null;
}
export const SubCategoryForm = ({
  catSlug,
  initialData,
}: SubCategoryFormProps) => {
  const buttonTitle = initialData
    ? "Update Sub Category"
    : "Create Sub Category";
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const prevTitleRef = useRef("");

  const form = useForm<z.infer<typeof subCategorySchema>>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      categorySlug: catSlug,
    },
  });

  const title = form.watch("name");
  const slug = form.watch("slug");

  // Initialize slug edit state and title ref if editing
  useEffect(() => {
    if (initialData) {
      form.setValue("slug", initialData.slug);
      prevTitleRef.current = initialData.name;
      setIsSlugEdited(true);
    }
  }, [initialData, form]);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!isSlugEdited && slugify(prevTitleRef.current) === slug) {
      const newSlug = slugify(title);
      form.setValue("slug", newSlug);
      prevTitleRef.current = title;
    }
  }, [title, slug, isSlugEdited, form]);

  function onSubmit(values: z.infer<typeof subCategorySchema>) {
    startTransaction(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      initialData
        ? updateSubCategoryAction(
            initialData.id,
            initialData.slug,
            values
          ).then((data) => {
            if (data.success) {
              toast(data.success);
              router.push("/admin/categories");
            } else {
              toast.error(data.error);
            }
          })
        : createSubCategory(catSlug, values).then((data) => {
            if (data.success) {
              toast(data.success);
              router.push("/admin/categories");
            } else {
              toast.error(data.error);
            }
          });
    });
  }

  return (
    <>
      <BackdropGradient
        className="w-4/12 h-2/6 opacity-40"
        container="flex flex-col items-center"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto w-full z-50 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setIsSlugEdited(true);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categorySlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPending ? (
              <LoadingButton className="w-auto" />
            ) : (
              <Button type="submit">{buttonTitle}</Button>
            )}
          </form>
        </Form>
      </BackdropGradient>
    </>
  );
};
