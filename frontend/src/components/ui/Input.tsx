import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        // Layout
        "w-full rounded-md px-3.5 py-2.5 text-sm",

        // Background & Text
        "bg-white text-slate-900",
        "dark:bg-[#0a0a0b] dark:text-white",
        "placeholder:text-slate-400 dark:placeholder:text-slate-600",

        // Border
        "border border-slate-300 dark:border-white/15",

        // Hover
        "hover:border-slate-400 dark:hover:border-white/25",

        // Focus
        "focus:outline-none",
        "focus:border-orange-500",
        "focus:ring-2",
        "focus:ring-orange-500/15",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        // Error
        "aria-invalid:border-rose-500",
        "aria-invalid:ring-2",
        "aria-invalid:ring-rose-500/15",

        // Animation
        "transition-colors duration-150",

        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
