import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WriteUpForm } from "../writeup-form";

export default async function NewWriteupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold font-mono text-text">
          Create New Technical Write-up
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Compose structured cybersecurity articles with code snippets, interactive terminals, and security finding blocks.
        </p>
      </div>

      <WriteUpForm />
    </div>
  );
}
