import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";

import {
  Button,
  Input,
  Label,
} from "../../components/ui";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../validation/auth.schema";

import { authService } from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data);

      navigate("/reset-password", {
        state: {
          email: data.email,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Unable to send OTP. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      className="max-w-lg border-orange-600 shadow-orange-500/30"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            required
            placeholder="Enter your registered email"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </Button>

        <p className="text-center text-sm text-slate-400">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}