import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const LoadingSkeleton = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={twMerge(
            clsx("animate-pulse bg-[#202B22]/80 border border-[#2D3B30]/50 rounded-xl", className)
          )}
        />
      ))}
    </>
  );
};
