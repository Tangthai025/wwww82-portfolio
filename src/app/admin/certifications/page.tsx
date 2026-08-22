import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CertificationsClient } from "./certifications-client";

export default async function AdminCertificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const certifications = await db.certification.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Certifications & Accreditations Manager
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Add, edit, and organize verified credentials and badge images.
        </p>
      </div>

      <CertificationsClient initialCertifications={certifications} />
    </div>
  );
}
