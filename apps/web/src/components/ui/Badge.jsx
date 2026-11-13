import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Badge = ({
  children,
  variant = "neutral",
  className,
  size = "md"
}) => {
  const variantStyles = {
    success: "bg-[#294C36]/50 text-[#A4D5A4] border-[#294C36]/80",
    leaf: "bg-[#294C36]/40 text-[#A4D5A4] border-[#3F7655]/60",
    gold: "bg-[#B69A62]/15 text-[#D4BE8D] border-[#B69A62]/35",
    warning: "bg-[#B69A62]/20 text-[#D4BE8D] border-[#B69A62]/40",
    danger: "bg-[#8B2E2E]/30 text-[#FCA5A5] border-[#8B2E2E]/60",
    info: "bg-[#1E3A5F]/40 text-[#93C5FD] border-[#2563EB]/40",
    neutral: "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30]",
    sand: "bg-[#18251D] text-[#D9CEB5] border-[#2D3B30]",
    soil: "bg-[#79563C]/35 text-[#D5BEA8] border-[#79563C]/60",
    earth: "bg-[#79563C]/35 text-[#D5BEA8] border-[#79563C]/60"
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5",
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
