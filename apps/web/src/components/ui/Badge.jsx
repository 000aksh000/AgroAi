import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Badge = ({
  children,
  variant = "neutral",
  className,
  size = "md"
}) => {
  const variantStyles = {
    success: "bg-[#E4F4E4] text-[#174C35] border-[#C7E7C7]",
    leaf: "bg-[#F0F6F3] text-[#174C35] border-[#DCE9E2]",
    warning: "bg-[#FEF8E7] text-[#8B6548] border-[#FCEFC7]",
    danger: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]",
    info: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
    neutral: "bg-[#F7F8F2] text-[#202820] border-[#E5E8DD]",
    sand: "bg-[#F7F8F2] text-[#202820] border-[#E5E8DD]",
    soil: "bg-[#FAF6F2] text-[#735239] border-[#E6D7C8]",
    earth: "bg-[#FAF6F2] text-[#735239] border-[#E6D7C8]"
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs font-medium px-2.5 py-0.5"
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight",
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
