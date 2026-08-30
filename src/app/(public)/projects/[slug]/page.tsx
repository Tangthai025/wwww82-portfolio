import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { FindingBlock } from "@/components/writeup/finding-block";
import { SeverityType } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Wrench,
  Cpu,
  Shield,
  Layers,
  Bug,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return { title: "Project Not Found — wwww82" };
  }

  return {
    title: `${project.seoTitle || project.title} — wwww82`,
    description: project.seoDescription || project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
    include: {
      findings: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  let tools: string[] = [];
  let technologies: string[] = [];
  let tags: string[] = [];

  try {
    tools = JSON.parse(project.tools);
  } catch {}
  try {
    technologies = JSON.parse(project.technologies);
  } catch {}
  try {
    tags = JSON.parse(project.tags);
  } catch {}

  // Related projects
  const relatedProjects = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      category: project.category,
      id: { not: project.id },
    },
    take: 2,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all projects</span>
        </Link>
      </div>

      {/* Project Header & Meta */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              {project.category}
            </span>
            <span className="text-xs text-muted font-mono">·</span>
            <span className="text-xs font-mono text-muted">{project.year}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-text leading-tight">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-muted font-sans leading-relaxed pt-2">
            {project.description}
          </p>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-cyber bg-surface border border-border text-xs font-mono">
          <div className="space-y-1">
            <span className="text-muted text-[11px] uppercase block">Role</span>
            <div className="flex items-center gap-1.5 text-text font-medium">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>{project.role}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted text-[11px] uppercase block">Timeline</span>
            <div className="flex items-center gap-1.5 text-text font-medium">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              <span>{project.year} ({project.duration})</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted text-[11px] uppercase block">Category</span>
            <div className="flex items-center gap-1.5 text-text font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.category}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted text-[11px] uppercase block">Status</span>
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span>VERIFIED CASE STUDY</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="group relative w-full rounded-cyber overflow-hidden border border-border bg-surface-secondary/40 flex items-center justify-center">
            <a
              href={project.coverImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full cursor-zoom-in"
              title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                width={1200}
                height={800}
                unoptimized
                className="w-full h-auto max-h-[80vh] object-contain rounded-cyber mx-auto transition-transform duration-200 hover:scale-[1.005]"
                priority
              />
            </a>
          </div>
        )}

        {/* Tools & Technologies Pills */}
        {(tools.length > 0 || technologies.length > 0 || tags.length > 0) && (
          <div className="p-5 rounded-cyber bg-surface/50 border border-border/80 space-y-3">
            {tools.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-muted flex items-center gap-1.5 mr-2">
                  <Wrench className="w-3.5 h-3.5 text-primary" /> Tools:
                </span>
                {tools.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-surface-secondary border border-border text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {technologies.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-muted flex items-center gap-1.5 mr-2">
                  <Cpu className="w-3.5 h-3.5 text-secondary" /> Technologies:
                </span>
                {technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-surface-secondary border border-border text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Case Study Deep Dive Body */}
      <div className="space-y-10 border-t border-border/80 pt-10">
        <h2 className="text-2xl font-bold font-mono text-text flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>Case Study Analysis</span>
        </h2>

        {/* 1. Overview */}
        {project.caseStudyOverview && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              1. Overview & Context
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-5 rounded-cyber border border-border/60">
              {project.caseStudyOverview}
            </p>
          </div>
        )}

        {/* 2. Problem Statement */}
        {project.caseStudyProblem && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              2. Problem Statement
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-5 rounded-cyber border border-border/60">
              {project.caseStudyProblem}
            </p>
          </div>
        )}

        {/* 3. Objective */}
        {project.caseStudyObjective && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              3. Objective & Scope
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-5 rounded-cyber border border-border/60">
              {project.caseStudyObjective}
            </p>
          </div>
        )}

        {/* 4. Technical Approach */}
        {project.caseStudyApproach && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              4. Technical Approach
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-5 rounded-cyber border border-border/60">
              {project.caseStudyApproach}
            </p>
          </div>
        )}

        {/* 5. Architecture */}
        {project.caseStudyArchitecture && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              5. System & Threat Architecture
            </h3>
            <div className="p-5 rounded-cyber bg-[#0b0e14] border border-border font-mono text-xs sm:text-sm text-secondary leading-relaxed overflow-x-auto">
              {project.caseStudyArchitecture}
            </div>
          </div>
        )}

        {/* 6. Implementation */}
        {project.caseStudyImplementation && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary">
              6. Implementation Details
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/40 p-5 rounded-cyber border border-border/60">
              {project.caseStudyImplementation}
            </p>
          </div>
        )}

        {/* 7. Security Analysis & Findings */}
        {project.findings.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">
                <Bug className="w-4 h-4" />
                <span>Vulnerability Findings</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-text">
                Key Security Findings & Impact Assessment
              </h3>
            </div>

            <div className="space-y-4">
              {project.findings.map((f) => (
                <FindingBlock
                  key={f.id}
                  title={f.title}
                  severity={f.severity as SeverityType}
                  impact={f.impact}
                  recommendation={f.recommendation}
                />
              ))}
            </div>
          </div>
        )}

        {/* 8. Results */}
        {project.caseStudyResult && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Results & Impact</span>
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-primary/5 p-5 rounded-cyber border border-primary/20">
              {project.caseStudyResult}
            </p>
          </div>
        )}

        {/* 9. Lessons Learned */}
        {project.caseStudyLessons && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold font-mono text-secondary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>Lessons Learned & Defense Hardening</span>
            </h3>
            <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-secondary/5 p-5 rounded-cyber border border-secondary/20">
              {project.caseStudyLessons}
            </p>
          </div>
        )}
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <h3 className="text-lg font-bold font-mono text-text">
            Related Security Research
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map((rp) => (
              <Link
                key={rp.id}
                href={`/projects/${rp.slug}`}
                className="p-5 rounded-cyber border border-border bg-surface hover:border-primary/40 transition-colors group block space-y-2"
              >
                <span className="text-[10px] font-mono text-primary uppercase">
                  {rp.category}
                </span>
                <h4 className="text-sm font-bold font-mono text-text group-hover:text-primary transition-colors">
                  {rp.title}
                </h4>
                <p className="text-xs text-muted line-clamp-2">{rp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
