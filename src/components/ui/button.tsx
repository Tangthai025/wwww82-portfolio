import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "terminal";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    let styles = "inline-flex items-center justify-center font-medium rounded-cyber transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none";

    // Size variants
    switch (size) {
      case "sm":
        styles += " px-3 py-1.5 text-xs";
        break;
      case "lg":
        styles += " px-6 py-3 text-base font-semibold";
        break;
      case "icon":
        styles += " p-2 h-9 w-9";
        break;
      case "md":
      default:
        styles += " px-4 py-2 text-sm";
        break;
    }

    // Color variants
    switch (variant) {
      case "primary":
        styles += " bg-primary text-black font-semibold hover:bg-primary-hover shadow-cyber-sm hover:shadow-cyber-glow";
        break;
      case "secondary":
        styles += " bg-secondary text-black font-semibold hover:opacity-90 shadow-cyber-cyan";
        break;
      case "outline":
        styles += " border border-border bg-surface/50 text-text hover:bg-surface-secondary hover:border-primary/50 hover:text-primary";
        break;
      case "ghost":
        styles += " text-muted hover:text-text hover:bg-surface-secondary/60";
        break;
      case "danger":
        styles += " bg-red-900/60 text-red-200 border border-red-800 hover:bg-red-800/80 hover:text-white";
        break;
      case "terminal":
        styles += " font-mono border border-primary/40 bg-black/80 text-primary hover:bg-primary/10 hover:border-primary shadow-[0_0_10px_rgba(57,255,136,0.15)]";
        break;
    }

    return (
      <button
        ref={ref}
        className={`${styles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
