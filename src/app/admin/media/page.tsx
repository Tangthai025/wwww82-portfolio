import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const media = await db.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = media.map((m) => ({
    id: m.id,
    filename: m.filename,
    originalName: m.originalName,
    mimeType: m.mimeType,
    size: m.size,
    url: m.url,
    alt: m.alt,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Media & Storage Library
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Upload, manage, and inspect media assets, screenshots, diagrams, and PDF certificates.
        </p>
      </div>

      <MediaClient initialMedia={serialized} />
    </div>
  );
}
