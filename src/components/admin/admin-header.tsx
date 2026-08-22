"use client";

import React from "react";
import Link from "next/link";
import { Menu, Shield, ExternalLink, User } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  onOpenSidebar: () => void;
  userEmail?: string;
}

export function AdminHeader({
  title = "Admin Dashboard",
  onOpenSidebar,
  userEmail = "admin@wwww82.sec",
}: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-[#0a0d12]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded bg-surface border border-border text-muted hover:text-text"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-sm sm:text-base font-bold font-mono text-text truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-cyber bg-surface border border-border text-xs font-mono text-muted hover:text-primary transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-cyber bg-surface border border-border text-xs font-mono text-text">
          <User className="w-3.5 h-3.5 text-primary" />
          <span className="hidden md:inline">{userEmail}</span>
          <span className="md:hidden">wwww82</span>
        </div>
      </div>
    </header>
  );
}
