"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Award,
  UserCheck,
  Image as ImageIcon,
  Layers,
  Menu as MenuIcon,
  Palette,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarGroup {
  group: string;
  links: SidebarLink[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: "Dashboard",
    links: [
      { label: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    group: "Content",
    links: [
      { label: "Projects", href: "/admin/projects", icon: <FolderGit2 className="w-4 h-4" /> },
      { label: "Write-ups", href: "/admin/writeups", icon: <BookOpen className="w-4 h-4" /> },
      { label: "Certifications", href: "/admin/certifications", icon: <Award className="w-4 h-4" /> },
    ],
  },
  {
    group: "Profile & Career",
    links: [
      { label: "Profile & Resume", href: "/admin/profile", icon: <UserCheck className="w-4 h-4" /> },
    ],
  },
  {
    group: "Media",
    links: [
      { label: "Media Library", href: "/admin/media", icon: <ImageIcon className="w-4 h-4" /> },
    ],
  },
  {
    group: "Website Structure",
    links: [
      { label: "Homepage Builder", href: "/admin/homepage", icon: <Layers className="w-4 h-4" /> },
      { label: "Navigation", href: "/admin/navigation", icon: <MenuIcon className="w-4 h-4" /> },
      { label: "Appearance", href: "/admin/appearance", icon: <Palette className="w-4 h-4" /> },
      { label: "SEO & Meta", href: "/admin/seo", icon: <Globe className="w-4 h-4" /> },
    ],
  },
  {
    group: "Settings",
    links: [
      { label: "Site Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      }
    } catch {
      error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0a0d12] border-r border-border flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Bar */}
        <div>
          <div className="h-16 px-5 border-b border-border flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-surface border border-primary/40">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-text tracking-wider">
                  wwww82 CMS
                </span>
                <span className="text-[10px] font-mono text-primary">ADMIN PORTAL</span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-muted hover:text-text p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted/80 font-semibold px-2 block">
                  {group.group}
                </span>
                <div className="space-y-0.5 pt-1">
                  {group.links.map((link) => {
                    const isActive =
                      link.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => onClose()}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-cyber text-xs font-mono transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                            : "text-muted hover:text-text hover:bg-surface border border-transparent"
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-[#07090c] space-y-2 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-cyber text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </div>
            <span className="text-[10px] text-primary">/public</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-cyber text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
