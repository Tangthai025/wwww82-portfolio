import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold font-mono text-text">
          Create New Project
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Add a new cybersecurity tool, framework, or penetration testing case study.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
