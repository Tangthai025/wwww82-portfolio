import React from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface TerminalBlockProps {
  title?: string;
  command: string;
  output?: string;
}

export function TerminalBlock({
  title = "terminal",
  command,
  output,
}: TerminalBlockProps) {
  return (
    <div className="my-6 rounded-cyber border border-border/90 bg-[#080a0e] overflow-hidden shadow-xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#10141a] border-b border-border/70 text-xs font-mono text-muted">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-text/80 font-medium ml-2">{title}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-primary/70">
          <TerminalIcon className="w-3 h-3" />
          <span>sh</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto space-y-2">
        {/* Command Line */}
        <div className="flex items-start gap-2 text-text font-medium">
          <span className="text-primary select-none">$</span>
          <span className="text-primary/95 break-all">{command}</span>
        </div>

        {/* Output */}
        {output && (
          <div className="text-muted/90 whitespace-pre-wrap leading-relaxed border-t border-border/30 pt-2 font-mono text-xs">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
