import React from "react";
import { db } from "@/lib/db";
import { ContactClient } from "./contact-client";
import { Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Secure Contact & PGP — wwww82",
  description: "Get in touch with wwww82 for cybersecurity assessments, security research collaboration, or PGP encrypted communications.",
};

export default async function ContactPage() {
  const profile = await db.profile.findFirst();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
          <Shield className="w-4 h-4" />
          <span>Communications Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
          Let&apos;s Connect
        </h1>
        <p className="text-sm text-muted max-w-2xl leading-relaxed font-sans">
          Reach out for penetration testing inquiries, vulnerability research briefings, or security consultations. Encrypted channels supported.
        </p>
      </div>

      {/* Social Links Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profile?.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-cyber border border-border bg-surface hover:border-primary/40 transition-colors flex items-center gap-3 group"
          >
            <GithubIcon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            <div>
              <div className="text-xs font-mono font-bold text-text">GitHub</div>
              <div className="text-[11px] font-mono text-muted">@wwww82</div>
            </div>
          </a>
        )}
        {profile?.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-cyber border border-border bg-surface hover:border-secondary/40 transition-colors flex items-center gap-3 group"
          >
            <LinkedinIcon className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" />
            <div>
              <div className="text-xs font-mono font-bold text-text">LinkedIn</div>
              <div className="text-[11px] font-mono text-muted">/in/wwww82</div>
            </div>
          </a>
        )}
        {profile?.twitter && (
          <a
            href={profile.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-cyber border border-border bg-surface hover:border-sky-400/40 transition-colors flex items-center gap-3 group"
          >
            <TwitterIcon className="w-5 h-5 text-muted group-hover:text-sky-400 transition-colors" />
            <div>
              <div className="text-xs font-mono font-bold text-text">Twitter / X</div>
              <div className="text-[11px] font-mono text-muted">@wwww82_sec</div>
            </div>
          </a>
        )}
      </div>

      {/* Form & PGP details */}
      <ContactClient
        email={profile?.email || "contact@wwww82.sec"}
        pgpKey={profile?.pgpKey}
      />
    </div>
  );
}
