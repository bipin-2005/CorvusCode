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
  loginSchema,
  type LoginFormData,
} from "../../validation/auth.schema";

import { authService } from "../../services/auth.service";
import { saveToken, saveUser } from "../../services/token";


import { toast } from "sonner";
import { getErrorMessage } from "../../utils/error";
import { Loader2 } from "lucide-react";
export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);

      saveToken(response.data.token);

      saveUser(
        response.data.fullName,
        response.data.email,
        response.data.roles
      );
      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      title="Boom! We are back in action"
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
            type="email"
            placeholder="Enter your email"
            required
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>

          <PasswordInput
            id="password"
            placeholder="Enter your password"
            required
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              className="accent-orange-500"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-orange-400 transition hover:text-orange-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
       <Button
         type="submit"
         disabled={isSubmitting}
         className="flex items-center justify-center gap-2"
       >
         {isSubmitting ? (
           <>
             <Loader2 className="h-4 w-4 animate-spin" />
             <span>Signing In...</span>
           </>
         ) : (
           "Sign In"
         )}
       </Button>

        {/* Register */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Create Account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}