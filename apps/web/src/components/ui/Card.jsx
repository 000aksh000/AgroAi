import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Card = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-xl border border-[#E5E8DD] shadow-card p-5 sm:p-6 transition-all duration-150",
          hoverable && "hover:border-[#CCD3C0] hover:shadow-card-hover",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
