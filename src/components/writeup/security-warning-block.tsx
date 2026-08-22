import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface SecurityWarningBlockProps {
  title?: string;
  content: string;
}

export function SecurityWarningBlock({
  title = "Security Note & Responsible Disclosure",
  content,
}: SecurityWarningBlockProps) {
  return (
    <div className="my-6 p-4 rounded-cyber border border-amber-500/40 bg-amber-950/20 text-text space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
      <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs sm:text-sm font-semibold">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>⚠ {title}</span>
      </div>
      <div className="text-xs sm:text-sm text-text/80 leading-relaxed font-sans pl-6">
        {content}
      </div>
    </div>
  );
}
