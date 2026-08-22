import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [profile, experiences, skills, tools] = await Promise.all([
    db.profile.findFirst(),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.skill.findMany({ orderBy: { order: "asc" } }),
    db.tool.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Profile, Experience, Skills & Resume
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Update your public identity, bio, work history, skill proficiencies, and resume file.
        </p>
      </div>

      <ProfileClient
        initialProfile={profile}
        initialExperiences={experiences}
        initialSkills={skills}
        initialTools={tools}
      />
    </div>
  );
}
