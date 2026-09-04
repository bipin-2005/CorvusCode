import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";

import {
  Button,
  Input,
  Label,
  PasswordInput,
} from "../../components/ui";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../validation/auth.schema";

import { authService } from "../../services/auth.service";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!email) {
    return null;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await authService.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      alert("Password reset successfully.");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Invalid or expired OTP.");
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      className="max-w-lg border-orange-600 shadow-orange-500/30"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            required
            value={email}
            disabled
          />
        </div>

        {/* OTP */}
        <div>
          <Label htmlFor="otp">OTP</Label>

          <Input
            id="otp"
            required
            placeholder="Enter 6-digit OTP"
            {...register("otp")}
          />

          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <Label htmlFor="newPassword">
            New Password
          </Label>

          <PasswordInput
            id="newPassword"
            required
            placeholder="Enter your new password"
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">
            Confirm Password
          </Label>

          <PasswordInput
          required
            id="confirmPassword"
            placeholder="Confirm your new password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Resetting Password..."
            : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}