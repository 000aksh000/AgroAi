import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const Card = ({ children, className, hoverable = false, ...props }) => {
  return <div
    className={twMerge(
      clsx(
        "bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 transition-all duration-200",
        hoverable && "hover:shadow-md hover:border-agri-300 hover:-translate-y-0.5",
        className
      )
    )}
    {...props}
  >
      {children}
    </div>;
};
