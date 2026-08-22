import React from "react";
import { Badge, SeverityType } from "@/components/ui/badge";
import { ShieldCheck, Bug } from "lucide-react";

interface FindingBlockProps {
  title: string;
  severity: SeverityType;
  impact: string;
  recommendation: string;
}

export function FindingBlock({
  title,
  severity,
  impact,
  recommendation,
}: FindingBlockProps) {
  return (
    <div className="my-6 rounded-cyber border border-border bg-surface p-5 space-y-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-primary shrink-0" />
          <h4 className="text-sm sm:text-base font-semibold text-text font-mono">{title}</h4>
        </div>
        <Badge variant="severity" severity={severity}>
          {severity}
        </Badge>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block mb-1">
            Impact
          </span>
          <p className="text-text/90 leading-relaxed bg-surface-secondary/50 p-3 rounded-cyber border border-border/40 font-sans">
            {impact}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Remediation Recommendation
          </span>
          <p className="text-text/90 leading-relaxed bg-primary/5 p-3 rounded-cyber border border-primary/20 font-sans">
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
