"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function SeoClient({ initialSeo }: { initialSeo: Record<string, string> }) {
  const [siteTitle, setSiteTitle] = useState(
    initialSeo.siteTitle || "wwww82 — Cybersecurity Portfolio & Technical Write-ups"
  );
  const [siteDescription, setSiteDescription] = useState(
    initialSeo.siteDescription ||
      "Cybersecurity portfolio, vulnerability research, penetration testing case studies, and technical write-ups by wwww82."
  );
  const [keywords, setKeywords] = useState(
    initialSeo.keywords || "Cybersecurity, Security Research, Penetration Testing, Web Security, CTF, wwww82"
  );
  const [ogImage, setOgImage] = useState(initialSeo.ogImage || "");
  const [twitterHandle, setTwitterHandle] = useState(
    initialSeo.twitterHandle || "@wwww82_sec"
  );
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seo: {
            siteTitle,
            siteDescription,
            keywords,
            ogImage,
            twitterHandle,
          },
        }),
      });

      if (res.ok) {
        success("SEO meta configurations saved!");
        router.refresh();
      } else {
        error("Failed to save SEO settings");
      }
    } catch {
      error("Network error saving SEO");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          Global default metadata for search crawlers & social cards
        </span>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="font-mono"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save SEO Meta
        </Button>
      </div>

      <div className="p-6 rounded-cyber border border-border bg-surface space-y-4">
        <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Global Search Engine Meta</span>
        </h2>

        <Input
          label="Default Site Title *"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          required
        />

        <Textarea
          label="Default Meta Description *"
          rows={3}
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          required
        />

        <Input
          label="Meta Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <Input
          label="Default Open Graph / Twitter Share Image URL"
          placeholder="https://... or /uploads/og-image.jpg"
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
        />

        <Input
          label="Twitter / X Creator Handle"
          placeholder="@wwww82_sec"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
        />
      </div>
    </form>
  );
}
