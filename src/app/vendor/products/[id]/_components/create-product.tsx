"use client";
import { productSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxModify } from "@/components/common/combobox-modify";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import BackdropGradient from "@/components/generated/backdrop-gradient";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/common/image-upload";
import GlassCard from "@/components/generated/glass-card";
import { LoadingButton } from "@/components/common/loading-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateProduct = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions({}));

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      basePrice: undefined,
      price: undefined,
      discount: undefined,
      stock: undefined,
      categoryId: "",
      subCategoryId: "",
      hasDiscount: false,
      discountcode: "",
      images: [],
    },
  });

  // Watch the categoryId to update subcategories when it changes
  const selectedCategoryId = form.watch("categoryId");

  // Reset subcategory when category changes
  useEffect(() => {
    form.setValue("subCategoryId", "");
  }, [selectedCategoryId, form]);

  // Find the selected category and get its subcategories
  const selectedCategory = data.find((cat) => cat.slug === selectedCategoryId);
  const subCategories = selectedCategory?.SubCategories || [];

  // has discount for rendering other stafs
  const hasDiscount = form.watch("hasDiscount");

  // 2. Define a submit handler.

  const createProduct = useMutation(
    trpc.products.create.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
      onSuccess: () => {
        router.push("/vendor/products");
      },
    })
  );
  function onSubmit(values: z.infer<typeof productSchema>) {
    createProduct.mutate(values);
  }

  return (
    <div>
      <BackdropGradient
        className="w-4/12 h-2/6 opacity-40"
        container="flex flex-col items-center"
      >
        <div className="w-full z-50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Product Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-6 space-x-4 col-span-full lg:col-span-3 space-y-8">
                <div className="col-span-full sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Category</FormLabel>
                        <FormControl>
                          <ComboboxModify
                            optoins={data.map((cat) => ({
                              label: cat.name,
                              value: cat.slug,
                            }))}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Subcategory</FormLabel>
                        <FormControl>
                          <ComboboxModify
                            optoins={subCategories.map((subCat) => ({
                              label: subCat.name,
                              value: subCat.slug || subCat.id,
                            }))}
                            disabled={
                              !selectedCategoryId || subCategories.length === 0
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Base Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 99.99"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 99.99"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products quantity</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 150"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="hasDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Have Discount?</FormLabel>
                        <FormControl>
                          <Switch
                            className="cursor-pointer"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {hasDiscount && (
                  <>
                    <div className="col-span-full sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Persentage?</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 2%"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="discountcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. MEHEDI20" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-full sm:col-span-2">
                  <GlassCard>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-center">
                            Add Product Images
                          </FormLabel>
                          <FormControl>
                            <ImageUpload
                              endPoint="productImages"
                              onChange={(url) => {
                                field.onChange(url);
                              }}
                              value={field.value.map((img) => img.url)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </GlassCard>
                </div>
              </div>
              {createProduct.isPending ? (
                <LoadingButton />
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </form>
          </Form>
        </div>
      </BackdropGradient>
    </div>
  );
};
