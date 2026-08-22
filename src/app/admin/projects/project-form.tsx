"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Bug,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SeverityType } from "@/components/ui/badge";

const CATEGORIES = [
  "Web Security",
  "Network Security",
  "Cloud Security",
  "Security Automation",
  "Digital Forensics",
  "OSINT",
  "Threat Intelligence",
  "Secure Development",
  "CTF",
  "Security Research",
];

interface FindingItem {
  id?: string;
  title: string;
  severity: SeverityType;
  impact: string;
  recommendation: string;
}

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "Web Security");
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [year, setYear] = useState(initialData?.year || "2026");
  const [role, setRole] = useState(initialData?.role || "Security Researcher");
  const [duration, setDuration] = useState(initialData?.duration || "3 Months");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");

  // Tags & Tools
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags
      ? (typeof initialData.tags === "string" ? JSON.parse(initialData.tags) : initialData.tags).join(", ")
      : ""
  );
  const [toolsInput, setToolsInput] = useState(
    initialData?.tools
      ? (typeof initialData.tools === "string" ? JSON.parse(initialData.tools) : initialData.tools).join(", ")
      : ""
  );
  const [techInput, setTechInput] = useState(
    initialData?.technologies
      ? (typeof initialData.technologies === "string" ? JSON.parse(initialData.technologies) : initialData.technologies).join(", ")
      : ""
  );

  // Case Study Sections
  const [caseStudyOverview, setCaseStudyOverview] = useState(initialData?.caseStudyOverview || "");
  const [caseStudyProblem, setCaseStudyProblem] = useState(initialData?.caseStudyProblem || "");
  const [caseStudyObjective, setCaseStudyObjective] = useState(initialData?.caseStudyObjective || "");
  const [caseStudyApproach, setCaseStudyApproach] = useState(initialData?.caseStudyApproach || "");
  const [caseStudyArchitecture, setCaseStudyArchitecture] = useState(initialData?.caseStudyArchitecture || "");
  const [caseStudyImplementation, setCaseStudyImplementation] = useState(initialData?.caseStudyImplementation || "");
  const [caseStudySecurityAnalysis, setCaseStudySecurityAnalysis] = useState(initialData?.caseStudySecurityAnalysis || "");
  const [caseStudyResult, setCaseStudyResult] = useState(initialData?.caseStudyResult || "");
  const [caseStudyLessons, setCaseStudyLessons] = useState(initialData?.caseStudyLessons || "");

  // Findings
  const [findings, setFindings] = useState<FindingItem[]>(initialData?.findings || []);

  const handleAutoSlug = () => {
    const s = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    setSlug(s);
  };

  const handleAddFinding = () => {
    setFindings((prev) => [
      ...prev,
      {
        title: "",
        severity: "HIGH",
        impact: "",
        recommendation: "",
      },
    ]);
  };

  const handleRemoveFinding = (index: number) => {
    setFindings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFindingChange = (index: number, field: keyof FindingItem, value: any) => {
    setFindings((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCoverImage(data.url);
        success("Cover image uploaded successfully!");
      } else {
        error(data.error || "Upload failed");
      }
    } catch {
      error("Network error during file upload");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      error("Please fill in Title, Slug, and Description");
      return;
    }

    setIsSaving(true);

    const payload = {
      title,
      slug,
      category,
      status,
      featured,
      year,
      role,
      duration,
      description,
      coverImage: coverImage || null,
      tags: tagsInput.split(",").map((s: string) => s.trim()).filter(Boolean),
      tools: toolsInput.split(",").map((s: string) => s.trim()).filter(Boolean),
      technologies: techInput.split(",").map((s: string) => s.trim()).filter(Boolean),
      caseStudyOverview,
      caseStudyProblem,
      caseStudyObjective,
      caseStudyApproach,
      caseStudyArchitecture,
      caseStudyImplementation,
      caseStudySecurityAnalysis,
      caseStudyResult,
      caseStudyLessons,
      findings,
    };

    try {
      const endpoint = isEditing
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        success(isEditing ? "Project updated successfully" : "Project created successfully");
        router.push("/admin/projects");
        router.refresh();
      } else {
        error(data.error || "Failed to save project");
      }
    } catch {
      error("Network error saving project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-text"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to projects</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="font-mono"
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isEditing ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </div>

      {/* Basic Metadata Box */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project Title *"
            placeholder="e.g. ReconFlow: Attack Surface Discovery Engine"
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
                placeholder="e.g. reconflow-security-scanner"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-primary focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={handleAutoSlug}
                className="px-3 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-muted hover:text-primary transition-colors shrink-0"
                title="Generate slug from title"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-primary focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface text-text">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-medium text-muted uppercase">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-primary focus:outline-none"
            >
              <option value="PUBLISHED" className="bg-surface text-text">PUBLISHED</option>
              <option value="DRAFT" className="bg-surface text-text">DRAFT</option>
              <option value="ARCHIVED" className="bg-surface text-text">ARCHIVED</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs font-mono text-text cursor-pointer select-none">
              Featured on Homepage
            </label>
          </div>
        </div>

        <Textarea
          label="Short Description *"
          placeholder="Brief summary of the security project for cards and search..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Cover Image */}
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
              className="flex-1 px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-primary focus:outline-none"
            />
            <label className="inline-flex items-center justify-center px-4 py-2 bg-surface-secondary border border-border rounded-cyber text-xs font-mono text-text hover:border-primary/50 cursor-pointer transition-colors shrink-0">
              <ImageIcon className="w-4 h-4 mr-2 text-primary" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Year"
            placeholder="2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Input
            label="Role"
            placeholder="Lead Security Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input
            label="Duration"
            placeholder="3 Months"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Tags (comma separated)"
            placeholder="Python, FastAPI, Nuclei"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <Input
            label="Tools (comma separated)"
            placeholder="Docker, Burp Suite, Go"
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
          />
          <Input
            label="Technologies (comma separated)"
            placeholder="Microservices, GraphQL"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
          />
        </div>
      </div>

      {/* Case Study Sections Box */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <h2 className="text-sm font-bold font-mono text-secondary uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>2. Case Study Deep Dive (Optional Sections)</span>
        </h2>

        <Textarea
          label="Overview & Context"
          placeholder="Background context and attack surface scope..."
          rows={3}
          value={caseStudyOverview}
          onChange={(e) => setCaseStudyOverview(e.target.value)}
        />

        <Textarea
          label="Problem Statement"
          placeholder="What specific security challenge or architectural gap was addressed?"
          rows={3}
          value={caseStudyProblem}
          onChange={(e) => setCaseStudyProblem(e.target.value)}
        />

        <Textarea
          label="Objective & Scope"
          placeholder="Goals, penetration testing targets, or research objectives..."
          rows={3}
          value={caseStudyObjective}
          onChange={(e) => setCaseStudyObjective(e.target.value)}
        />

        <Textarea
          label="Technical Approach"
          placeholder="Methodology, reconnaissance strategy, or exploit synthesis..."
          rows={3}
          value={caseStudyApproach}
          onChange={(e) => setCaseStudyApproach(e.target.value)}
        />

        <Textarea
          label="System & Threat Architecture"
          placeholder="ASCII diagrams, component layout, or dataflow analysis..."
          rows={4}
          value={caseStudyArchitecture}
          onChange={(e) => setCaseStudyArchitecture(e.target.value)}
        />

        <Textarea
          label="Implementation Details"
          placeholder="Core logic, concurrency handlers, or exploit mechanics..."
          rows={3}
          value={caseStudyImplementation}
          onChange={(e) => setCaseStudyImplementation(e.target.value)}
        />

        <Textarea
          label="Security Analysis"
          placeholder="Evaluation against testbed infrastructure and attack simulation results..."
          rows={3}
          value={caseStudySecurityAnalysis}
          onChange={(e) => setCaseStudySecurityAnalysis(e.target.value)}
        />

        <Textarea
          label="Results & Impact"
          placeholder="Quantified outcome, vulnerability mitigation, or detection rates..."
          rows={3}
          value={caseStudyResult}
          onChange={(e) => setCaseStudyResult(e.target.value)}
        />

        <Textarea
          label="Lessons Learned"
          placeholder="Key security takeaways and architectural defensive recommendations..."
          rows={3}
          value={caseStudyLessons}
          onChange={(e) => setCaseStudyLessons(e.target.value)}
        />
      </div>

      {/* Security Findings Manager */}
      <div className="p-6 rounded-cyber border border-border bg-surface space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold font-mono text-text uppercase tracking-wider">
              3. Security Findings ({findings.length})
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFinding}
            className="font-mono"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Finding
          </Button>
        </div>

        {findings.length === 0 ? (
          <p className="text-xs font-mono text-muted text-center py-6">
            No specific vulnerability findings attached to this project. Click &ldquo;Add Finding&rdquo; to add one.
          </p>
        ) : (
          <div className="space-y-6">
            {findings.map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-cyber border border-border/80 bg-surface-secondary/40 space-y-4 relative"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono font-bold text-primary">
                    Finding #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFinding(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove Finding"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Finding Title *"
                      placeholder="e.g. Critical IDOR on Invoice Endpoint"
                      value={f.title}
                      onChange={(e) => handleFindingChange(idx, "title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono font-medium text-muted uppercase">
                      Severity
                    </label>
                    <select
                      value={f.severity}
                      onChange={(e) => handleFindingChange(idx, "severity", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-cyber text-sm text-text font-mono focus:border-primary focus:outline-none"
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
                  label="Impact *"
                  placeholder="Describe the threat impact and business consequence..."
                  rows={2}
                  value={f.impact}
                  onChange={(e) => handleFindingChange(idx, "impact", e.target.value)}
                  required
                />

                <Textarea
                  label="Remediation Recommendation *"
                  placeholder="How should engineering teams fix and verify this vulnerability?"
                  rows={2}
                  value={f.recommendation}
                  onChange={(e) => handleFindingChange(idx, "recommendation", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <Link href="/admin/projects">
          <Button variant="ghost" size="md">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="font-mono"
          isLoading={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? "Save Project Changes" : "Publish Project"}
        </Button>
      </div>
    </form>
  );
}
