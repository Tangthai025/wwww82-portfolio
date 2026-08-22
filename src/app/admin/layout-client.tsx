"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { usePathname } from "next/navigation";

export function AdminLayoutClient({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // If on login page, render full screen without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Format page title from pathname
  const segments = pathname.split("/").filter(Boolean);
  let title = "Dashboard";
  if (segments.length > 1) {
    const raw = segments[1];
    title = raw.charAt(0).toUpperCase() + raw.slice(1);
    if (segments.length > 2) {
      title += ` / ${segments[2].charAt(0).toUpperCase() + segments[2].slice(1)}`;
    }
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-text flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          title={`Admin / ${title}`}
          userEmail={userEmail}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
