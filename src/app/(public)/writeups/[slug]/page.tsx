import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { WriteUpDetailClient } from "./writeup-detail-client";
import { WriteUpCard } from "@/components/public/writeup-card";
import { ArrowLeft, Clock, Calendar, Shield, Share2 } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writeup = await db.writeUp.findUnique({
    where: { slug },
  });

  if (!writeup) {
    return { title: "Write-up Not Found — wwww82" };
  }

  return {
    title: `${writeup.seoTitle || writeup.title} — wwww82`,
    description: writeup.seoDescription || writeup.excerpt,
  };
}

export default async function WriteUpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = await db.writeUp.findUnique({
    where: { slug },
  });

  if (!writeup || writeup.status !== "PUBLISHED") {
    notFound();
  }

  const formattedDate = writeup.publishedAt
    ? new Date(writeup.publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recent";

  // Related write-ups
  const relatedWriteups = await db.writeUp.findMany({
    where: {
      status: "PUBLISHED",
      category: writeup.category,
      id: { not: writeup.id },
    },
    take: 2,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back navigation */}
      <div>
        <Link
          href="/writeups"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-secondary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all write-ups</span>
        </Link>
      </div>

      {/* Header Metadata */}
      <header className="space-y-4 border-b border-border/80 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
            {writeup.category}
          </span>
          <span className="text-xs text-muted font-mono">·</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
            {writeup.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-text leading-tight">
          {writeup.title}
        </h1>

        <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-3xl">
          {writeup.excerpt}
        </p>

        {/* Author and Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-muted border-t border-border/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text font-medium">
              <Shield className="w-4 h-4 text-primary" />
              <span>wwww82</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              <span>{formattedDate}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              <span>{writeup.readingTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image if present */}
      {writeup.coverImage && (
        <div className="relative w-full h-64 sm:h-[400px] rounded-cyber overflow-hidden border border-border bg-surface-secondary">
          <Image
            src={writeup.coverImage}
            alt={writeup.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Structured Content & Sticky TOC */}
      <WriteUpDetailClient
        content={writeup.content}
        isMarkdown={writeup.isMarkdown}
      />

      {/* Related Write-ups Footer */}
      {relatedWriteups.length > 0 && (
        <div className="pt-16 border-t border-border space-y-6">
          <h3 className="text-xl font-bold font-mono text-text">
            Related Technical Write-ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedWriteups.map((rw) => (
              <WriteUpCard
                key={rw.id}
                id={rw.id}
                title={rw.title}
                slug={rw.slug}
                excerpt={rw.excerpt}
                category={rw.category}
                readingTime={rw.readingTime}
                difficulty={rw.difficulty}
                publishedAt={rw.publishedAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
