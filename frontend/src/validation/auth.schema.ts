import { z } from "zod";

/* ---------------- Login ---------------- */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* ---------------- Register ---------------- */

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name is required")
      .max(100, "Full name is too long"),

    email: z.string().email("Enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    country: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/* ---------------- Forgot Password ---------------- */

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordFormData =
  z.infer<typeof forgotPasswordSchema>;

/* ---------------- Reset Password ---------------- */

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormData =
  z.infer<typeof resetPasswordSchema>;