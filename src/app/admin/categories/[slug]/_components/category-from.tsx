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
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { categorySchema } from "@/schemas/schemas";
import { CATEGORY_FORM } from "@/components/common/form/form-list";
import { FormGenerator } from "@/components/common/form/form-generator";
import { ColorPicker } from "./color-picker";
import BackdropGradient from "@/components/generated/backdrop-gradient";
import { createCategoryAction, updateCategoryAction } from "@/action/admin";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { Categories } from "@/generated/prisma";

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

  useEffect(() => {
    const generatedSlug = slugify(title || "");
    form.setValue("slug", generatedSlug);
  }, [form, title]);
  function onSubmit(values: z.infer<typeof categorySchema>) {
    startTransaction(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      initialData
        ? updateCategoryAction(initialData.slug, values).then((data) => {
            if (data.success) {
              toast(data.success);
              router.push("/admin/categories");
            } else {
              toast.error(data.error);
            }
          })
        : createCategoryAction(values).then((data) => {
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
    <BackdropGradient
      className="w-4/12 h-2/6 opacity-40"
      container="flex flex-col items-center"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto w-full z-50 mt-4"
        >
          {CATEGORY_FORM.map((item) => (
            <FormGenerator key={item.id} {...item} form={form} />
          ))}
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
