import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { AdminLayoutClient } from "./layout-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Note: We also protect in individual pages or route middleware
  return (
    <AdminLayoutClient userEmail={user?.email}>
      {children}
    </AdminLayoutClient>
  );
}
