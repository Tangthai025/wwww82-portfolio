"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderGit2, BookOpen, Award, Cpu, ArrowRight, X } from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "project" | "writeup" | "certification" | "skill" | "page";
  url: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch search results from API or query
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    if (!query.trim()) {
      // Default quick navigation links
      setResults([
        { id: "nav-home", title: "Home", subtitle: "Overview & Telemetry", category: "page", url: "/" },
        { id: "nav-projects", title: "Projects", subtitle: "Security Tools & Case Studies", category: "page", url: "/projects" },
        { id: "nav-writeups", title: "Write-ups", subtitle: "Technical Research & CTF Analysis", category: "page", url: "/writeups" },
        { id: "nav-certifications", title: "Certifications", subtitle: "Verified Accreditations", category: "page", url: "/certifications" },
        { id: "nav-resume", title: "Resume", subtitle: "Curriculum Vitae", category: "page", url: "/resume" },
        { id: "nav-about", title: "About", subtitle: "Philosophy & Focus", category: "page", url: "/about" },
        { id: "nav-contact", title: "Contact", subtitle: "PGP & Communications", category: "page", url: "/contact" },
      ]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = useCallback(
    (url: string) => {
      setIsOpen(false);
      router.push(url);
    },
    [router]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-surface border border-border rounded-cyber shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-secondary/50">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search projects, write-ups, certifications, skills... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted hover:text-text p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted hidden sm:inline-block">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/30">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-muted">
              Scanning knowledge base...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-muted">
              No matching records found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              let icon = <ArrowRight className="w-4 h-4 text-muted" />;
              let categoryLabel = "PAGE";

              if (item.category === "project") {
                icon = <FolderGit2 className="w-4 h-4 text-primary" />;
                categoryLabel = "PROJECT";
              } else if (item.category === "writeup") {
                icon = <BookOpen className="w-4 h-4 text-secondary" />;
                categoryLabel = "WRITE-UP";
              } else if (item.category === "certification") {
                icon = <Award className="w-4 h-4 text-amber-400" />;
                categoryLabel = "CERT";
              } else if (item.category === "skill") {
                icon = <Cpu className="w-4 h-4 text-purple-400" />;
                categoryLabel = "SKILL";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-cyber cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-surface-secondary text-text border border-primary/40 shadow-cyber-sm"
                      : "text-muted hover:bg-surface-secondary/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded bg-surface border border-border shrink-0">
                      {icon}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-text font-mono truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-muted truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      {categoryLabel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-surface-secondary/60 border-t border-border text-[11px] font-mono text-muted">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-primary/70">wwww82 security index</span>
        </div>
      </div>
    </div>
  );
}
