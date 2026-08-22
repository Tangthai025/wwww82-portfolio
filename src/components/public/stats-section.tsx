import React from "react";
import { FolderGit2, BookOpen, Award, Clock } from "lucide-react";

interface StatsProps {
  projectCount: number;
  writeupCount: number;
  certCount: number;
  experienceYears?: number;
}

export function StatsSection({
  projectCount,
  writeupCount,
  certCount,
  experienceYears = 3,
}: StatsProps) {
  const stats = [
    {
      label: "Security Projects",
      value: `${projectCount}`,
      sub: "Tools & Frameworks",
      icon: <FolderGit2 className="w-5 h-5 text-primary" />,
    },
    {
      label: "Technical Write-ups",
      value: `${writeupCount}`,
      sub: "Research & Exploitation",
      icon: <BookOpen className="w-5 h-5 text-secondary" />,
    },
    {
      label: "Certifications",
      value: `${certCount}`,
      sub: "Verified Credentials",
      icon: <Award className="w-5 h-5 text-amber-400" />,
    },
    {
      label: "Experience",
      value: `${experienceYears}+`,
      sub: "Years in Offense/Defense",
      icon: <Clock className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <section className="py-12 border-y border-border/80 bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-cyber bg-surface border border-border hover:border-primary/40 hover:shadow-cyber-sm transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-text group-hover:text-primary transition-colors">
                  {stat.value}
                </span>
                <div className="p-2 rounded bg-surface-secondary border border-border/60">
                  {stat.icon}
                </div>
              </div>
              <div className="text-xs sm:text-sm font-semibold font-mono text-text">
                {stat.label}
              </div>
              <div className="text-[11px] text-muted font-mono mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
