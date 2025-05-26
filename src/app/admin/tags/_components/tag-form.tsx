"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { tagSchema } from "@/schemas/schemas";
import BackdropGradient from "@/components/generated/backdrop-gradient";
import { CREATE_TAG_FORM } from "@/components/common/form/form-list";
import { FormGenerator } from "@/components/common/form/form-generator";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const TagForm = () => {
  const router = useRouter();
  const prevTitleRef = useRef("");

  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const title = form.watch("name");
  const slug = form.watch("slug");

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (slugify(prevTitleRef.current) === slug) {
      const newSlug = slugify(title);
      form.setValue("slug", newSlug);
      prevTitleRef.current = title;
    }
  }, [title, slug, form]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createTags = useMutation(
    trpc.tags.create.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      },
      onSuccess: () => {
        toast("Tag created ");
        router.push("/admin/tags");
      },
    })
  );
  function onSubmit(values: z.infer<typeof tagSchema>) {
    createTags.mutate(values);
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
            {CREATE_TAG_FORM.map((item) => (
              <FormGenerator key={item.id} {...item} form={form} />
            ))}
            {createTags.isPending ? (
              <LoadingButton className="w-auto" />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </BackdropGradient>
    </>
  );
};
