import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  Input,
  Label,
} from "../../components/ui";

import { authService } from "../../services/auth.service";

interface OtpForm {
  otp: string;
}

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email ?? "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OtpForm>();

  const onSubmit = async (data: OtpForm) => {
    try {
      await authService.verifyOtp({
        email,
        otp: data.otp,
      });

      alert("Email verified successfully.");

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h2 className="mb-2 text-3xl font-bold text-white">
          Verify Email
        </h2>

        <p className="mb-8 text-slate-400">
          Enter the OTP sent to
        </p>

        <p className="mb-6 break-all text-blue-400">
          {email}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <Label>OTP</Label>

            <Input
            required
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              {...register("otp", {
                required: true,
              })}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full text-sm text-blue-400 hover:text-blue-300"
        >
          Back to Login
        </button>
      </Card>
    </div>
  );
}