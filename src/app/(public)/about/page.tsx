import React from "react";
import { db } from "@/lib/db";
import { Shield, Target, Compass, BookOpen, Wrench } from "lucide-react";

export const metadata = {
  title: "About wwww82 — Security Philosophy & Focus",
  description: "Learn about wwww82's offensive security background, security research methodology, areas of interest, and philosophy.",
};

export default async function AboutPage() {
  const [profile, tools] = await Promise.all([
    db.profile.findFirst(),
    db.tool.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
          <Shield className="w-4 h-4" />
          <span>Operator Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
          About {profile?.name || "wwww82"}
        </h1>
        <p className="text-sm font-mono text-primary">
          {profile?.title || "Cybersecurity Researcher & Penetration Tester"}
        </p>
      </div>

      {/* 1. About Me */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-text flex items-center gap-2">
          <span className="text-primary">#</span>
          <span>About Me</span>
        </h2>
        <div className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-6 rounded-cyber border border-border space-y-4">
          <p>
            {profile?.bio ||
              "I am an offensive security researcher and penetration tester specializing in web applications, cloud IAM architectures, and kernel-level vulnerabilities. My mission is to identify security flaws before malicious actors can exploit them."}
          </p>
          <p className="text-muted text-xs sm:text-sm">
            I approach security from an adversary-first mindset: understanding the architecture thoroughly, challenging trust boundaries, and constructing verifiable proof-of-concept exploits to assist engineering teams in hardening defenses.
          </p>
        </div>
      </section>

      {/* 2. Security Philosophy */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-text flex items-center gap-2">
          <Compass className="w-5 h-5 text-secondary" />
          <span>Security Philosophy</span>
        </h2>
        <div className="p-6 rounded-cyber bg-surface border border-secondary/30 space-y-3">
          <blockquote className="italic text-base sm:text-lg text-text font-sans border-l-2 border-secondary pl-4 py-1">
            &ldquo;{profile?.philosophy || "Offense informs defense. True resilience comes from understanding adversarial mental models, scrutinizing edge cases, and automating security verification at every layer."}&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm text-muted font-sans pt-2">
            Security cannot be achieved purely through checkboxes or perimeter firewalls. Modern applications require deep defense-in-depth, continuous validation, and zero-trust verification between microservices.
          </p>
        </div>
      </section>

      {/* 3. Areas of Interest & Current Focus */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-text flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <span>Areas of Interest & Current Focus</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-cyber bg-surface border border-border space-y-2">
            <h3 className="text-sm font-bold font-mono text-primary">
              Offensive Web & API Exploitation
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Complex authorization bypasses (BOLA/IDOR), GraphQL resolver vulnerabilities, SSRF in cloud metadata engines, and JWT validation bypasses.
            </p>
          </div>
          <div className="p-5 rounded-cyber bg-surface border border-border space-y-2">
            <h3 className="text-sm font-bold font-mono text-secondary">
              Linux Kernel & eBPF Security
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Driver vulnerability research, memory fuzzer instrumentation with AFL++, and kernel observability using low-overhead eBPF tracepoints.
            </p>
          </div>
          <div className="p-5 rounded-cyber bg-surface border border-border space-y-2">
            <h3 className="text-sm font-bold font-mono text-amber-400">
              Cloud IAM Graph Exploitation
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Multi-account AWS permission graph analysis, indirect privilege escalation paths, and automated remediation policy synthesis.
            </p>
          </div>
          <div className="p-5 rounded-cyber bg-surface border border-border space-y-2">
            <h3 className="text-sm font-bold font-mono text-purple-400">
              Security Automation & Tooling
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Engineering high-concurrency attack surface reconnaissance pipelines and continuous regression fuzzers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Tools I Use */}
      {tools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-text flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Tools & Arsenal</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="p-3.5 rounded-cyber bg-surface border border-border text-xs font-mono space-y-1"
              >
                <div className="font-bold text-text flex items-center justify-between">
                  <span>{tool.name}</span>
                  <span className="text-[10px] text-primary">{tool.category}</span>
                </div>
                {tool.description && (
                  <p className="text-muted font-sans text-xs">{tool.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
