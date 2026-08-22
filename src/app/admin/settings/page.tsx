import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Site & Security Settings
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Manage admin authentication credentials and platform telemetry.
        </p>
      </div>

      <SettingsClient currentUserEmail={user.email} />
    </div>
  );
}
