import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Card = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-[#fffefb] rounded-2xl border border-sand-200/80 shadow-warm p-5 sm:p-6 transition-all duration-200",
          hoverable && "hover:shadow-warm-md hover:border-leaf-400 hover:-translate-y-0.5",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
