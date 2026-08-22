import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  FolderGit2,
  BookOpen,
  Award,
  Image as ImageIcon,
  Briefcase,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [
    projectCount,
    writeupCount,
    certCount,
    experienceCount,
    mediaCount,
    revisions,
    profile,
  ] = await Promise.all([
    db.project.count(),
    db.writeUp.count(),
    db.certification.count(),
    db.experience.count(),
    db.media.count(),
    db.revision.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.profile.findFirst(),
  ]);

  const stats = [
    { label: "Projects", count: projectCount, href: "/admin/projects", icon: <FolderGit2 className="w-5 h-5 text-primary" /> },
    { label: "Write-ups", count: writeupCount, href: "/admin/writeups", icon: <BookOpen className="w-5 h-5 text-secondary" /> },
    { label: "Certifications", count: certCount, href: "/admin/certifications", icon: <Award className="w-5 h-5 text-amber-400" /> },
    { label: "Experience Records", count: experienceCount, href: "/admin/profile", icon: <Briefcase className="w-5 h-5 text-purple-400" /> },
    { label: "Media Assets", count: mediaCount, href: "/admin/media", icon: <ImageIcon className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-cyber border border-border bg-[#0e1218] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHENTICATED AS {profile?.name || "wwww82"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-text">
            Welcome back, {profile?.name || "wwww82"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans max-w-xl">
            Manage your cybersecurity case studies, vulnerability write-ups, credentials, and telemetry without touching source code.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/writeups/new">
            <Button variant="primary" size="sm" className="font-mono">
              <Plus className="w-4 h-4 mr-1.5" />
              New Write-up
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button variant="outline" size="sm" className="font-mono">
              <Plus className="w-4 h-4 mr-1.5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="p-5 rounded-cyber bg-surface border border-border hover:border-primary/40 hover:shadow-cyber-sm transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-text group-hover:text-primary transition-colors">
                {stat.count}
              </span>
              <div className="p-2 rounded bg-surface-secondary border border-border/60">
                {stat.icon}
              </div>
            </div>
            <div className="text-xs font-mono font-medium text-text group-hover:text-primary transition-colors">
              {stat.label}
            </div>
            <div className="flex items-center text-[10px] font-mono text-muted group-hover:text-primary mt-1">
              <span>Manage</span>
              <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Main Row: Recent Activity & Quick Configs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity Stream */}
        <div className="lg:col-span-8 p-6 rounded-cyber border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-sm sm:text-base font-bold font-mono text-text">
                Recent CMS Audit & Revisions
              </h2>
            </div>
            <span className="text-xs font-mono text-muted">Latest {revisions.length}</span>
          </div>

          {revisions.length === 0 ? (
            <p className="text-xs font-mono text-muted p-4 text-center">
              No recent revisions recorded.
            </p>
          ) : (
            <div className="space-y-3 divide-y divide-border/30">
              {revisions.map((rev) => {
                const dateStr = new Date(rev.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={rev.id}
                    className="pt-3 first:pt-0 flex items-start justify-between gap-4 text-xs font-mono"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-[10px] text-primary">
                          {rev.entityType}
                        </span>
                        <span className="text-text font-medium">{rev.title}</span>
                      </div>
                    </div>
                    <span className="text-muted text-[11px] shrink-0">{dateStr}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links / Site Modules */}
        <div className="lg:col-span-4 p-6 rounded-cyber border border-border bg-surface space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Layers className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-bold font-mono text-text">
              Quick Management
            </h2>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <Link
              href="/admin/homepage"
              className="flex items-center justify-between p-2.5 rounded bg-surface-secondary hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
            >
              <span>Homepage Layout Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/appearance"
              className="flex items-center justify-between p-2.5 rounded bg-surface-secondary hover:bg-secondary/10 hover:text-secondary transition-colors border border-border/60"
            >
              <span>Theme & Colors Customizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/navigation"
              className="flex items-center justify-between p-2.5 rounded bg-surface-secondary hover:bg-amber-500/10 hover:text-amber-400 transition-colors border border-border/60"
            >
              <span>Navigation Menu Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center justify-between p-2.5 rounded bg-surface-secondary hover:bg-purple-500/10 hover:text-purple-400 transition-colors border border-border/60"
            >
              <span>Upload Images & PDFs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center justify-between p-2.5 rounded bg-surface-secondary hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors border border-border/60"
            >
              <span>Edit About & Resume PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
