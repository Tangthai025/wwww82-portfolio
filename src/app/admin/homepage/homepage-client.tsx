"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronUp, ChevronDown, Eye, EyeOff, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface SectionItem {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  isEnabled: boolean;
  order: number;
}

export function HomepageClient({
  initialSections,
}: {
  initialSections: SectionItem[];
}) {
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleToggle = (idx: number) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], isEnabled: !copy[idx].isEnabled };
      return copy;
    });
  };

  const handleMove = (idx: number, dir: "up" | "down") => {
    setSections((prev) => {
      const copy = [...prev];
      const targetIdx = dir === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleChange = (idx: number, field: "title" | "subtitle", val: string) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (res.ok) {
        success("Homepage layout saved successfully!");
        router.refresh();
      } else {
        error("Failed to save homepage layout");
      }
    } catch {
      error("Network error saving homepage layout");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          Configure active sections and homepage order
        </span>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          className="font-mono"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Homepage Layout
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div
            key={sec.sectionKey}
            className={`p-5 rounded-cyber border transition-all ${
              sec.isEnabled
                ? "border-border bg-surface shadow-sm"
                : "border-border/40 bg-[#07090c] opacity-60"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-surface-secondary border border-border text-primary">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-text">
                      {sec.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
                      key: {sec.sectionKey}
                    </span>
                  </div>
                  {sec.subtitle && (
                    <div className="text-xs text-muted font-mono">{sec.subtitle}</div>
                  )}
                </div>
              </div>

              {/* Actions: Enable Toggle + Up/Down */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className={`px-3 py-1.5 rounded-cyber text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    sec.isEnabled
                      ? "bg-primary/10 border border-primary/40 text-primary font-bold"
                      : "bg-surface-secondary border border-border text-muted"
                  }`}
                >
                  {sec.isEnabled ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>ACTIVE</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>HIDDEN</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-text disabled:opacity-30"
                  title="Move Section Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1.5 rounded bg-surface-secondary border border-border text-muted hover:text-text disabled:opacity-30"
                  title="Move Section Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editable Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-border/40">
              <Input
                label="Section Heading"
                value={sec.title}
                onChange={(e) => handleChange(idx, "title", e.target.value)}
              />
              <Input
                label="Section Subtitle"
                value={sec.subtitle || ""}
                onChange={(e) => handleChange(idx, "subtitle", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
