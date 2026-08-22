"use client";

import React, { useState, useMemo } from "react";
import { WriteUpCard, WriteUpCardProps } from "@/components/public/writeup-card";
import { Search } from "lucide-react";

interface WriteupsFilterGridProps {
  writeups: WriteUpCardProps[];
  categories: string[];
}

export function WriteupsFilterGrid({
  writeups,
  categories,
}: WriteupsFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("" );

  const filteredWriteups = useMemo(() => {
    return writeups.filter((item) => {
      const matchCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q);

      return matchCategory && matchQuery;
    });
  }, [writeups, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-all whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-secondary text-black font-semibold shadow-cyber-cyan"
                : "bg-surface border border-border text-muted hover:text-text hover:bg-surface-secondary"
            }`}
          >
            All Write-ups ({writeups.length})
          </button>
          {categories.map((cat) => {
            const count = writeups.filter((w) => w.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-secondary text-black font-semibold shadow-cyber-cyan"
                    : "bg-surface border border-border text-muted hover:text-text hover:bg-surface-secondary"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search write-ups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-cyber text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredWriteups.length === 0 ? (
        <div className="p-12 text-center rounded-cyber border border-dashed border-border text-muted text-xs font-mono">
          No write-ups match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWriteups.map((w) => (
            <WriteUpCard key={w.id} {...w} />
          ))}
        </div>
      )}
    </div>
  );
}
