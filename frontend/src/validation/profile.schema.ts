import { z } from "zod";

/* ---------------- Update Profile ---------------- */

const optionalUrl = z
  .string()
  .max(255, "URL is too long")
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Enter a valid URL starting with http:// or https://"
  );

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is required")
    .max(100, "Full name is too long"),

  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .max(50, "Country must be at most 50 characters")
    .optional()
    .or(z.literal("")),

  avatarUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/* ---------------- Change Password ---------------- */

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
