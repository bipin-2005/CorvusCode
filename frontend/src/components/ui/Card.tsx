import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function Card({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        "border border-slate-200 dark:border-white/10",
        "bg-white dark:bg-[#111113]",
        "transition-colors duration-150",
        "hover:border-orange-500/40",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
