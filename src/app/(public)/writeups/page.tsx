import React from "react";
import { db } from "@/lib/db";
import { BookOpen } from "lucide-react";
import { WriteupsFilterGrid } from "./writeups-client";

export const metadata = {
  title: "Technical Write-ups & Research — wwww82",
  description: "In-depth cybersecurity write-ups, vulnerability deep-dives, exploit walkthroughs, and CTF analyses by wwww82.",
};

export default async function WriteupsPage() {
  const writeups = await db.writeUp.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  const categories = Array.from(new Set(writeups.map((w) => w.category)));

  const serialized = writeups.map((w) => ({
    id: w.id,
    title: w.title,
    slug: w.slug,
    excerpt: w.excerpt,
    category: w.category,
    readingTime: w.readingTime,
    difficulty: w.difficulty,
    publishedAt: w.publishedAt?.toISOString() || null,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-secondary uppercase tracking-wider font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Security Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
          Technical Write-ups & Research
        </h1>
        <p className="text-sm text-muted max-w-3xl leading-relaxed font-sans">
          Technical walkthroughs, authorization exploit mechanics, eBPF telemetry, memory forensics, and CTF challenges.
        </p>
      </div>

      {/* Filter and Cards */}
      <WriteupsFilterGrid writeups={serialized} categories={categories} />
    </div>
  );
}
