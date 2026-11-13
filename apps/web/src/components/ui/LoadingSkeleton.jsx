import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const LoadingSkeleton = ({ className, count = 1 }) => {
  return <>
      {Array.from({ length: count }).map((_, i) => <div
    key={i}
    className={twMerge(
      clsx("animate-pulse bg-slate-200 rounded-lg", className)
    )}
  />)}
    </>;
};
