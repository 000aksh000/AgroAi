import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-tight";

  const variants = {
    primary:
      "bg-[#174C35] text-white hover:bg-[#123D2A] active:bg-[#0E2E1F] focus:ring-[#174C35]/40 shadow-xs",
    secondary:
      "bg-[#F0F6F3] text-[#174C35] border border-[#DCE9E2] hover:bg-[#E4F4E4] focus:ring-[#174C35]/30",
    earth:
      "bg-[#8B6548] text-white hover:bg-[#735239] active:bg-[#5A3F2C] focus:ring-[#8B6548]/40 shadow-xs",
    outline:
      "border border-[#DCE1D3] text-[#202820] bg-white hover:bg-[#F7F8F2] hover:border-[#CCD3C0] focus:ring-[#174C35]/30 shadow-2xs",
    danger:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] focus:ring-red-500/40 shadow-xs",
    ghost:
      "text-[#202820] hover:bg-[#F0F2EB] hover:text-[#174C35] focus:ring-[#174C35]/20"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5"
  };

  return (
    <button
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
