import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email is required.",
  }),
  password: z.string().min(2, {
    message: "Password is required.",
  }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Email is required" }),
    username: z.string().min(2, { message: "Username is required" }),
    password: z
      .string()
      .min(4, { message: "Your password must be atleast 4 characters long" })
      .max(64, {
        message: "Your password can not be longer then 64 characters long",
      }),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });
