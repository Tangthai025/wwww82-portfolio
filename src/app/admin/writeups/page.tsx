import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WriteupsTableClient } from "./writeups-table-client";

export default async function AdminWriteupsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const writeups = await db.writeUp.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = writeups.map((w) => ({
    id: w.id,
    title: w.title,
    slug: w.slug,
    category: w.category,
    status: w.status,
    featured: w.featured,
    difficulty: w.difficulty,
    readingTime: w.readingTime,
    publishedAt: w.publishedAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" />
            <span>Technical Write-ups CMS</span>
          </h1>
          <p className="text-xs text-muted font-mono mt-1">
            Author vulnerability research, CTF walkthroughs, and technical cybersecurity documentation.
          </p>
        </div>

        <Link href="/admin/writeups/new">
          <Button variant="primary" size="sm" className="font-mono">
            <Plus className="w-4 h-4 mr-1.5" />
            New Write-up
          </Button>
        </Link>
      </div>

      {/* Table Client */}
      <WriteupsTableClient initialWriteups={serialized} />
    </div>
  );
}
