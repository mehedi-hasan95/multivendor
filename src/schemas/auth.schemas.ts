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
    name: z
      .string()
      .min(2, { message: "Name must be atleast 4 characters long" }),
    email: z.string().email(),
    username: z
      .string()
      .min(2, { message: "Username is required" })
      .regex(/^(?!.*  )[A-Za-z0-9-]+$/, {
        message: "Only letters, numbers and dash are allowed",
      })
      .refine(
        (val) => !val.includes("--"),
        "Username cannot consecutive hyphens"
      )
      .transform((val) => val.toLowerCase()),
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
