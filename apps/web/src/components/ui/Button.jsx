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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-600 via-agri-600 to-leaf-700 text-white hover:from-emerald-700 hover:via-agri-700 hover:to-leaf-800 active:scale-[0.99] focus:ring-agri-500 shadow-sm shadow-agri-700/20",
    secondary:
      "bg-sand-100 text-soil-800 border border-sand-300 hover:bg-sand-200 active:bg-sand-300 focus:ring-sand-400 shadow-sm",
    earth:
      "bg-gradient-to-r from-soil-600 to-soil-700 text-white hover:from-soil-700 hover:to-soil-800 active:scale-[0.99] focus:ring-soil-500 shadow-sm shadow-soil-700/20",
    outline:
      "border border-sand-300 text-soil-800 bg-[#fffdfa] hover:bg-sand-50 hover:border-sand-400 focus:ring-sand-300 shadow-sm",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm",
    ghost:
      "text-soil-700 hover:bg-sand-100 active:bg-sand-200 focus:ring-sand-200"
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
