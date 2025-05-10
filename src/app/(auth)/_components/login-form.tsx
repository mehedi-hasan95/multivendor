"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginSchema } from "@/schemas/auth.schemas";
import { LOGIN_FORM } from "@/components/common/form/form-list";
import { FormGenerator } from "@/components/common/form/form-generator";

export const LoginForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {LOGIN_FORM.map((item) => (
          <FormGenerator key={item.id} {...item} form={form} />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
