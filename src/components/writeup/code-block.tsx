"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-powershell";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLang = language.toLowerCase().trim() || "bash";

  return (
    <div className="my-6 rounded-cyber border border-border bg-[#0b0e14] overflow-hidden shadow-lg group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121720] border-b border-border/80 text-xs font-mono">
        <div className="flex items-center gap-2 text-muted">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-text font-medium">{filename || `${cleanLang}`}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-primary/80 uppercase">
            {cleanLang}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-muted hover:text-primary transition-colors p-1 rounded"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-primary">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className={`language-${cleanLang} !m-0 !p-0 !bg-transparent text-xs sm:text-sm font-mono leading-relaxed`}>
          <code className={`language-${cleanLang}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
