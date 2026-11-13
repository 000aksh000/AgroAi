import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Card = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-[#202B22]/95 rounded-2xl border border-[#2D3B30] text-[#F0EBDD] shadow-card p-5 sm:p-6 transition-all duration-200",
          hoverable && "hover:border-[#B69A62]/40 hover:bg-[#253227] hover:shadow-card-hover cursor-pointer",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
