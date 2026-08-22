import React from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppearanceClient } from "./appearance-client";

export default async function AdminAppearancePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let theme = await db.themeSetting.findFirst();
  if (!theme) {
    theme = await db.themeSetting.create({
      data: { id: "default" },
    });
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-text">
          Appearance & Theme Design System
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          Customize global cyberpunk palettes, accent colors, glow intensities, and typography presets.
        </p>
      </div>

      <AppearanceClient initialTheme={theme} />
    </div>
  );
}
