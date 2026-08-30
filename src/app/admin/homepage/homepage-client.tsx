"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Layers,
  Terminal as TerminalIcon,
  Sparkles,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export interface HeroConfig {
  terminalUser?: string;
  whoami?: string;
  focus?: string[];
  status?: string;
  badgeText?: string;
  heading?: string;
  bio?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

interface SectionItem {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  isEnabled: boolean;
  order: number;
  configJson?: string;
}

export function HomepageClient({
  initialSections,
}: {
  initialSections: SectionItem[];
}) {
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(true);
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

  const handleHeroConfigChange = (field: keyof HeroConfig, val: any) => {
    setSections((prev) => {
      const copy = [...prev];
      const heroIdx = copy.findIndex((s) => s.sectionKey === "hero");
      if (heroIdx === -1) return prev;

      let currentConfig: HeroConfig = {};
      try {
        currentConfig = JSON.parse(copy[heroIdx].configJson || "{}");
      } catch {}

      currentConfig[field] = val;
      copy[heroIdx] = {
        ...copy[heroIdx],
        configJson: JSON.stringify(currentConfig),
      };
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
        success("Homepage layout & terminal settings saved successfully!");
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

  // Helper to parse hero config safely
  const heroSection = sections.find((s) => s.sectionKey === "hero");
  let heroConfig: HeroConfig = {};
  try {
    heroConfig = JSON.parse(heroSection?.configJson || "{}");
  } catch {}

  const terminalUser = heroConfig.terminalUser ?? "wwww82@sec";
  const whoamiVal = heroConfig.whoami ?? "wwww82 — Cybersecurity Researcher & Penetration Tester";
  const focusItems = Array.isArray(heroConfig.focus)
    ? heroConfig.focus
    : ["web-security", "security-research", "penetration-testing", "ctf"];
  const statusVal = heroConfig.status ?? "systems operational";
  const badgeVal = heroConfig.badgeText ?? "SECURITY RESEARCHER";
  const headingVal = heroConfig.heading ?? "wwww82";
  const bioVal =
    heroConfig.bio ??
    "Cybersecurity enthusiast focused on security research, web security, penetration testing, and technical exploration.";
  const primaryBtnTextVal = heroConfig.primaryBtnText ?? "View Projects";
  const primaryBtnLinkVal = heroConfig.primaryBtnLink ?? "/projects";
  const secondaryBtnTextVal = heroConfig.secondaryBtnText ?? "Read Write-ups";
  const secondaryBtnLinkVal = heroConfig.secondaryBtnLink ?? "/writeups";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-text">Layout & Section Settings</h2>
          <span className="text-xs font-mono text-muted">
            Customize active sections, rearrange order, and edit Hero Terminal content
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          className="font-mono shadow-cyber-green shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Homepage Layout
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((sec, idx) => {
          const isHero = sec.sectionKey === "hero";

          return (
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
                    {isHero ? <TerminalIcon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-text">
                        {sec.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-muted">
                        key: {sec.sectionKey}
                      </span>
                      {isHero && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Interactive Terminal
                        </span>
                      )}
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
                  label="Section Title / Name"
                  value={sec.title}
                  onChange={(e) => handleChange(idx, "title", e.target.value)}
                />
                <Input
                  label="Section Subtitle / Tagline"
                  value={sec.subtitle || ""}
                  onChange={(e) => handleChange(idx, "subtitle", e.target.value)}
                />
              </div>

              {/* Specialized Editor for Hero Terminal */}
              {isHero && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setHeroExpanded(!heroExpanded)}
                    className="w-full py-2.5 px-3.5 rounded-cyber bg-surface-secondary/70 hover:bg-surface-secondary border border-border flex items-center justify-between text-xs font-mono text-text transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-primary group-hover:rotate-45 transition-transform" />
                      <span className="font-semibold text-text group-hover:text-primary transition-colors">
                        Terminal & Hero Content Customization
                      </span>
                      <span className="text-[10px] text-muted font-normal">
                        (whoami, focus, status, bio & buttons)
                      </span>
                    </div>
                    {heroExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </button>

                  {heroExpanded && (
                    <div className="mt-4 space-y-6 p-4 rounded-cyber border border-border bg-[#0a0d13]/80">
                      {/* Grid: Form Inputs + Live Preview */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Inputs: 7 cols */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center gap-2 pb-1 border-b border-border/60 text-xs font-mono text-primary font-bold">
                            <TerminalIcon className="w-3.5 h-3.5" />
                            <span>Terminal Window Settings</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Terminal User / Title Bar"
                              placeholder="wwww82@sec"
                              value={terminalUser}
                              onChange={(e) =>
                                handleHeroConfigChange("terminalUser", e.target.value)
                              }
                              helperText="Shows in: terminal — user@sec"
                            />
                            <Input
                              label="Status Command Output"
                              placeholder="systems operational"
                              value={statusVal}
                              onChange={(e) =>
                                handleHeroConfigChange("status", e.target.value)
                              }
                              helperText="Shows in: $ status"
                            />
                          </div>

                          <Input
                            label="Whoami Command Output"
                            placeholder="wwww82 — Cybersecurity Researcher & Penetration Tester"
                            value={whoamiVal}
                            onChange={(e) =>
                              handleHeroConfigChange("whoami", e.target.value)
                            }
                            helperText="Shows in: $ whoami"
                          />

                          <Textarea
                            label="Focus Command Items (One per line)"
                            placeholder="web-security&#10;security-research&#10;penetration-testing&#10;ctf"
                            rows={4}
                            value={focusItems.join("\n")}
                            onChange={(e) => {
                              const lines = e.target.value
                                .split("\n")
                                .map((l) => l.trim())
                                .filter(Boolean);
                              handleHeroConfigChange("focus", lines);
                            }}
                            helperText="Shows in: $ focus with bullet arrows"
                          />

                          {/* Hero Left Column Text Settings */}
                          <div className="flex items-center gap-2 pt-3 pb-1 border-b border-border/60 text-xs font-mono text-secondary font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Hero Headline & CTA Buttons</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Badge Pill Text"
                              placeholder="SECURITY RESEARCHER"
                              value={badgeVal}
                              onChange={(e) =>
                                handleHeroConfigChange("badgeText", e.target.value)
                              }
                            />
                            <Input
                              label="Main Heading / Name"
                              placeholder="wwww82"
                              value={headingVal}
                              onChange={(e) =>
                                handleHeroConfigChange("heading", e.target.value)
                              }
                            />
                          </div>

                          <Textarea
                            label="Hero Bio Description"
                            placeholder="Cybersecurity enthusiast focused on..."
                            rows={3}
                            value={bioVal}
                            onChange={(e) =>
                              handleHeroConfigChange("bio", e.target.value)
                            }
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Primary Button Text"
                              value={primaryBtnTextVal}
                              onChange={(e) =>
                                handleHeroConfigChange("primaryBtnText", e.target.value)
                              }
                            />
                            <Input
                              label="Primary Button Link"
                              value={primaryBtnLinkVal}
                              onChange={(e) =>
                                handleHeroConfigChange("primaryBtnLink", e.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Secondary Button Text"
                              value={secondaryBtnTextVal}
                              onChange={(e) =>
                                handleHeroConfigChange("secondaryBtnText", e.target.value)
                              }
                            />
                            <Input
                              label="Secondary Button Link"
                              value={secondaryBtnLinkVal}
                              onChange={(e) =>
                                handleHeroConfigChange("secondaryBtnLink", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Live Terminal Preview: 5 cols */}
                        <div className="lg:col-span-5 space-y-2">
                          <span className="block text-xs font-mono font-medium text-muted uppercase tracking-wider">
                            Live Terminal Preview
                          </span>

                          <div className="rounded-cyber border border-border bg-[#080a0e] shadow-xl overflow-hidden font-mono text-xs">
                            {/* Window header */}
                            <div className="flex items-center justify-between px-3 py-2 bg-[#10141a] border-b border-border/80 text-[11px] text-muted">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                                <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                                <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
                                <span className="text-text/90 font-medium ml-1.5 truncate max-w-[180px]">
                                  terminal — {terminalUser || "wwww82@sec"}
                                </span>
                              </div>
                              <TerminalIcon className="w-3 h-3 text-primary/70 shrink-0" />
                            </div>

                            {/* Terminal content */}
                            <div className="p-3.5 space-y-3 max-h-80 overflow-y-auto">
                              {/* whoami */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-text font-medium">
                                  <span className="text-primary select-none">$</span>
                                  <span>whoami</span>
                                </div>
                                <div className="text-muted/90 pl-3 border-l border-border/40 text-[11px] break-words">
                                  {whoamiVal || "wwww82 — Cybersecurity Researcher"}
                                </div>
                              </div>

                              {/* focus */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-text font-medium">
                                  <span className="text-primary select-none">$</span>
                                  <span>focus</span>
                                </div>
                                <div className="text-secondary pl-3 border-l border-border/40 text-[11px] space-y-0.5">
                                  {focusItems.length > 0 ? (
                                    focusItems.map((f, i) => (
                                      <div key={i}>→ {f}</div>
                                    ))
                                  ) : (
                                    <div>→ web-security</div>
                                  )}
                                </div>
                              </div>

                              {/* status */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-text font-medium">
                                  <span className="text-primary select-none">$</span>
                                  <span>status</span>
                                </div>
                                <div className="text-primary pl-3 border-l border-border/40 text-[11px] font-bold flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse"></span>
                                  <span>● {statusVal || "systems operational"}</span>
                                </div>
                              </div>

                              {/* mock prompt input */}
                              <div className="flex items-center gap-1.5 text-[11px] pt-1 text-muted/60">
                                <span className="text-primary select-none">$</span>
                                <span>type &apos;help&apos; or command...</span>
                              </div>
                            </div>

                            {/* footer status */}
                            <div className="px-3 py-1 bg-[#0b0e14] border-t border-border/60 flex items-center justify-between text-[9px] text-muted">
                              <span>Interactive Shell</span>
                              <span className="text-primary/80">UTF-8 · zsh</span>
                            </div>
                          </div>

                          <div className="p-3 rounded bg-surface-secondary/50 border border-border/50 text-[11px] font-mono text-muted space-y-1">
                            <div className="text-text font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-secondary" />
                              <span>Left Column Preview</span>
                            </div>
                            <div className="truncate">
                              Badge: <span className="text-primary">{badgeVal}</span>
                            </div>
                            <div className="truncate">
                              Name: <span className="text-text">{headingVal}</span>
                            </div>
                            <div className="truncate">
                              CTA: <span className="text-secondary">{primaryBtnTextVal}</span> &{" "}
                              <span className="text-secondary">{secondaryBtnTextVal}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
