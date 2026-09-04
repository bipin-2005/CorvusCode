import type { LabelHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "mb-2 block text-[11px] font-semibold uppercase tracking-wider",
        "text-slate-500 dark:text-slate-400",
        "select-none",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
