import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HomepageClient } from "./homepage-client";

export default async function AdminHomepagePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const sections = await db.homepageSection.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Homepage Layout Builder
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Toggle, rearrange, and customize section headlines without editing code.
        </p>
      </div>

      <HomepageClient initialSections={sections} />
    </div>
  );
}
