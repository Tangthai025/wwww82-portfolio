import React from "react";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { CommandPalette } from "@/components/providers/command-palette";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation items from DB or fallback
  let navItems: { label: string; path: string }[] = [];
  let profile = null;

  try {
    const dbNav = await db.navigationItem.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
      select: { label: true, path: true },
    });
    if (dbNav && dbNav.length > 0) {
      navItems = dbNav;
    }
    profile = await db.profile.findFirst();
  } catch (error) {
    console.error("Public layout DB error:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text selection:bg-primary selection:text-black">
      <Header items={navItems.length > 0 ? navItems : undefined} />
      <main className="flex-1 w-full">{children}</main>
      <Footer
        github={profile?.github}
        linkedin={profile?.linkedin}
        twitter={profile?.twitter}
      />
      <CommandPalette />
    </div>
  );
}
