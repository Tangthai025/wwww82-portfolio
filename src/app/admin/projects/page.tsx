import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectsTableClient } from "./projects-table-client";

export default async function AdminProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const projects = await db.project.findMany({
    orderBy: { order: "asc" },
    include: {
      findings: true,
    },
  });

  const serialized = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    status: p.status,
    featured: p.featured,
    year: p.year,
    findingCount: p.findings.length,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-text flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <span>Projects & Case Studies</span>
          </h1>
          <p className="text-xs text-muted font-mono mt-1">
            Create, edit, and organize security tools, research frameworks, and vulnerability findings.
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="primary" size="sm" className="font-mono">
            <Plus className="w-4 h-4 mr-1.5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Table Client with deletion, duplicate, and live search */}
      <ProjectsTableClient initialProjects={serialized} />
    </div>
  );
}
