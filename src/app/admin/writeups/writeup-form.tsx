"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { WriteUpRenderer } from "@/components/writeup/writeup-renderer";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Terminal,
  Code,
  AlertTriangle,
  Bug,
  Image as ImageIcon,
  Table as TableIcon,
  Sparkles,
  Eye,
  FileText,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { SeverityType } from "@/components/ui/badge";

const WRITEUP_CATEGORIES = [
  "Web Security",
  "CTF",
  "Pentesting",
  "Forensics",
  "OSINT",
  "Cloud Security",
  "Security Research",
  "Security Tools",
  "Network Security",
];

const CODE_LANGUAGES = [
  "bash",
  "python",
  "javascript",
  "typescript",
  "c",
  "cpp",
  "go",
  "rust",
  "sql",
  "json",
  "yaml",
  "html",
  "powershell",
];

export interface WriteUpBlockFormItem {
  id?: string;
  type: string;
  data: Record<string, any>;
}

interface WriteUpFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function WriteUpForm({ initialData, isEditing = false }: WriteUpFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Editor mode: "blocks" or "markdown"
  const [editorMode, setEditorMode] = useState<"blocks" | "markdown">(
    initialData?.isMarkdown ? "markdown" : "blocks"
  );

  // Metadata
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "Web Security");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "Intermediate");
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags
      ? (typeof initialData.tags === "string" ? JSON.parse(initialData.tags) : initialData.tags).join(", ")
      : ""
  );

  // Markdown Raw
  const [markdownContent, setMarkdownContent] = useState<string>(
    initialData?.isMarkdown
      ? (typeof initialData.content === "string" ? initialData.content : "")
      : ""
  );

  // Structured Blocks
  const [blocks, setBlocks] = useState<WriteUpBlockFormItem[]>(() => {
    if (!initialData?.content) {
      return [
        {
          type: "warning",
          data: {
            title: "Ethical Research Notice",
            content: "All testing demonstrated was performed inside an authorized lab environment.",
          },
        },
        {
          type: "heading",
          data: { level: 2, text: "1. Vulnerability Analysis & Technical Overview" },
        },
        {
          type: "paragraph",
          data: { text: "Provide the detailed vulnerability context and root-cause analysis here." },
        },
      ];
    }
    try {
      const parsed = typeof initialData.content === "string" ? JSON.parse(initialData.content) : initialData.content;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [{ type: "paragraph", data: { text: initialData.content } }];
    }
  });

  const handleAutoSlug = () => {
    const s = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    setSlug(s);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockIdx?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (blockIdx !== undefined) {
          updateBlockData(blockIdx, "url", data.url);
        } else {
          setCoverImage(data.url);
        }
        success("Image uploaded successfully!");
      } else {
        error(data.error || "Upload failed");
      }
    } catch {
      error("Network error during file upload");
    }
  };

  // Block management helpers
  const addBlock = (type: string) => {
    let defaultData: Record<string, any> = {};
    switch (type) {
      case "heading":
        defaultData = { level: 2, text: "New Section Heading" };
        break;
      case "paragraph":
        defaultData = { text: "Write paragraph details here..." };
        break;
      case "code":
        defaultData = { language: "bash", filename: "script.sh", code: "nmap -sV target.internal" };
        break;
      case "terminal":
        defaultData = { title: "terminal", command: "whoami", output: "wwww82" };
        break;
      case "warning":
        defaultData = { title: "Security Note", content: "Always ensure you have explicit written permission." };
        break;
      case "finding":
        defaultData = {
          title: "Vulnerability Finding",
          severity: "HIGH",
          impact: "Unauthorized user may access...",
          recommendation: "Implement strict server-side authorization guards.",
        };
        break;
      case "image":
        defaultData = { url: "", caption: "Screenshot analysis", alt: "Vulnerability screenshot" };
        break;
      case "divider":
        defaultData = {};
        break;
    }
    setBlocks((prev) => [...prev, { type, data: defaultData }]);
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    setBlocks((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const updateBlockData = (index: number, key: string, value: any) => {
    setBlocks((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        data: { ...copy[index].data, [key]: value },
      };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !excerpt) {
      error("Please fill in Title, Slug, and Excerpt");
      return;
    }

    setIsSaving(true);

    const isMd = editorMode === "markdown";
    const payload = {
      title,
      slug,
      category,
      difficulty,
      status,
      featured,
      excerpt,
      coverImage: coverImage || null,
      tags: tagsInput.split(",").map((s: string) => s.trim()).filter(Boolean),
      isMarkdown: isMd,
      content: isMd ? markdownContent : JSON.stringify(blocks),
      blocks: isMd ? [] : blocks,
    };

    try {
      const endpoint = isEditing
        ? `/api/admin/writeups/${initialData.id}`
        : "/api/admin/writeups";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        success(isEditing ? "Write-up updated successfully" : "Write-up created successfully");
        router.push("/admin/writeups");
        router.refresh();
      } else {
        error(data.error || "Failed to save write-up");
      }
    } catch {
      error("Network error saving write-up");
    } finally {
      setIsSaving(false);
    }
  };

  const previewContentString = editorMode === "markdown" ? markdownContent : JSON.stringify(blocks);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/admin/writeups"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-text"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to write-ups</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            className="font-mono"
          >
            <Eye className="w-4 h-4 mr-1.5 text-secondary" />
            Live Preview
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="font-mono"
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isEditing ? "Save Changes" : "Publish Write-up"}
          </Button>
        </div>
      </div>

      {/* Basic Metadata Box */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <h2 className="text-sm font-bold font-mono text-secondary uppercase tracking-wider">
          1. Write-up Metadata
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Article Title *"
            placeholder="e.g. Understanding IDOR: Deep Dive into BOLA"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. understanding-and-exploiting-idor"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-secondary focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={handleAutoSlug}
                className="px-3 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-muted hover:text-secondary transition-colors shrink-0"
                title="Generate slug from title"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-secondary focus:outline-none"
            >
              {WRITEUP_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface text-text">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-secondary focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-secondary focus:outline-none"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured-writeup"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-secondary cursor-pointer"
            />
            <label htmlFor="featured-writeup" className="text-xs font-mono text-text cursor-pointer select-none">
              Featured on Home
            </label>
          </div>
        </div>

        <Textarea
          label="Article Excerpt *"
          placeholder="Concise technical summary for cards and search snippets..."
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />

        {/* Cover image */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-medium text-muted uppercase">
            Cover Image URL / Upload
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="https://... or /uploads/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-secondary focus:outline-none"
            />
            <label className="inline-flex items-center justify-center px-4 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text hover:border-secondary/50 cursor-pointer transition-colors shrink-0">
              <ImageIcon className="w-4 h-4 mr-2 text-secondary" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          placeholder="Web Security, IDOR, Authorization, Burp Suite"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {/* Editor Mode Switcher Bar */}
      <div className="p-4 rounded-cyber border border-border bg-[#0b0e14] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted uppercase">Editor Engine:</span>
          <div className="flex rounded-cyber border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setEditorMode("blocks")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                editorMode === "blocks"
                  ? "bg-secondary text-black font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Structured Blocks ({blocks.length})
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("markdown")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                editorMode === "markdown"
                  ? "bg-secondary text-black font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Markdown Direct
            </button>
          </div>
        </div>

        {editorMode === "blocks" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("heading")}
              className="text-xs font-mono"
            >
              + Heading
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("paragraph")}
              className="text-xs font-mono"
            >
              + Paragraph
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("code")}
              className="text-xs font-mono text-primary"
            >
              <Code className="w-3.5 h-3.5 mr-1" />
              + Code
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("terminal")}
              className="text-xs font-mono text-secondary"
            >
              <Terminal className="w-3.5 h-3.5 mr-1" />
              + Terminal
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("warning")}
              className="text-xs font-mono text-amber-400"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              + Warning
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("finding")}
              className="text-xs font-mono text-red-400"
            >
              <Bug className="w-3.5 h-3.5 mr-1" />
              + Finding
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("image")}
              className="text-xs font-mono"
            >
              <ImageIcon className="w-3.5 h-3.5 mr-1" />
              + Image
            </Button>
          </div>
        )}
      </div>

      {/* Editor Content Body */}
      {editorMode === "markdown" ? (
        <div className="p-6 rounded-cyber border border-border bg-surface space-y-3">
          <label className="block text-xs font-mono font-medium text-muted uppercase">
            Markdown Source
          </label>
          <textarea
            rows={20}
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            placeholder="# Write your markdown write-up here...&#10;&#10;## 1. Vulnerability Analysis&#10;&#10;```bash&#10;$ nmap -sV target.internal&#10;```"
            className="w-full p-4 bg-[#080a0e] border border-border rounded-cyber font-mono text-xs sm:text-sm text-text leading-relaxed focus:border-secondary focus:outline-none"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className="p-5 rounded-cyber border border-border bg-surface space-y-4 relative group"
            >
              {/* Block Header Toolbar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-secondary">
                    Block #{idx + 1}: {block.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded bg-surface-secondary text-muted hover:text-text disabled:opacity-30"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, "down")}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded bg-surface-secondary text-muted hover:text-text disabled:opacity-30"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="p-1 rounded bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900/60 hover:text-red-200 ml-2"
                    title="Delete Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Block Form Fields Based on Type */}
              {block.type === "heading" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono text-muted uppercase">Level</label>
                    <select
                      value={block.data.level || 2}
                      onChange={(e) => updateBlockData(idx, "level", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text"
                    >
                      <option value={1}>H1 (Main Title)</option>
                      <option value={2}>H2 (Major Section)</option>
                      <option value={3}>H3 (Sub Section)</option>
                      <option value={4}>H4 (Minor)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      label="Heading Text"
                      value={block.data.text || ""}
                      onChange={(e) => updateBlockData(idx, "text", e.target.value)}
                      placeholder="e.g. 1. Deep Dive into Authorization Matrix"
                    />
                  </div>
                </div>
              )}

              {block.type === "paragraph" && (
                <Textarea
                  label="Paragraph Content (HTML / Markdown supported)"
                  rows={4}
                  value={block.data.text || ""}
                  onChange={(e) => updateBlockData(idx, "text", e.target.value)}
                  placeholder="Explain the security mechanism, vulnerability findings, or methodology..."
                />
              )}

              {block.type === "code" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-mono text-muted uppercase">Syntax Language</label>
                      <select
                        value={block.data.language || "bash"}
                        onChange={(e) => updateBlockData(idx, "language", e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text"
                      >
                        {CODE_LANGUAGES.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Filename / Label (optional)"
                      value={block.data.filename || ""}
                      onChange={(e) => updateBlockData(idx, "filename", e.target.value)}
                      placeholder="e.g. exploit.py or nginx.conf"
                    />
                  </div>
                  <Textarea
                    label="Code Snippet"
                    rows={6}
                    value={block.data.code || ""}
                    onChange={(e) => updateBlockData(idx, "code", e.target.value)}
                    placeholder="paste code here..."
                    className="font-mono text-xs"
                  />
                </div>
              )}

              {block.type === "terminal" && (
                <div className="space-y-3">
                  <Input
                    label="Terminal Title"
                    value={block.data.title || "terminal"}
                    onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                    placeholder="e.g. terminal — recon probe"
                  />
                  <Input
                    label="Executed Command"
                    value={block.data.command || ""}
                    onChange={(e) => updateBlockData(idx, "command", e.target.value)}
                    placeholder="e.g. curl -s -X POST https://api.internal/auth"
                  />
                  <Textarea
                    label="Terminal Output"
                    rows={4}
                    value={block.data.output || ""}
                    onChange={(e) => updateBlockData(idx, "output", e.target.value)}
                    placeholder="Command response or logs..."
                    className="font-mono text-xs"
                  />
                </div>
              )}

              {block.type === "warning" && (
                <div className="space-y-3">
                  <Input
                    label="Warning Title"
                    value={block.data.title || "Security Note"}
                    onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                  />
                  <Textarea
                    label="Disclaimer / Notice Message"
                    rows={2}
                    value={block.data.content || ""}
                    onChange={(e) => updateBlockData(idx, "content", e.target.value)}
                  />
                </div>
              )}

              {block.type === "finding" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Finding Title"
                        value={block.data.title || ""}
                        onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-mono text-muted uppercase">Severity</label>
                      <select
                        value={block.data.severity || "HIGH"}
                        onChange={(e) => updateBlockData(idx, "severity", e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                        <option value="INFORMATIONAL">INFORMATIONAL</option>
                      </select>
                    </div>
                  </div>
                  <Textarea
                    label="Impact"
                    rows={2}
                    value={block.data.impact || ""}
                    onChange={(e) => updateBlockData(idx, "impact", e.target.value)}
                  />
                  <Textarea
                    label="Remediation Recommendation"
                    rows={2}
                    value={block.data.recommendation || ""}
                    onChange={(e) => updateBlockData(idx, "recommendation", e.target.value)}
                  />
                </div>
              )}

              {block.type === "image" && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      label="Image URL"
                      value={block.data.url || ""}
                      onChange={(e) => updateBlockData(idx, "url", e.target.value)}
                      placeholder="/uploads/... or https://..."
                    />
                    <div className="pt-6 shrink-0">
                      <label className="inline-flex items-center px-4 py-2.5 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text hover:border-secondary cursor-pointer transition-colors">
                        <ImageIcon className="w-4 h-4 mr-1.5 text-secondary" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <Input
                    label="Caption"
                    value={block.data.caption || ""}
                    onChange={(e) => updateBlockData(idx, "caption", e.target.value)}
                    placeholder="Figure 1: HTTP header injection response"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <Link href="/admin/writeups">
          <Button variant="ghost" size="md">
            Cancel
          </Button>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setIsPreviewOpen(true)}
          className="font-mono"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="font-mono"
          isLoading={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? "Save Write-up Changes" : "Publish Write-up"}
        </Button>
      </div>

      {/* Live Preview Modal */}
      <Dialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Live Preview: ${title || "Untitled Write-up"}`}
        maxWidth="4xl"
      >
        <div className="space-y-6">
          <div className="border-b border-border pb-4 space-y-2">
            <span className="text-xs font-mono text-secondary uppercase">{category}</span>
            <h1 className="text-2xl font-bold font-mono text-text">{title || "Untitled Write-up"}</h1>
            <p className="text-xs text-muted">{excerpt}</p>
          </div>
          <WriteUpRenderer
            content={previewContentString}
            isMarkdown={editorMode === "markdown"}
          />
        </div>
      </Dialog>
    </form>
  );
}
