"use client";

import React, { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="my-6">
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden border border-border bg-surface rounded-cyber p-3 mb-6">
        <button
          onClick={() => setIsOpenMobile((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-mono font-semibold text-text uppercase tracking-wider"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            <span>Table of Contents ({items.length})</span>
          </div>
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpenMobile && (
          <ul className="mt-3 pt-3 border-t border-border space-y-2 text-xs font-mono">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsOpenMobile(false)}
                  className={`block py-1 hover:text-primary transition-colors ${
                    activeId === item.id ? "text-primary font-bold" : "text-muted"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border/80 text-xs font-mono font-semibold text-text uppercase tracking-wider">
          <List className="w-4 h-4 text-primary" />
          <span>Table of Contents</span>
        </div>

        <ul className="space-y-2 text-xs font-mono">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} style={{ paddingLeft: `${Math.max(0, (item.level - 2) * 12)}px` }}>
                <a
                  href={`#${item.id}`}
                  className={`block py-1 transition-all border-l-2 pl-2.5 ${
                    isActive
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted hover:text-text hover:border-border"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
