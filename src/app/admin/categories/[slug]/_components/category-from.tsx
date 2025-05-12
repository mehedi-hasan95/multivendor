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
import { categorySchema } from "@/schemas/schemas";
import { ColorPicker } from "./color-picker";
import BackdropGradient from "@/components/generated/backdrop-gradient";
import { createCategoryAction, updateCategoryAction } from "@/action/admin";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { Categories } from "@/generated/prisma";
import { Input } from "@/components/ui/input";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface CategoryFormProps {
  initialData: Categories | null;
}

export const CategoryForm = ({ initialData }: CategoryFormProps) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const prevTitleRef = useRef("");

  const buttonLabel = initialData ? "Update Category" : "Create Category";

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      color: initialData?.color || undefined,
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

  function onSubmit(values: z.infer<typeof categorySchema>) {
    startTransaction(() => {
      if (initialData) {
        updateCategoryAction(initialData.id, initialData.slug, values).then(
          (data) => {
            if (data.success) {
              toast(data.success);
              router.push("/admin/categories");
            } else {
              toast.error(data.error);
            }
          }
        );
      } else {
        createCategoryAction(values).then((data) => {
          if (data.success) {
            toast(data.success);
            router.push("/admin/categories");
          } else {
            toast.error(data.error);
          }
        });
      }
    });
  }

  return (
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    onPickerChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending ? (
            <LoadingButton className="w-auto" />
          ) : (
            <Button type="submit">{buttonLabel}</Button>
          )}
        </form>
      </Form>
    </BackdropGradient>
  );
};
