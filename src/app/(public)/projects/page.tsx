import React from "react";
import { ProjectCard } from "@/components/public/project-card";
import { db } from "@/lib/db";
import { FolderGit2 } from "lucide-react";
import { ProjectsFilterGrid } from "./projects-client";

export const metadata = {
  title: "Security Projects & Case Studies — wwww82",
  description: "Explore security tools, automated attack surface frameworks, kernel fuzzers, and penetration testing case studies by wwww82.",
};

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });

  // Extract unique categories
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  // Serialize project objects for client component
  const serializedProjects = projects.map((p) => {
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(p.tags);
    } catch {}
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description,
      coverImage: p.coverImage,
      tags: parsedTags,
      year: p.year,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
          <FolderGit2 className="w-4 h-4" />
          <span>Security Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
          Security Projects & Research
        </h1>
        <p className="text-sm text-muted max-w-3xl leading-relaxed font-sans">
          Engineered security tools, distributed scanners, fuzzing harnesses, and comprehensive penetration testing case studies.
        </p>
      </div>

      {/* Interactive Filter & Projects Grid */}
      <ProjectsFilterGrid
        projects={serializedProjects}
        categories={categories}
      />
    </div>
  );
}
