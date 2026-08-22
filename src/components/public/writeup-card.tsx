import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface WriteUpCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert" | string;
  publishedAt?: string | Date | null;
  tags?: string[];
}

export function WriteUpCard({
  title,
  slug,
  excerpt,
  category,
  readingTime = "8 min read",
  difficulty = "Intermediate",
  publishedAt,
  tags = [],
}: WriteUpCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recent";

  return (
    <Link href={`/writeups/${slug}`} className="group block h-full">
      <div className="h-full flex flex-col justify-between rounded-cyber border border-border bg-surface p-5 sm:p-6 hover:border-secondary/50 hover:shadow-cyber-cyan transition-all duration-300 transform hover:-translate-y-1">
        <div className="space-y-3">
          {/* Header Metadata */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-secondary">
              {category}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
              {difficulty}
            </span>
          </div>

          {/* Title & Excerpt */}
          <h3 className="text-base sm:text-lg font-bold text-text font-mono group-hover:text-secondary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted font-sans line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Footer Meta: Date + Reading Time + Read CTA */}
        <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {formattedDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {readingTime}
            </span>
          </div>

          <div className="flex items-center font-medium text-secondary group-hover:underline">
            <span>Read Write-up</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
