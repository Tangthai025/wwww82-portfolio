import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SeoClient } from "./seo-client";

export default async function AdminSeoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const settings = await db.siteSetting.findMany();
  const map = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          SEO & Open Graph Meta Manager
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Configure search engine indexing, Open Graph social share cards, and Twitter meta.
        </p>
      </div>

      <SeoClient initialSeo={map} />
    </div>
  );
}
