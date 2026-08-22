import React from "react";

export type SeverityType = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL" | "DEFAULT";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "primary" | "secondary" | "severity";
  severity?: SeverityType;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  severity = "DEFAULT",
  className = "",
  children,
  ...props
}: BadgeProps) {
  let baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide transition-colors";

  if (variant === "severity" || severity !== "DEFAULT") {
    switch (severity) {
      case "CRITICAL":
        baseStyles += " bg-red-950/70 text-red-400 border border-red-800/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
        break;
      case "HIGH":
        baseStyles += " bg-orange-950/70 text-orange-400 border border-orange-800/80 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
        break;
      case "MEDIUM":
        baseStyles += " bg-amber-950/70 text-amber-400 border border-amber-800/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
        break;
      case "LOW":
        baseStyles += " bg-cyan-950/70 text-cyan-400 border border-cyan-800/80 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
        break;
      case "INFORMATIONAL":
      default:
        baseStyles += " bg-slate-800/80 text-slate-300 border border-slate-700";
        break;
    }
  } else {
    switch (variant) {
      case "primary":
        baseStyles += " bg-primary/10 text-primary border border-primary/30";
        break;
      case "secondary":
        baseStyles += " bg-secondary/10 text-secondary border border-secondary/30";
        break;
      case "outline":
        baseStyles += " border border-border text-muted";
        break;
      case "default":
      default:
        baseStyles += " bg-surface-secondary text-text border border-border/60";
        break;
    }
  }

  return (
    <span className={`${baseStyles} ${className}`} {...props}>
      {children}
    </span>
  );
}
