"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Eye, Copy, Search, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";

interface AdminProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  year: string;
  findingCount: number;
  updatedAt: string;
}

export function ProjectsTableClient({
  initialProjects,
}: {
  initialProjects: AdminProjectItem[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        success("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== deleteTargetId));
        setDeleteTargetId(null);
        router.refresh();
      } else {
        error("Failed to delete project");
      }
    } catch {
      error("Network error while deleting project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter projects by title, category, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-cyber text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs font-mono text-muted hidden sm:inline">
          Showing {filtered.length} of {projects.length}
        </span>
      </div>

      {/* Projects Table */}
      <div className="rounded-cyber border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0b0e14] border-b border-border text-muted uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Title & Slug</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Findings</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-surface/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No projects found matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-secondary/40 transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-text flex items-center gap-2">
                        {project.featured && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                        <span className="truncate max-w-xs">{project.title}</span>
                      </div>
                      <div className="text-[11px] text-muted">/{project.slug}</div>
                    </td>

                    <td className="p-3.5 text-muted">{project.category}</td>

                    <td className="p-3.5">
                      <Badge
                        variant={project.status === "PUBLISHED" ? "primary" : "outline"}
                      >
                        {project.status}
                      </Badge>
                    </td>

                    <td className="p-3.5">
                      <span className="text-xs text-text font-semibold">
                        {project.findingCount} Findings
                      </span>
                    </td>

                    <td className="p-3.5 text-muted">{project.year}</td>

                    <td className="p-3.5 text-right space-x-1">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-primary transition-colors"
                        title="View Live Case Study"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-flex p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-text transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteTargetId(project.id)}
                        className="inline-flex p-1.5 rounded bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Project Deletion"
        description="Are you sure you want to permanently remove this project and its security findings? This action cannot be undone."
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTargetId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Permanently Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
