import React from "react";
import Link from "next/link";
import { Shield, Key, Terminal, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

interface FooterProps {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export function Footer({
  github = "https://github.com/wwww82",
  linkedin = "https://linkedin.com/in/wwww82",
  twitter = "https://x.com/wwww82_sec",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/60 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-cyber bg-surface border border-primary/40">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono font-bold text-lg text-text tracking-wider">
                wwww82
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
              Cybersecurity portfolio and technical research knowledge base. Focused on offensive security, web application exploitation, kernel security, and defense engineering.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-text font-semibold uppercase tracking-wider text-[11px] text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/projects" className="hover:text-text transition-colors">
                  /projects
                </Link>
              </li>
              <li>
                <Link href="/writeups" className="hover:text-text transition-colors">
                  /writeups
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-text transition-colors">
                  /certifications
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-text transition-colors">
                  /resume
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-text transition-colors">
                  /about
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Communications & Security */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-text font-semibold uppercase tracking-wider text-[11px] text-secondary">
              Connect & Security
            </h4>
            <div className="flex flex-col space-y-2.5">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-text transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-text transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-text transition-colors"
                >
                  <TwitterIcon className="w-3.5 h-3.5" />
                  <span>Twitter / X</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              )}
              <Link
                href="/contact"
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors pt-1"
              >
                <Key className="w-3.5 h-3.5 text-primary" />
                <span>PGP Public Key</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div>
            © {currentYear} <span className="text-text font-medium">wwww82</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-muted">
              Built with Next.js 15 & Prisma
            </span>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-muted/80 hover:text-primary transition-colors text-[11px]"
            >
              <Terminal className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
