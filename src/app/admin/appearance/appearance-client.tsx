"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { THEME_PRESETS, ThemePreset } from "@/lib/theme";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Save, Palette, Sparkles, Check, RefreshCw } from "lucide-react";

export function AppearanceClient({ initialTheme }: { initialTheme: any }) {
  const { setThemePreset, updateCustomTheme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<string>(
    initialTheme?.preset || "cyber-green"
  );
  const [primaryColor, setPrimaryColor] = useState(initialTheme?.primaryColor || "#39FF88");
  const [secondaryColor, setSecondaryColor] = useState(initialTheme?.secondaryColor || "#00D9FF");
  const [backgroundColor, setBackgroundColor] = useState(initialTheme?.backgroundColor || "#090B0F");
  const [surfaceColor, setSurfaceColor] = useState(initialTheme?.surfaceColor || "#10141A");
  const [surfaceSecondaryColor, setSurfaceSecondaryColor] = useState(initialTheme?.surfaceSecondaryColor || "#151A21");
  const [textColor, setTextColor] = useState(initialTheme?.textColor || "#E8EDF2");
  const [mutedColor, setMutedColor] = useState(initialTheme?.mutedColor || "#7D8996");
  const [borderColor, setBorderColor] = useState(initialTheme?.borderColor || "#26313A");
  const [borderRadius, setBorderRadius] = useState(initialTheme?.borderRadius || "6px");
  const [glowIntensity, setGlowIntensity] = useState(initialTheme?.glowIntensity || "normal");

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleApplyPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;

    setSelectedPreset(presetKey);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setBackgroundColor(preset.backgroundColor);
    setSurfaceColor(preset.surfaceColor);
    setSurfaceSecondaryColor(preset.surfaceSecondaryColor);
    setTextColor(preset.textColor);
    setMutedColor(preset.mutedColor);
    setBorderColor(preset.borderColor);
    setBorderRadius(preset.borderRadius);
    setGlowIntensity(preset.glowIntensity);

    setThemePreset(presetKey);
  };

  const handleColorChange = (setter: (val: string) => void, field: string, val: string) => {
    setter(val);
    updateCustomTheme({ [field]: val });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      preset: selectedPreset,
      primaryColor,
      secondaryColor,
      backgroundColor,
      surfaceColor,
      surfaceSecondaryColor,
      textColor,
      mutedColor,
      borderColor,
      borderRadius,
      glowIntensity,
    };

    try {
      const res = await fetch("/api/admin/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        success("Appearance theme saved & applied globally!");
        router.refresh();
      } else {
        error("Failed to save appearance settings");
      }
    } catch {
      error("Network error saving appearance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          Dynamic CSS variable customizer with instant live preview
        </span>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          className="font-mono"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Global Theme
        </Button>
      </div>

      {/* 1. Presets Selector */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-4">
        <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span>Curated Theme Presets</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => {
            const isSelected = selectedPreset === key;
            return (
              <div
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`p-4 rounded-cyber border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-surface-secondary shadow-cyber-sm"
                    : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-text">
                    {preset.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>

                {/* Swatches */}
                <div className="flex items-center gap-1.5 h-6 rounded overflow-hidden">
                  <span className="w-1/4 h-full" style={{ backgroundColor: preset.backgroundColor }} />
                  <span className="w-1/4 h-full" style={{ backgroundColor: preset.surfaceColor }} />
                  <span className="w-1/4 h-full" style={{ backgroundColor: preset.primaryColor }} />
                  <span className="w-1/4 h-full" style={{ backgroundColor: preset.secondaryColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Color Tokens */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <h2 className="text-sm font-bold font-mono text-secondary uppercase tracking-wider">
          Individual Color Tokens (Hex)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-muted uppercase">
              Primary Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(setPrimaryColor, "primaryColor", e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => handleColorChange(setPrimaryColor, "primaryColor", e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded text-xs font-mono text-text uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-muted uppercase">
              Secondary Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => handleColorChange(setSecondaryColor, "secondaryColor", e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => handleColorChange(setSecondaryColor, "secondaryColor", e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded text-xs font-mono text-text uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-muted uppercase">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleColorChange(setBackgroundColor, "backgroundColor", e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => handleColorChange(setBackgroundColor, "backgroundColor", e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded text-xs font-mono text-text uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-muted uppercase">
              Surface Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={surfaceColor}
                onChange={(e) => handleColorChange(setSurfaceColor, "surfaceColor", e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={surfaceColor}
                onChange={(e) => handleColorChange(setSurfaceColor, "surfaceColor", e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded text-xs font-mono text-text uppercase"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono text-muted uppercase">
              Glow Intensity
            </label>
            <select
              value={glowIntensity}
              onChange={(e) => {
                setGlowIntensity(e.target.value);
                updateCustomTheme({ glowIntensity: e.target.value as any });
              }}
              className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text"
            >
              <option value="none">None (Zero Blur)</option>
              <option value="subtle">Subtle</option>
              <option value="normal">Normal (Cyber)</option>
              <option value="intense">Intense Glow</option>
            </select>
          </div>

          <Input
            label="Border Radius"
            value={borderRadius}
            onChange={(e) => {
              setBorderRadius(e.target.value);
              updateCustomTheme({ borderRadius: e.target.value });
            }}
            placeholder="6px"
          />
        </div>
      </div>

      {/* 3. Live Preview Card */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-4">
        <h2 className="text-sm font-bold font-mono text-text uppercase tracking-wider">
          Live Render Canvas
        </h2>

        <div
          className="p-6 rounded-cyber border border-border space-y-4 shadow-cyber-sm"
          style={{ backgroundColor: surfaceColor }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold" style={{ color: primaryColor }}>
              SECURITY TELEMETRY PREVIEW
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-muted">
              SYSTEM ACTIVE
            </span>
          </div>
          <h3 className="text-xl font-bold font-mono text-text">
            Sample Component Header — wwww82
          </h3>
          <p className="text-xs text-muted leading-relaxed font-sans">
            Testing theme aesthetics: vibrant accents, obsidian dark surfaces, and accessible contrast ratios.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-mono font-bold rounded-cyber shadow-cyber-sm"
              style={{ backgroundColor: primaryColor, color: "#000" }}
            >
              Primary Action
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-mono font-bold rounded-cyber shadow-cyber-cyan"
              style={{ backgroundColor: secondaryColor, color: "#000" }}
            >
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
