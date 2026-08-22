"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Search, Menu, X, Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

interface NavItem {
  label: string;
  path: string;
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Write-ups", path: "/writeups" },
  { label: "Certifications", path: "/certifications" },
  { label: "Resume", path: "/resume" },
  { label: "Contact", path: "/contact" },
];

export function Header({ items = DEFAULT_NAV }: { items?: NavItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { mode, setMode } = useTheme();

  const handleOpenSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-cyber bg-surface border border-primary/40 group-hover:border-primary group-hover:shadow-cyber-sm transition-all duration-300">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold text-base sm:text-lg tracking-wider text-text group-hover:text-primary transition-colors">
              wwww82
            </span>
            <span className="font-mono text-[10px] text-muted -mt-1 hidden sm:inline-block">
              SECURITY RESEARCHER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {items.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-all ${
                  isActive
                    ? "bg-surface-secondary text-primary font-semibold border border-primary/30 shadow-cyber-sm"
                    : "text-muted hover:text-text hover:bg-surface-secondary/50 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Search & Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={handleOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-cyber bg-surface border border-border text-muted hover:text-text hover:border-primary/40 text-xs font-mono transition-all"
            title="Search knowledge base (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary border border-border">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-cyber bg-surface border border-border text-muted hover:text-text transition-colors"
            title="Toggle theme mode"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-cyber bg-surface border border-border text-muted hover:text-text transition-colors"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {items.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-cyber text-sm font-mono transition-all ${
                  isActive
                    ? "bg-surface-secondary text-primary font-semibold border border-primary/30"
                    : "text-muted hover:text-text hover:bg-surface-secondary/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border/60">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted hover:text-primary"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
