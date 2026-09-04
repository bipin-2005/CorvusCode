import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full rounded-md px-4 py-2.5 text-sm font-semibold tracking-tight transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0a0a0b]",
        "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",

        {
          // Flat, confident fill — no gradient/glow, this is a "Submit" button, not a landing-page CTA
          "bg-orange-500 text-white hover:bg-orange-400":
            variant === "primary",

          "border border-slate-300 bg-transparent text-slate-700 hover:border-orange-500/50 hover:text-orange-600 dark:border-white/15 dark:text-slate-200 dark:hover:border-orange-500/50 dark:hover:text-orange-400":
            variant === "secondary",

          "bg-rose-600 text-white hover:bg-rose-500":
            variant === "danger",

          "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white":
            variant === "ghost",
        },

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
