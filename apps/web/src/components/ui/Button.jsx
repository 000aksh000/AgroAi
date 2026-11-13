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
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101B16] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-tight";

  const variants = {
    primary:
      "bg-[#294C36] text-[#F0EBDD] hover:bg-[#346045] active:bg-[#1F3A2A] border border-[#B69A62]/30 shadow-subtle hover:shadow-gold-glow focus:ring-[#B69A62]/40",
    secondary:
      "bg-[#18251D] text-[#D9CEB5] border border-[#2D3B30] hover:bg-[#202B22] hover:border-[#B69A62]/30 focus:ring-[#71805A]/40",
    earth:
      "bg-[#79563C] text-[#F0EBDD] hover:bg-[#8E6749] active:bg-[#5C402B] border border-[#B69A62]/30 shadow-subtle focus:ring-[#B69A62]/40",
    outline:
      "border border-[#B69A62]/40 text-[#D9CEB5] bg-transparent hover:bg-[#18251D] hover:text-[#F0EBDD] hover:border-[#B69A62] focus:ring-[#B69A62]/30",
    danger:
      "bg-[#8B2E2E] text-[#F0EBDD] hover:bg-[#A33535] active:bg-[#722323] border border-red-900/50 focus:ring-red-500/40 shadow-subtle",
    ghost:
      "text-[#A5AA96] hover:bg-[#18251D] hover:text-[#F0EBDD] focus:ring-[#B69A62]/20"
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
