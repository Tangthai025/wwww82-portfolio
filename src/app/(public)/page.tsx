import React from "react";
import Link from "next/link";
import { TerminalHero } from "@/components/public/terminal-hero";
import { StatsSection } from "@/components/public/stats-section";
import { ProjectCard } from "@/components/public/project-card";
import { WriteUpCard } from "@/components/public/writeup-card";
import { CertificationCard } from "@/components/public/certification-card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ArrowRight, FolderGit2, BookOpen, Award, Cpu, ShieldCheck, Mail } from "lucide-react";

export const revalidate = 60; // Revalidate every 60s

export default async function HomePage() {
  // Fetch live content from DB
  const [
    projects,
    writeups,
    certifications,
    skills,
    sections,
    profile,
    projectCount,
    writeupCount,
    certCount,
    experiences,
  ] = await Promise.all([
    db.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.writeUp.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.certification.findMany({
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.skill.findMany({
      orderBy: { order: "asc" },
      take: 12,
    }),
    db.homepageSection.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
    }),
    db.profile.findFirst(),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.writeUp.count({ where: { status: "PUBLISHED" } }),
    db.certification.count(),
    db.experience.findMany(),
  ]);

  // Calculate experience years
  const experienceYears = experiences.length > 0 ? Math.max(3, experiences.length) : 3;

  // Check section visibility map
  const sectionEnabled = (key: string) => {
    if (sections.length === 0) return true; // default all on
    const sec = sections.find((s) => s.sectionKey === key);
    return sec ? sec.isEnabled : true;
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      {sectionEnabled("hero") && <TerminalHero />}

      {/* 2. Stats Section */}
      {sectionEnabled("stats") && (
        <StatsSection
          projectCount={projectCount}
          writeupCount={writeupCount}
          certCount={certCount}
          experienceYears={experienceYears}
        />
      )}

      {/* 3. Featured Projects Section */}
      {sectionEnabled("featured_projects") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                <FolderGit2 className="w-4 h-4" />
                <span>Security Tools & Research</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-text">
                Featured Projects
              </h2>
            </div>
            <Link href="/projects">
              <Button variant="outline" size="sm" className="group font-mono">
                <span>View All Projects ({projectCount})</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              let parsedTags: string[] = [];
              try {
                parsedTags = JSON.parse(project.tags);
              } catch {}
              return (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  slug={project.slug}
                  category={project.category}
                  description={project.description}
                  coverImage={project.coverImage}
                  tags={parsedTags}
                  year={project.year}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Latest Write-ups Section */}
      {sectionEnabled("latest_writeups") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-secondary uppercase tracking-wider font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>Vulnerability Research & Write-ups</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-text">
                Latest Technical Write-ups
              </h2>
            </div>
            <Link href="/writeups">
              <Button variant="outline" size="sm" className="group font-mono">
                <span>View All Write-ups ({writeupCount})</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writeups.map((writeup) => (
              <WriteUpCard
                key={writeup.id}
                id={writeup.id}
                title={writeup.title}
                slug={writeup.slug}
                excerpt={writeup.excerpt}
                category={writeup.category}
                readingTime={writeup.readingTime}
                difficulty={writeup.difficulty}
                publishedAt={writeup.publishedAt}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Certifications Section */}
      {sectionEnabled("certifications") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                <Award className="w-4 h-4" />
                <span>Industry Accreditations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-text">
                Verified Certifications
              </h2>
            </div>
            <Link href="/certifications">
              <Button variant="outline" size="sm" className="group font-mono">
                <span>View All Credentials</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                id={cert.id}
                title={cert.title}
                issuer={cert.issuer}
                issueDate={cert.issueDate}
                credentialId={cert.credentialId}
                credentialUrl={cert.credentialUrl}
                certificateImage={cert.certificateImage}
                description={cert.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Technical Arsenal / Skills Section */}
      {sectionEnabled("skills") && skills.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-cyber border border-border bg-surface/80 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Technical Arsenal</span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-text">
                Core Competencies
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 rounded-cyber bg-surface-secondary/70 border border-border/70 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-colors group"
                >
                  <div className="text-xs font-mono font-medium text-text group-hover:text-primary transition-colors truncate">
                    {skill.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>{skill.category}</span>
                    <span className="text-primary font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center sm:text-right">
              <Link
                href="/resume"
                className="inline-flex items-center text-xs font-mono text-primary hover:underline"
              >
                <span>View Full Curriculum & Tools in Resume</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Contact Banner CTA */}
      {sectionEnabled("contact") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="relative rounded-cyber border border-primary/40 bg-gradient-to-r from-surface to-[#0d141e] p-8 sm:p-12 overflow-hidden shadow-cyber-sm">
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted Communications</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-text">
                Let&apos;s collaborate on Security Research & Assessment
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                Interested in vulnerability assessments, offensive security tooling, or technical collaboration? Send an encrypted dispatch or reach out directly.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg" className="font-mono">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Button>
                </Link>
                <Link href="/resume">
                  <Button variant="outline" size="lg" className="font-mono">
                    View Resume
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
