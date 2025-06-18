import { z } from "zod";
import { email } from "zod/v4";

export const LoginFormSchema = z.object({
  email: z.string().email().min(1, "Email can't be empty").trim(),
});
export const RegisterFormSchema = z.object({
  email: z.string().email().min(1, "Email can't be empty").trim(),
  password: z
    .string()
    .min(6, { message: "Be at least 6 characters long" })
    .max(6, { message: "Be at least 6 characters long" })
    .regex(/[0-9]/, { message: "Contain number." })
    .trim(),
  user_name: z
    .string()
    .min(3, { message: "Be at least 3 characters long" })
    .trim(),
});
