"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Eye, Search, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";

interface AdminWriteupItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  difficulty: string;
  readingTime: string;
  publishedAt: string | null;
}

export function WriteupsTableClient({
  initialWriteups,
}: {
  initialWriteups: AdminWriteupItem[];
}) {
  const [writeups, setWriteups] = useState(initialWriteups);
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const filtered = writeups.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase()) ||
      w.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/writeups/${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        success("Write-up deleted successfully");
        setWriteups((prev) => prev.filter((w) => w.id !== deleteTargetId));
        setDeleteTargetId(null);
        router.refresh();
      } else {
        error("Failed to delete write-up");
      }
    } catch {
      error("Network error while deleting write-up");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter write-ups by title, category, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-cyber text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-secondary"
          />
        </div>
        <span className="text-xs font-mono text-muted hidden sm:inline">
          Showing {filtered.length} of {writeups.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-cyber border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0b0e14] border-b border-border text-muted uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Title & Slug</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Reading Time</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-surface/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No technical write-ups match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((writeup) => (
                  <tr
                    key={writeup.id}
                    className="hover:bg-surface-secondary/40 transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-text flex items-center gap-2">
                        {writeup.featured && (
                          <Star className="w-3.5 h-3.5 text-secondary fill-secondary shrink-0" />
                        )}
                        <span className="truncate max-w-xs">{writeup.title}</span>
                      </div>
                      <div className="text-[11px] text-muted">/{writeup.slug}</div>
                    </td>

                    <td className="p-3.5 text-muted">{writeup.category}</td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border text-[10px] text-muted">
                        {writeup.difficulty}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant={writeup.status === "PUBLISHED" ? "secondary" : "outline"}
                      >
                        {writeup.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 opacity-60" />
                        {writeup.readingTime}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <Link
                        href={`/writeups/${writeup.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-secondary transition-colors"
                        title="View Live Write-up"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/writeups/${writeup.id}/edit`}
                        className="inline-flex p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-text transition-colors"
                        title="Edit Write-up"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteTargetId(writeup.id)}
                        className="inline-flex p-1.5 rounded bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-colors"
                        title="Delete Write-up"
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
        title="Confirm Write-up Deletion"
        description="Are you sure you want to delete this technical write-up? This action will permanently remove its blocks and content."
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
