import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavigationClient } from "./navigation-client";

export default async function AdminNavigationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const items = await db.navigationItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Header Navigation CMS
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Customize navigation bar labels, paths, visibility, and display sequence.
        </p>
      </div>

      <NavigationClient initialItems={items} />
    </div>
  );
}
