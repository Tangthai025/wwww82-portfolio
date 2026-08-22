import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

export interface ProjectCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage?: string | null;
  tags?: string[];
  year?: string;
}

export function ProjectCard({
  title,
  slug,
  category,
  description,
  coverImage,
  tags = [],
  year = "2026",
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block h-full">
      <div className="h-full flex flex-col justify-between rounded-cyber border border-border bg-surface hover:border-primary/50 hover:shadow-cyber-sm transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative w-full h-48 bg-surface-secondary overflow-hidden border-b border-border/70">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-muted">
              <Shield className="w-12 h-12 text-primary/30" />
            </div>
          )}
          {/* Year badge overlay */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-border text-[10px] font-mono text-text">
            {year}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
              {category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-text font-mono group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tags & Action Link */}
          <div className="pt-3 border-t border-border/50 space-y-3">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-muted border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[10px] font-mono text-muted/60 self-center">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center text-xs font-mono font-medium text-primary group-hover:underline">
              <span>View Project</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
