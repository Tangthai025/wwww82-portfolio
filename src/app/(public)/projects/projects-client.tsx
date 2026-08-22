"use client";

import React, { useState, useMemo } from "react";
import { ProjectCard, ProjectCardProps } from "@/components/public/project-card";
import { Search } from "lucide-react";

interface ProjectsFilterGridProps {
  projects: ProjectCardProps[];
  categories: string[];
}

export function ProjectsFilterGrid({
  projects,
  categories,
}: ProjectsFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory =
        selectedCategory === "ALL" || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags?.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-all whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-primary text-black font-semibold shadow-cyber-sm"
                : "bg-surface border border-border text-muted hover:text-text hover:bg-surface-secondary"
            }`}
          >
            All Projects ({projects.length})
          </button>
          {categories.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-black font-semibold shadow-cyber-sm"
                    : "bg-surface border border-border text-muted hover:text-text hover:bg-surface-secondary"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-cyber text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-cyber border border-dashed border-border text-muted text-xs font-mono">
          No security projects match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
