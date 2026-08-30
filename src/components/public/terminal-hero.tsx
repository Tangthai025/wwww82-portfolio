"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Terminal as TerminalIcon, ArrowRight, Shield, BookOpen, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
}

export interface HeroConfig {
  terminalUser?: string;
  whoami?: string;
  focus?: string[];
  status?: string;
  badgeText?: string;
  heading?: string;
  bio?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

interface TerminalHeroProps {
  config?: HeroConfig;
  profile?: {
    name?: string | null;
    title?: string | null;
    bio?: string | null;
  } | null;
}

export function TerminalHero({ config, profile }: TerminalHeroProps = {}) {
  const terminalUser = config?.terminalUser || "wwww82@sec";
  const whoamiText =
    config?.whoami ||
    (profile?.name && profile?.title
      ? `${profile.name} — ${profile.title}`
      : "wwww82 — Cybersecurity Researcher & Penetration Tester");
  const focusItems =
    Array.isArray(config?.focus) && config.focus.length > 0
      ? config.focus
      : ["web-security", "security-research", "penetration-testing", "ctf"];
  const statusText = config?.status || "systems operational";

  const badgeText = config?.badgeText || profile?.title?.toUpperCase() || "SECURITY RESEARCHER";
  const heading = config?.heading || profile?.name || "wwww82";
  const bio =
    config?.bio ||
    profile?.bio ||
    "Cybersecurity enthusiast focused on security research, web security, penetration testing, and technical exploration.";
  const primaryBtnText = config?.primaryBtnText || "View Projects";
  const primaryBtnLink = config?.primaryBtnLink || "/projects";
  const secondaryBtnText = config?.secondaryBtnText || "Read Write-ups";
  const secondaryBtnLink = config?.secondaryBtnLink || "/writeups";

  const buildInitialHistory = (): CommandHistoryItem[] => [
    {
      command: "whoami",
      output: whoamiText,
    },
    {
      command: "focus",
      output: (
        <div className="space-y-0.5 text-secondary">
          {focusItems.map((item, idx) => (
            <div key={idx}>→ {item}</div>
          ))}
        </div>
      ),
    },
    {
      command: "status",
      output: (
        <span className="text-primary font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse"></span>
          ● {statusText}
        </span>
      ),
    },
  ];

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistoryItem[]>(buildInitialHistory);

  // Re-sync initial history when config changes
  useEffect(() => {
    setHistory(buildInitialHistory());
  }, [whoamiText, JSON.stringify(focusItems), statusText]);

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
        response = whoamiText;
        break;
      case "focus":
        response = focusItems.join(" · ");
        break;
      case "status":
        response = `● ${statusText} — all telemetry nominal`;
        break;
      case "skills":
        response = "Web Security, Kernel Fuzzing, eBPF, Burp Suite, Python, Go, Rust, C/C++, AWS IAM, Docker";
        break;
      case "certs":
        response = "OSCP, CRTE, eWPTXv2, CISSP, AWS Security Specialty, BSCP";
        break;
      case "projects":
        response = `Navigate to ${primaryBtnLink} to view all security tools and case studies`;
        break;
      case "writeups":
        response = `Navigate to ${secondaryBtnLink} to explore vulnerability research and CTF walkthroughs`;
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
              <span>{badgeText}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text font-mono">
              {heading}
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed font-sans">
              {bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={primaryBtnLink}>
                <Button variant="primary" size="lg" className="group">
                  <FolderGit2 className="w-4 h-4 mr-2" />
                  {primaryBtnText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={secondaryBtnLink}>
                <Button variant="outline" size="lg" className="group font-mono">
                  <BookOpen className="w-4 h-4 mr-2 text-secondary" />
                  {secondaryBtnText}
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
                  <span className="text-text/90 font-medium ml-2">terminal — {terminalUser}</span>
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
