import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { WriteUpForm } from "../../writeup-form";

export default async function EditWriteupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const writeup = await db.writeUp.findUnique({
    where: { id },
  });

  if (!writeup) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold font-mono text-text">
          Edit Write-up: {writeup.title}
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Update article content, code blocks, or publish status.
        </p>
      </div>

      <WriteUpForm initialData={writeup} isEditing />
    </div>
  );
}
