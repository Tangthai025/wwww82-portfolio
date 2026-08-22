"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface NavItem {
  id?: string;
  label: string;
  path: string;
  isEnabled: boolean;
  isExternal: boolean;
  order: number;
}

export function NavigationClient({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        label: "New Link",
        path: "/custom",
        isEnabled: true,
        isExternal: false,
        order: prev.length,
      },
    ]);
  };

  const handleRemove = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToggle = (idx: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], isEnabled: !copy[idx].isEnabled };
      return copy;
    });
  };

  const handleMove = (idx: number, dir: "up" | "down") => {
    setItems((prev) => {
      const copy = [...prev];
      const targetIdx = dir === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleChange = (idx: number, field: "label" | "path", val: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        success("Navigation menu updated successfully!");
        router.refresh();
      } else {
        error("Failed to update navigation");
      }
    } catch {
      error("Network error updating navigation");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="font-mono"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Menu Link
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          className="font-mono"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Navigation
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-cyber border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              item.isEnabled
                ? "border-border bg-surface"
                : "border-border/40 bg-[#07090c] opacity-60"
            }`}
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Label"
                value={item.label}
                onChange={(e) => handleChange(idx, "label", e.target.value)}
              />
              <Input
                label="Target Path / Route"
                value={item.path}
                onChange={(e) => handleChange(idx, "path", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className={`p-2 rounded bg-surface-secondary border text-xs font-mono transition-colors ${
                  item.isEnabled ? "text-primary border-primary/40" : "text-muted border-border"
                }`}
                title={item.isEnabled ? "Disable Link" : "Enable Link"}
              >
                {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleMove(idx, "up")}
                disabled={idx === 0}
                className="p-2 rounded bg-surface-secondary border border-border text-muted hover:text-text disabled:opacity-30"
                title="Move Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleMove(idx, "down")}
                disabled={idx === items.length - 1}
                className="p-2 rounded bg-surface-secondary border border-border text-muted hover:text-text disabled:opacity-30"
                title="Move Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-2 rounded bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900/60 hover:text-red-200"
                title="Delete Link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
