import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";

import Input from "./Input";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={`pr-12 ${className ?? ""}`}
        {...props}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword((prev) => !prev)
        }
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          rounded-md
          p-1
          text-slate-400
          transition-colors
          duration-150
          hover:bg-orange-500/10
          hover:text-orange-500
          dark:text-slate-500
          dark:hover:text-orange-400
          focus:outline-none
          focus:ring-2
          focus:ring-orange-500/20
        "
        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;