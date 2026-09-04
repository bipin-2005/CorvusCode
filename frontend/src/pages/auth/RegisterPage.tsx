import { useNavigate } from "react-router-dom";
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
  registerSchema,
  type RegisterFormData,
} from "../../validation/auth.schema";

import { authService } from "../../services/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

const onSubmit = async (data: RegisterFormData) => {
  try {
    await authService.register({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      country: data.country,
    });

    navigate("/verify-otp", {
      state: {
        email: data.email,
      },
    });
  } catch (error) {
    console.error(error);
    alert("Registration failed.");
  }
};

  return (
    <AuthLayout
      title="Create Account"
      className="max-w-lg border-orange-600 shadow-orange-500/30"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <div>
          <Label htmlFor="fullName" className="mb-1">
            Full Name
          </Label>

          <Input
            id="fullName"
            className="h-10 text-sm"
            required
            placeholder="Enter your full name"
            {...register("fullName")}
          />

          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-1">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            required
            className="h-10 text-sm"
            placeholder="Enter email"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1">
            Password
          </Label>

          <PasswordInput
          required
            id="password"
            className="h-10 text-sm"
            placeholder="Enter password"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1">
            Confirm Password
          </Label>

          <PasswordInput
          required
            id="confirmPassword"
            className="h-10 text-sm"
            placeholder="Confirm password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="country" className="mb-1">
            Country
          </Label>

          <Input
          required
            id="country"
            className="h-10 text-sm"
            placeholder="India"
            {...register("country")}
          />
        </div>

        <Button
          type="submit"
          className="h-10 text-sm w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Register"}
        </Button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}