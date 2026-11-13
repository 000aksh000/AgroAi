import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const Badge = ({
  children,
  variant = "neutral",
  className,
  size = "md"
}) => {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    earth: "bg-earth-100 text-earth-800 border-earth-300"
  };
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs font-medium px-2.5 py-1"
  };
  return <span
    className={twMerge(
      clsx(
        "inline-flex items-center gap-1.5 rounded-full border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )
    )}
  >
      {children}
    </span>;
};
