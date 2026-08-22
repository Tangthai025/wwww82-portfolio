"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Terminal as TerminalIcon, ArrowRight, Shield, BookOpen, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
}

export function TerminalHero() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "whoami",
      output: "wwww82 — Cybersecurity Researcher & Penetration Tester",
    },
    {
      command: "focus",
      output: (
        <div className="space-y-0.5 text-secondary">
          <div>→ web-security</div>
          <div>→ security-research</div>
          <div>→ penetration-testing</div>
          <div>→ ctf</div>
        </div>
      ),
    },
    {
      command: "status",
      output: (
        <span className="text-primary font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse"></span>
          ● systems operational
        </span>
      ),
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response: string | React.ReactNode = "";

    switch (cmd) {
      case "help":
        response = "Available commands: whoami, focus, status, skills, certs, projects, writeups, clear, date, flag";
        break;
      case "whoami":
        response = "wwww82 — Cybersecurity Researcher & Penetration Tester";
        break;
      case "focus":
        response = "web-security · security-research · penetration-testing · ctf · cloud-security";
        break;
      case "status":
        response = "● systems operational — all telemetry nominal";
        break;
      case "skills":
        response = "Web Security, Kernel Fuzzing, eBPF, Burp Suite, Python, Go, Rust, C/C++, AWS IAM, Docker";
        break;
      case "certs":
        response = "OSCP, CRTE, eWPTXv2, CISSP, AWS Security Specialty, BSCP";
        break;
      case "projects":
        response = "Navigate to /projects to view all security tools and case studies";
        break;
      case "writeups":
        response = "Navigate to /writeups to explore vulnerability research and CTF walkthroughs";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "flag":
      case "cat flag.txt":
        response = "🚩 FLAG{wwww82_pr0f3ss10n4l_s3cur1ty_r3s34rch3r}";
        break;
      case "date":
        response = new Date().toUTCString();
        break;
      default:
        response = `command not found: ${cmd}. Type 'help' for available commands.`;
        break;
    }

    setHistory((prev) => [...prev, { command: input, output: response }]);
    setInput("");
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background cyber glow gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-primary text-xs font-mono tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>SECURITY RESEARCHER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text font-mono">
              wwww82
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed font-sans">
              Cybersecurity enthusiast focused on <span className="text-text font-medium">security research</span>, <span className="text-text font-medium">web security</span>, <span className="text-text font-medium">penetration testing</span>, and technical exploration.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/projects">
                <Button variant="primary" size="lg" className="group">
                  <FolderGit2 className="w-4 h-4 mr-2" />
                  View Projects
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/writeups">
                <Button variant="outline" size="lg" className="group font-mono">
                  <BookOpen className="w-4 h-4 mr-2 text-secondary" />
                  Read Write-ups
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Box */}
          <div className="lg:col-span-5">
            <div className="rounded-cyber border border-border bg-[#080a0e]/95 backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#10141a] border-b border-border/80 text-xs font-mono text-muted">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block"></span>
                  </div>
                  <span className="text-text/90 font-medium ml-2">terminal — wwww82@sec</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary/70">
                  <TerminalIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Terminal Command Execution Window */}
              <div ref={terminalBodyRef} className="p-4 font-mono text-xs sm:text-[13px] h-64 overflow-y-auto space-y-3 select-text">
                {history.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-text font-medium">
                      <span className="text-primary select-none">$</span>
                      <span>{item.command}</span>
                    </div>
                    <div className="text-muted/90 pl-4 border-l border-border/40">
                      {item.output}
                    </div>
                  </div>
                ))}

                {/* Input prompt */}
                <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
                  <span className="text-primary select-none">$</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="type 'help' or command..."
                    className="flex-1 bg-transparent text-text placeholder:text-muted/40 focus:outline-none font-mono text-xs sm:text-[13px]"
                  />
                </form>
              </div>

              {/* Terminal Status Bar */}
              <div className="px-4 py-1.5 bg-[#0b0e14] border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted">
                <span>Interactive Shell</span>
                <span className="text-primary/80">UTF-8 · zsh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
