import React from "react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Download,
  Briefcase,
  Award,
  Cpu,
  Wrench,
  Shield,
  MapPin,
  Mail,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Curriculum Vitae / Resume — wwww82",
  description: "Professional resume, work history, penetration testing experience, tools, and technical competencies of wwww82.",
};

export default async function ResumePage() {
  const [profile, experiences, certifications, skills, tools, projects] = await Promise.all([
    db.profile.findFirst(),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.certification.findMany({ orderBy: { order: "asc" } }),
    db.skill.findMany({ orderBy: { order: "asc" } }),
    db.tool.findMany({ orderBy: { order: "asc" } }),
    db.project.findMany({ where: { status: "PUBLISHED" }, take: 4 }),
  ]);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Resume Header */}
      <div className="p-8 rounded-cyber border border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>CURRICULUM VITAE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-text">
            {profile?.name || "wwww82"}
          </h1>
          <p className="text-sm font-mono text-primary">
            {profile?.title || "Cybersecurity Researcher & Penetration Tester"}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted pt-2">
            {profile?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                {profile.location}
              </span>
            )}
            {profile?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-muted" />
                {profile.email}
              </span>
            )}
          </div>
        </div>

        {/* Download Action */}
        <div>
          <a
            href={profile?.resumeUrl || "#"}
            download={Boolean(profile?.resumeUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg" className="font-mono shadow-cyber-sm">
              <Download className="w-4 h-4 mr-2" />
              Download Resume (PDF)
            </Button>
          </a>
        </div>
      </div>

      {/* Summary / Bio */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-mono text-primary flex items-center gap-2 border-b border-border/60 pb-2">
          <Shield className="w-4 h-4" />
          <span>Professional Summary</span>
        </h2>
        <p className="text-sm sm:text-base text-text/90 leading-relaxed font-sans bg-surface/50 p-5 rounded-cyber border border-border/60">
          {profile?.bio ||
            "Cybersecurity professional specialized in penetration testing, offensive security research, and vulnerability assessments with extensive experience in web security, cloud IAM defense, and kernel research."}
        </p>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold font-mono text-primary flex items-center gap-2 border-b border-border/60 pb-2">
          <Briefcase className="w-4 h-4" />
          <span>Professional Experience</span>
        </h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-border/60">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 space-y-1.5">
              {/* Dot */}
              <span className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-base font-bold font-mono text-text">
                  {exp.role}
                </h3>
                <span className="text-xs font-mono text-primary">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>

              <div className="text-xs font-mono text-muted">
                {exp.company} {exp.location && `· ${exp.location}`}
              </div>

              <p className="text-xs sm:text-sm text-text/80 font-sans leading-relaxed pt-1">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Competencies & Skills */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold font-mono text-secondary flex items-center gap-2 border-b border-border/60 pb-2">
          <Cpu className="w-4 h-4" />
          <span>Technical Competencies</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(skillsByCategory).map(([category, items]) => (
            <div key={category} className="p-4 rounded-cyber bg-surface border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-surface-secondary text-text border border-border/60"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Tools */}
      {tools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-mono text-amber-400 flex items-center gap-2 border-b border-border/60 pb-2">
            <Wrench className="w-4 h-4" />
            <span>Security Arsenal & Tools</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tools.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-cyber bg-surface border border-border/70 text-xs font-mono space-y-1"
              >
                <div className="font-bold text-text truncate">{t.name}</div>
                <div className="text-[10px] text-muted truncate">{t.category}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Certifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-amber-400 flex items-center gap-2 border-b border-border/60 pb-2">
          <Award className="w-4 h-4" />
          <span>Certifications & Accreditations</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-cyber bg-surface border border-border flex items-center justify-between text-xs font-mono"
            >
              <div>
                <div className="font-semibold text-text">{c.title}</div>
                <div className="text-muted text-[11px]">{c.issuer}</div>
              </div>
              <span className="text-[11px] text-primary">{c.issueDate}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
