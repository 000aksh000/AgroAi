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
    leaf: "bg-leaf-50 text-leaf-800 border-leaf-200/90",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-sand-100 text-soil-700 border-sand-200",
    sand: "bg-sand-100 text-soil-800 border-sand-300",
    soil: "bg-soil-100 text-soil-900 border-soil-300/80",
    earth: "bg-sand-100 text-soil-800 border-sand-300"
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs font-semibold px-2.5 py-1"
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium tracking-tight",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
